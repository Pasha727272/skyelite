import {
  ROBINHOOD_CHAIN,
  type Eip1193Provider,
  type SolanaProvider,
  type WalletSession,
} from "./types";

const STORAGE_KEY = "statio.wallet";

type Eip6963Detail = {
  info?: { name?: string; rdns?: string; uuid?: string };
  provider?: Eip1193Provider;
};

const eip6963Providers = new Map<string, Eip6963Detail>();

export function shortenAddress(address: string, size = 4): string {
  if (address.length < 10) return address;
  const hex = address.startsWith("0x");
  return `${address.slice(0, size + (hex ? 2 : 0))}…${address.slice(-size)}`;
}

export function loadSession(): WalletSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WalletSession;
  } catch {
    return null;
  }
}

export function saveSession(session: WalletSession | null) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

/** Keep EIP-6963 registry hot so click → eth_requestAccounts stays in the user gesture. */
export function warmWalletProviders() {
  if (typeof window === "undefined") return;

  const onAnnounce = (event: Event) => {
    const detail = (event as CustomEvent).detail as Eip6963Detail;
    const key =
      detail.info?.uuid ??
      detail.info?.rdns ??
      detail.info?.name ??
      String(eip6963Providers.size);
    if (detail.provider) eip6963Providers.set(key, detail);
  };

  window.addEventListener("eip6963:announceProvider", onAnnounce);
  window.dispatchEvent(new Event("eip6963:requestProvider"));

  // Re-request a few times — some extensions announce late
  const id = window.setInterval(() => {
    window.dispatchEvent(new Event("eip6963:requestProvider"));
  }, 800);
  window.setTimeout(() => window.clearInterval(id), 4000);
}

export function getPhantomSolana(): SolanaProvider | null {
  const fromPhantom = window.phantom?.solana;
  if (fromPhantom?.isPhantom) return fromPhantom;
  if (window.solana?.isPhantom) return window.solana;
  return null;
}

function listEvmProviders(): Eip1193Provider[] {
  const eth = window.ethereum;
  if (!eth) return [];
  if (Array.isArray(eth.providers) && eth.providers.length) return eth.providers;
  return [eth];
}

function isRobinhoodDetail(d: Eip6963Detail) {
  const name = d.info?.name?.toLowerCase() ?? "";
  const rdns = d.info?.rdns?.toLowerCase() ?? "";
  return name.includes("robinhood") || rdns.includes("robinhood");
}

function isRobinhoodProvider(p: Eip1193Provider) {
  return Boolean(p.isRobinhoodWallet || p.isRobinhood);
}

export function getRobinhoodProvider(): Eip1193Provider | null {
  if (window.robinhood) return window.robinhood;

  for (const detail of eip6963Providers.values()) {
    if (detail.provider && isRobinhoodDetail(detail)) return detail.provider;
  }

  const providers = listEvmProviders();
  const named = providers.find(isRobinhoodProvider);
  if (named) return named;

  // Inside Robinhood in-app browser the injected ethereum is usually RH
  if (
    providers.length === 1 &&
    !providers[0].isMetaMask &&
    !providers[0].isPhantom
  ) {
    return providers[0];
  }

  return null;
}

async function ensureRobinhoodChain(provider: Eip1193Provider) {
  try {
    const chainId = (await provider.request({
      method: "eth_chainId",
    })) as string;
    if (chainId.toLowerCase() === ROBINHOOD_CHAIN.chainIdHex) return;

    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ROBINHOOD_CHAIN.chainIdHex }],
    });
  } catch (err) {
    const code = (err as { code?: number })?.code;
    if (code === 4902 || code === -32603) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: ROBINHOOD_CHAIN.chainIdHex,
              chainName: ROBINHOOD_CHAIN.chainName,
              nativeCurrency: ROBINHOOD_CHAIN.nativeCurrency,
              rpcUrls: [...ROBINHOOD_CHAIN.rpcUrls],
              blockExplorerUrls: [...ROBINHOOD_CHAIN.blockExplorerUrls],
            },
          ],
        });
      } catch {
        // ignore — in-app RH may already be on chain
      }
    }
  }
}

/**
 * Opens the Phantom extension connect popup (must run from a click handler).
 * Disconnects first when already linked so Phantom always shows the approval UI.
 */
export async function connectPhantom(): Promise<WalletSession> {
  const provider = getPhantomSolana();
  if (!provider) {
    window.open("https://phantom.app/download", "_blank", "noopener,noreferrer");
    throw new Error(
      "Phantom extension not found. Install Phantom, then reload this page.",
    );
  }

  // Trusted sites reconnect silently — disconnect first so connect() shows the popup.
  try {
    if (provider.isConnected || provider.publicKey) {
      await provider.disconnect();
    }
  } catch {
    // ignore
  }

  const result = await provider.connect({ onlyIfTrusted: false });
  const publicKey = result?.publicKey;
  if (!publicKey) {
    throw new Error("Phantom did not return a public key.");
  }

  return {
    kind: "phantom",
    address: publicKey.toString(),
    chain: "solana",
  };
}

/**
 * Opens the Robinhood (or injected RH) wallet approval popup from a click.
 */
export async function connectRobinhood(): Promise<WalletSession> {
  // Refresh discovery right before connect (still sync for known providers)
  window.dispatchEvent(new Event("eip6963:requestProvider"));

  const provider = getRobinhoodProvider();
  if (!provider) {
    window.open("https://robinhood.com/wallet", "_blank", "noopener,noreferrer");
    throw new Error(
      "Robinhood Wallet not detected. Open this site in the Robinhood Wallet browser, or install a wallet that injects as Robinhood.",
    );
  }

  const accounts = (await provider.request({
    method: "eth_requestAccounts",
  })) as string[];

  if (!accounts?.[0]) {
    throw new Error("No account returned from Robinhood Wallet.");
  }

  await ensureRobinhoodChain(provider);

  return {
    kind: "robinhood",
    address: accounts[0],
    chain: "evm",
  };
}

export async function disconnectWallet(session: WalletSession | null) {
  if (!session) return;
  if (session.kind === "phantom") {
    try {
      await getPhantomSolana()?.disconnect();
    } catch {
      // ignore
    }
  }
}
