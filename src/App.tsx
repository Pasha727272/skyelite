import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Terminal } from "./pages/Terminal";
import { WalletProvider } from "./wallet/WalletContext";
import { ConnectModal } from "./components/ConnectModal";

export default function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terminal" element={<Terminal />} />
        </Routes>
        <ConnectModal />
      </BrowserRouter>
    </WalletProvider>
  );
}
