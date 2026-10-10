import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { CONTRACT_ADDRESS, CONTRACT_SHORT } from "../constants";

export function CopyCA({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy contract address"
      className={`inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#121212] px-3 py-2 text-[10px] font-semibold tracking-[0.12em] text-[#cfcfcf] transition-colors hover:border-[#14C99A]/60 hover:text-white ${className}`}
    >
      <span className="text-[#9a9a9a]">CA</span>
      <span className="inline-block min-w-[7.5rem] font-medium text-white">
        {CONTRACT_SHORT}
      </span>
      {copied ? (
        <Check size={14} className="text-[#14C99A]" />
      ) : (
        <Copy size={14} className="sol" />
      )}
    </button>
  );
}
