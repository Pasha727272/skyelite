export type WalletKind = "phantom" | "metamask";

export type WalletSession = {
  kind: WalletKind;
  address: string;
  chain: "solana";
};

export type SolanaProvider = {
  isPhantom?: boolean;
  isSolflare?: boolean;
  publicKey?: { toString: () => string } | null;
  isConnected?: boolean;
  connect: (opts?: {
    onlyIfTrusted?: boolean;
  }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    handler: (...args: unknown[]) => void,
  ) => void;
};

declare global {
  interface Window {
    ethereum?: { isMetaMask?: boolean };
    solana?: SolanaProvider;
    phantom?: {
      solana?: SolanaProvider;
    };
  }
}

export {};
