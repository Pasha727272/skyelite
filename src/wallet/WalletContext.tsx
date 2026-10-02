import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  disconnectWallet,
  loadSession,
  saveSession,
  warmWalletProviders,
} from "./connect";
import type { WalletSession } from "./types";

type WalletContextValue = {
  session: WalletSession | null;
  connecting: boolean;
  error: string | null;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  beginConnect: () => void;
  completeConnect: (session: WalletSession) => void;
  failConnect: (message: string) => void;
  disconnect: () => Promise<void>;
  clearError: () => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<WalletSession | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    warmWalletProviders();
    const saved = loadSession();
    if (saved) setSession(saved);
  }, []);

  const openModal = useCallback(() => {
    setError(null);
    setModalOpen(true);
    // Refresh discovery when opening the modal
    warmWalletProviders();
  }, []);

  const closeModal = useCallback(() => {
    if (connecting) return;
    setModalOpen(false);
    setError(null);
  }, [connecting]);

  const beginConnect = useCallback(() => {
    setConnecting(true);
    setError(null);
  }, []);

  const completeConnect = useCallback((next: WalletSession) => {
    setSession(next);
    saveSession(next);
    setConnecting(false);
    setError(null);
    setModalOpen(false);
  }, []);

  const failConnect = useCallback((message: string) => {
    setConnecting(false);
    setError(message);
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectWallet(session);
    setSession(null);
    saveSession(null);
  }, [session]);

  const value = useMemo(
    () => ({
      session,
      connecting,
      error,
      modalOpen,
      openModal,
      closeModal,
      beginConnect,
      completeConnect,
      failConnect,
      disconnect,
      clearError: () => setError(null),
    }),
    [
      session,
      connecting,
      error,
      modalOpen,
      openModal,
      closeModal,
      beginConnect,
      completeConnect,
      failConnect,
      disconnect,
    ],
  );

  return createElement(WalletContext.Provider, { value }, children);
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
