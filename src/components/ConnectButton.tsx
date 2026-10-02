import { MetalButton } from "./MetalButton";
import { useWallet } from "../wallet/WalletContext";

type ConnectButtonProps = {
  className?: string;
  label?: string;
};

/** Always keeps the metal CONNECT look — never swaps to an address chip. */
export function ConnectButton({
  className = "",
  label = "CONNECT",
}: ConnectButtonProps) {
  const { openModal } = useWallet();

  return (
    <MetalButton className={className} onClick={openModal}>
      {label}
    </MetalButton>
  );
}
