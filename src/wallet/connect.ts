import { createSolanaClient, type SolanaClient } from "@metamask/connect-solana";
import type { SolanaProvider, WalletKind, WalletSession } from "./types";

const STORAGE_KEY = "statio.wallet";

export function shortenAddress(address: string, size = 4): string {
  if (address.length < 10) return address;
  return `${address.slice(0, size)}…${address.slice(-size)}`;
}

export function loadSession(): WalletSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WalletSession>;
    if (parsed.chain !== "solana") return null;
    if (parsed.kind !== "phantom" && parsed.kind !== "metamask") return null;
    if (!parsed.address) return null;
    return {
      kind: parsed.kind,
      address: parsed.address,
      chain: "solana",
    };
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

export function getPhantomSolana(): SolanaProvider | null {
  const fromPhantom = window.phantom?.solana;
  if (fromPhantom?.isPhantom) return fromPhantom;
  if (window.solana?.isPhantom) return window.solana;
  return null;
}

function hasMetaMask() {
  return Boolean(window.ethereum?.isMetaMask);
}

let metamaskClient: Promise<SolanaClient> | null = null;

function getMetaMaskClient() {
  if (!metamaskClient) {
    metamaskClient = createSolanaClient({
      dapp: {
        name: "STATIO",
        url: window.location.origin,
      },
      api: {
        supportedNetworks: {
          mainnet: "https://api.mainnet-beta.solana.com",
        },
      },
    });
  }
  return metamaskClient;
}

/** Warm the MetaMask Solana client so connect stays inside the click. */
export function warmMetaMask() {
  if (!hasMetaMask()) return;
  void getMetaMaskClient();
}

async function connectProvider(
  kind: WalletKind,
  provider: SolanaProvider,
): Promise<WalletSession> {
  // Call connect immediately from the click. Awaiting disconnect first
  // drops the user gesture, and Phantom never opens its popup.
  const result = await provider.connect({ onlyIfTrusted: false });
  const publicKey = result?.publicKey ?? provider.publicKey;
  if (!publicKey) {
    throw new Error("Solana wallet did not return a public key.");
  }

  return {
    kind,
    address: publicKey.toString(),
    chain: "solana",
  };
}

/**
 * Opens the Phantom extension connect popup (must run from a click handler).
 */
export async function connectPhantom(): Promise<WalletSession> {
  const provider = getPhantomSolana();
  if (!provider) {
    window.open("https://phantom.app/download", "_blank", "noopener,noreferrer");
    throw new Error(
      "Phantom extension not found. Install Phantom, then reload this page.",
    );
  }
  return connectProvider("phantom", provider);
}

/**
 * Opens MetaMask and connects its Solana account (must run from a click).
 */
export async function connectMetaMask(): Promise<WalletSession> {
  if (!hasMetaMask()) {
    window.open("https://metamask.io/download/", "_blank", "noopener,noreferrer");
    throw new Error(
      "MetaMask extension not found. Install MetaMask, then reload this page.",
    );
  }

  const client = await getMetaMaskClient();
  const wallet = client.getWallet();
  const connect = (
    wallet.features["standard:connect"] as
      | {
          connect?: () => Promise<{ accounts: { address: string }[] }>;
        }
      | undefined
  )?.connect;
  if (!connect) {
    throw new Error("This MetaMask build cannot connect a Solana account.");
  }

  const { accounts } = await connect();
  const address = accounts[0]?.address;
  if (!address) {
    throw new Error("MetaMask did not return a Solana address.");
  }

  return {
    kind: "metamask",
    address,
    chain: "solana",
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
    return;
  }

  try {
    const client = metamaskClient ? await metamaskClient : null;
    await client?.disconnect();
  } catch {
    // ignore
  }
}
