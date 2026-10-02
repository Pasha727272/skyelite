import { useEffect, useRef, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  /** When set, animated/displayed values never go below this (avoids negative flash). */
  min?: number;
};

function format(n: number, decimals: number, min?: number) {
  if (!Number.isFinite(n)) return "—";
  const v = min !== undefined ? Math.max(min, n) : n;
  return v.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  duration = 450,
  min,
}: AnimatedNumberProps) {
  const safeValue =
    min !== undefined && Number.isFinite(value) ? Math.max(min, value) : value;
  const [display, setDisplay] = useState(safeValue);
  const displayRef = useRef(safeValue);
  const frameRef = useRef(0);

  useEffect(() => {
    const from =
      min !== undefined ? Math.max(min, displayRef.current) : displayRef.current;
    const to = safeValue;
    if (from === to) return;

    const start = performance.now();
    cancelAnimationFrame(frameRef.current);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      let next = from + (to - from) * eased;
      if (min !== undefined) next = Math.max(min, next);
      displayRef.current = next;
      setDisplay(next);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
      else {
        displayRef.current = to;
        setDisplay(to);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [safeValue, duration, min]);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {format(display, decimals, min)}
      {suffix}
    </span>
  );
}
