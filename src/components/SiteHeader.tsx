import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { CopyCA } from "./CopyCA";
import { MetalLink } from "./MetalButton";
import { ConnectButton } from "./ConnectButton";

const NAV = [
  { label: "OATHS", href: "/#loop" },
  { label: "BREAK", href: "/#break" },
  { label: "BOARD", href: "/#board" },
  { label: "TOKEN", href: "/#token" },
  { label: "DOCS", href: "/#honesty" },
] as const;

type SiteHeaderProps = {
  variant?: "home" | "terminal";
};

export function SiteHeader({ variant = "home" }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/15 bg-[#ccff00]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-1.5 md:px-8 md:py-2">
        <div className="flex items-center gap-3">
          {variant === "terminal" && (
            <Link
              to="/"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/20 text-black/70 transition-colors hover:border-black/40 hover:text-black"
              aria-label="Back to home"
            >
              ←
            </Link>
          )}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="STATIO"
              width={56}
              height={56}
              className="h-12 w-12 object-contain drop-shadow-sm md:h-14 md:w-14"
            />
            <span className="text-lg font-bold tracking-[0.06em] text-black">
              STATIO
            </span>
          </Link>
        </div>

        {variant === "home" && (
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[11px] font-semibold tracking-[0.14em] text-black/75 transition-colors hover:text-black"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 md:gap-3">
          <CopyCA className="header-on-lime hidden sm:inline-flex" />
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
          <button
            type="button"
            className="text-black md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-black/15 bg-[#b8e600] px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {variant === "home" &&
              NAV.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="block py-1 text-sm font-semibold tracking-wider text-black"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            <li>
              <CopyCA className="header-on-lime w-full justify-center" />
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
