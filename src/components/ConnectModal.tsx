import { useEffect } from "react";
import { X } from "lucide-react";
import { useWallet } from "../wallet/WalletContext";
import type { WalletKind } from "../wallet/types";
import {
  connectMetaMask,
  getPhantomSolana,
  warmMetaMask,
} from "../wallet/connect";

const WALLETS = [
  {
    kind: "phantom" as const,
    name: "PHANTOM",
    blurb: "Solana · browser extension",
    icon: "/wallets/phantom.png",
  },
  {
    kind: "metamask" as const,
    name: "METAMASK",
    blurb: "Solana · MetaMask",
    icon: "/wallets/metamask.png",
  },
];

export function ConnectModal() {
  const {
    modalOpen,
    closeModal,
    connecting,
    error,
    session,
    completeConnect,
    failConnect,
    beginConnect,
    disconnect,
  } = useWallet();

  useEffect(() => {
    if (modalOpen) warmMetaMask();
  }, [modalOpen]);

  if (!modalOpen) return null;

  async function onPick(kind: WalletKind) {
    beginConnect();
    try {
      if (kind === "phantom") {
        const provider = getPhantomSolana();
        if (!provider) {
          window.open(
            "https://phantom.app/download",
            "_blank",
            "noopener,noreferrer",
          );
          throw new Error(
            "Phantom extension not found. Install Phantom, reload, then try again.",
          );
        }
        // Start Phantom's popup in this click, before any other await.
        const pending = provider.connect({ onlyIfTrusted: false });
        const result = await pending;
        const publicKey = result?.publicKey ?? provider.publicKey;
        if (!publicKey) {
          throw new Error("Phantom did not return a public key.");
        }
        completeConnect({
          kind: "phantom",
          address: publicKey.toString(),
          chain: "solana",
        });
        return;
      }

      if (!window.ethereum?.isMetaMask) {
        window.open(
          "https://metamask.io/download/",
          "_blank",
          "noopener,noreferrer",
        );
        throw new Error(
          "MetaMask extension not found. Install MetaMask, reload, then try again.",
        );
      }
      const next = await connectMetaMask();
      completeConnect(next);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" &&
              err &&
              "message" in err &&
              typeof (err as { message: unknown }).message === "string"
            ? (err as { message: string }).message
            : "Connection failed";
      if (
        msg.toLowerCase().includes("user rejected") ||
        msg.toLowerCase().includes("user cancelled") ||
        (err as { code?: number })?.code === 4001
      ) {
        failConnect("Connection cancelled in the wallet popup.");
        return;
      }
      failConnect(msg);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden
        onClick={closeModal}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Connect wallet"
        className="panel relative z-10 w-full max-w-md border-[#8756F0]/35 p-5 shadow-2xl md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-normal tracking-[0.16em] sol">
              SOLANA
            </div>
            <h2 className="text-xl font-medium tracking-wide">CONNECT</h2>
            <p className="mt-1 text-sm font-normal text-[#9a9a9a]">
              Choose a Solana wallet — your browser extension will pop up to
              approve.
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border border-[#2a2a2a] p-2 text-[#9a9a9a] transition-colors hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {session && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[#8756F0]/30 bg-[#8756F0]/10 px-3 py-2.5">
            <div className="min-w-0 text-[11px] font-normal text-[#cfcfcf]">
              Linked ·{" "}
              <span className="sol">
                {session.kind === "phantom" ? "Phantom" : "MetaMask"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void disconnect()}
              className="shrink-0 text-[10px] tracking-[0.12em] text-[#9a9a9a] underline-offset-2 hover:text-white hover:underline"
            >
              DISCONNECT
            </button>
          </div>
        )}

        <div className="space-y-3">
          {WALLETS.map((w) => (
            <button
              key={w.kind}
              type="button"
              disabled={connecting}
              onClick={() => void onPick(w.kind)}
              className="flex w-full items-center gap-4 rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3.5 text-left transition-colors hover:border-[#14C99A]/60 disabled:opacity-60"
            >
              <img
                src={w.icon}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 shrink-0 rounded-xl object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium tracking-[0.08em]">
                  {w.name}
                </span>
                <span className="mt-1 block text-[11px] font-normal text-[#9a9a9a]">
                  {w.blurb}
                </span>
              </span>
            </button>
          ))}
        </div>

        {connecting && (
          <p className="mt-4 text-center text-[11px] tracking-[0.12em] text-[#9a9a9a]">
            Approve in the wallet extension popup…
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl border border-[#ff5a3d]/40 bg-[#ff5a3d]/10 px-3 py-3 text-xs font-normal leading-relaxed text-[#ffb4a6]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
