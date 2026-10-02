export const ROBINHOOD_CHAIN = {
  chainId: 4663,
  chainIdHex: "0x1237",
  chainName: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://rpc.mainnet.chain.robinhood.com"],
  blockExplorerUrls: ["https://robinhoodchain.blockscout.com"],
} as const;

export type WalletKind = "phantom" | "robinhood";

export type WalletSession = {
  kind: WalletKind;
  address: string;
  chain: "solana" | "evm";
};

export type Eip1193Provider = {
  request: (args: {
    method: string;
    params?: unknown[] | object;
  }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    handler: (...args: unknown[]) => void,
  ) => void;
  isMetaMask?: boolean;
  isPhantom?: boolean;
  isRobinhood?: boolean;
  isRobinhoodWallet?: boolean;
  providers?: Eip1193Provider[];
};

export type SolanaProvider = {
  isPhantom?: boolean;
  publicKey?: { toString: () => string } | null;
  isConnected?: boolean;
  connect: (opts?: {
    onlyIfTrusted?: boolean;
  }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  request?: (args: {
    method: string;
    params?: object;
  }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    handler: (...args: unknown[]) => void,
  ) => void;
};

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
    solana?: SolanaProvider;
    phantom?: {
      solana?: SolanaProvider;
      ethereum?: Eip1193Provider;
    };
    robinhood?: Eip1193Provider;
  }
}

export {};
