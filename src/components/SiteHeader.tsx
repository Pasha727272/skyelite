import { useState, type MouseEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { CopyCA } from "./CopyCA";
import { MetalLink } from "./MetalButton";
import { ConnectButton } from "./ConnectButton";

const NAV_LEFT = [
  { label: "OATHS", href: "/#loop" },
  { label: "BREAK", href: "/#break" },
] as const;

const NAV_RIGHT = [
  { label: "BOARD", href: "/#board" },
  { label: "TOKEN", href: "/#token" },
] as const;

const NAV_ALL = [...NAV_LEFT, ...NAV_RIGHT];

type SiteHeaderProps = {
  variant?: "home" | "terminal";
};

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="px-1.5 text-[10px] font-semibold tracking-[0.14em] text-white/80 transition-colors hover:sol"
    >
      {label}
    </a>
  );
}

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  if (window.location.hash) {
    const { pathname, search } = window.location;
    window.history.replaceState(null, "", `${pathname}${search}`);
  }
}

export function SiteHeader({ variant = "home" }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function goHomeTop(e: MouseEvent) {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      // wait a tick for route paint, then pin to top
      window.requestAnimationFrame(() => scrollToTop());
      return;
    }
    scrollToTop();
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 via-black/35 to-transparent" />

      {/* Compact bar: slight air from top edge, not stretched into a tall empty band */}
      <div className="relative mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 pt-3.5 pb-2 md:px-8">
        <div className="flex min-w-[44px] items-center gap-2 justify-self-start">
          {variant === "terminal" && (
            <Link
              to="/"
              onClick={goHomeTop}
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 transition-colors hover:border-[#14C99A]/55 hover:sol"
              aria-label="Back to home"
            >
              ←
            </Link>
          )}
          <button
            type="button"
            className="pointer-events-auto text-white md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {variant === "home" ? (
          <nav className="pointer-events-auto hidden justify-self-center md:block">
            <div className="flex items-center gap-1 rounded-full border border-white/25 bg-black/55 px-3.5 py-1 shadow-[0_8px_28px_rgba(0,0,0,0.45)] backdrop-blur-md">
              <div className="flex items-center gap-3.5 pr-1">
                {NAV_LEFT.map((item) => (
                  <NavLink key={item.label} href={item.href} label={item.label} />
                ))}
              </div>

              <a
                href="/"
                onClick={goHomeTop}
                className="mx-0.5 flex h-10 w-10 shrink-0 items-center justify-center"
                aria-label="Back to top"
              >
                <img
                  src="/logo.png?v=3"
                  alt="STATIO"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain drop-shadow-[0_0_14px_rgba(135,86,240,0.45)]"
                />
              </a>

              <div className="flex items-center gap-3.5 pl-1">
                {NAV_RIGHT.map((item) => (
                  <NavLink key={item.label} href={item.href} label={item.label} />
                ))}
              </div>
            </div>
          </nav>
        ) : (
          <a
            href="/"
            onClick={goHomeTop}
            className="pointer-events-auto flex items-center gap-2 justify-self-center"
            aria-label="Back to top"
          >
            <img
              src="/logo.png?v=3"
              alt="STATIO"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="text-sm font-bold tracking-[0.08em] text-white">
              STATIO
            </span>
          </a>
        )}

        <div className="pointer-events-auto flex items-center justify-end gap-2 justify-self-end md:gap-3">
          <CopyCA className="hidden sm:inline-flex" />
          {variant === "home" ? (
            <MetalLink
              to="/terminal"
              className="hidden min-w-[148px] sm:inline-flex"
            >
              OPEN A TICKET
            </MetalLink>
          ) : (
            <ConnectButton className="hidden min-w-[120px] sm:inline-flex" />
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="pointer-events-auto relative border-t border-white/10 bg-black/95 px-5 py-4 backdrop-blur-md md:hidden">
          <div className="mb-4 flex justify-center">
            <a href="/" aria-label="Back to top" onClick={goHomeTop}>
              <img
                src="/logo.png?v=3"
                alt="STATIO"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
            </a>
          </div>
          <ul className="flex flex-col gap-3">
            {variant === "home" &&
              NAV_ALL.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="block py-1 text-sm font-semibold tracking-wider text-white/85"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            <li>
              <CopyCA className="w-full justify-center" />
            </li>
            {variant === "home" ? (
              <li>
                <MetalLink
                  to="/terminal"
                  className="w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  OPEN A TICKET
                </MetalLink>
              </li>
            ) : (
              <li className="flex justify-center">
                <ConnectButton className="w-full" />
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
