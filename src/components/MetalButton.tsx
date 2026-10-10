import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

const metalClass =
  "metal-btn inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white";

type MetalButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function MetalButton({
  children,
  className = "",
  ...props
}: MetalButtonProps) {
  return (
    <button type="button" className={`${metalClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

type MetalLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
};

export function MetalLink({
  children,
  className = "",
  ...props
}: MetalLinkProps) {
  return (
    <Link className={`${metalClass} ${className}`} {...props}>
      {children}
    </Link>
  );
}
