/** Set after token launch (Telegram bot / deploy). */
export const CONTRACT_ADDRESS = "";

export const CONTRACT_SHORT = CONTRACT_ADDRESS
  ? `${CONTRACT_ADDRESS.slice(0, 6)}…${CONTRACT_ADDRESS.slice(-4)}`
  : "";
