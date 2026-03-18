import React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { navLinkVariants } from "../styles/theme";

type NavLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof navLinkVariants> & {
    /** Show external-link icon. Defaults to `true` when `target="_blank"` or href starts with `http`. */
    external?: boolean;
  };

function isExternal(href: string | undefined, target: string | undefined): boolean {
  if (target === "_blank") return true;
  if (href && /^https?:\/\//.test(href)) return true;
  return false;
}

const ExternalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

export function NavLink({
  intent,
  size,
  underline,
  external,
  className,
  children,
  href,
  target,
  rel,
  ...props
}: NavLinkProps) {
  const showExternal = external ?? isExternal(href, target);
  const safeRel = showExternal && !rel ? "noopener noreferrer" : rel;
  const safeTarget = showExternal && !target ? "_blank" : target;

  return (
    <a
      href={href}
      target={safeTarget}
      rel={safeRel}
      className={cn(navLinkVariants({ intent, size, underline }), className)}
      {...props}
    >
      {children}
      {showExternal && <ExternalIcon />}
    </a>
  );
}
