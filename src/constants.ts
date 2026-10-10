/** Solana mint. Set after token launch (Telegram bot / deploy). */
export const CONTRACT_ADDRESS: string = "";

export const EXPLORER_URL = CONTRACT_ADDRESS
  ? `https://solscan.io/token/${CONTRACT_ADDRESS}`
  : "https://solscan.io";

export const CONTRACT_SHORT = CONTRACT_ADDRESS
  ? `${CONTRACT_ADDRESS.slice(0, 6)}…${CONTRACT_ADDRESS.slice(-4)}`
  : "";
