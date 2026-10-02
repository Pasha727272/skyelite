type MarqueeTickerProps = {
  text: string;
  className?: string;
};

export function MarqueeTicker({ text, className = "" }: MarqueeTickerProps) {
  const line = `${text.trim()} · `;
  return (
    <div
      className={`ticker-rail overflow-hidden border-t border-[#2a2a2a] bg-[#080808] py-2.5 ${className}`}
    >
      <div className="ticker-track">
        <span className="ticker-segment">{line.repeat(4)}</span>
        <span className="ticker-segment" aria-hidden>
          {line.repeat(4)}
        </span>
      </div>
    </div>
  );
}
