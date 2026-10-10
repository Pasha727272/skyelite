import { useRef, useState, type MouseEvent } from "react";

export function HeroPortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    // Clamp so the marker never leaves Franklin's box
    setPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }

  return (
    <div
      ref={ref}
      className="hero-portrait group relative aspect-square w-full max-w-[620px] justify-self-end overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a]"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        // Fade out in place — do not snap marker back to center
        setActive(false);
      }}
      onMouseMove={onMove}
    >
      <img
        src="/hero-franklin.png?v=bw"
        alt=""
        className="hero-portrait-img h-full w-full object-cover"
        draggable={false}
      />

      <img
        src="/hero-franklin.png?v=bw"
        alt=""
        aria-hidden
        className="hero-portrait-lit pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{
          opacity: active ? 1 : 0,
          WebkitMaskImage: `radial-gradient(circle 160px at ${pos.x}% ${pos.y}%, #000 0%, #000 35%, transparent 72%)`,
          maskImage: `radial-gradient(circle 160px at ${pos.x}% ${pos.y}%, #000 0%, #000 35%, transparent 72%)`,
        }}
        draggable={false}
      />

      <div
        className="hero-portrait-dots"
        style={{ opacity: active ? 0.4 : 0.22 }}
        aria-hidden
      />

      <div
        className="hero-portrait-beam"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(circle 150px at ${pos.x}% ${pos.y}%, rgba(135,86,240,0.22) 0%, transparent 70%)`,
        }}
        aria-hidden
      />

      <div
        className="hero-portrait-ring"
        style={{
          opacity: active ? 1 : 0,
          left: `${pos.x}%`,
          top: `${pos.y}%`,
        }}
        aria-hidden
      />

      <div
        className="hero-portrait-hline"
        style={{
          opacity: active ? 0.85 : 0,
          top: `${pos.y}%`,
        }}
        aria-hidden
      />
    </div>
  );
}
