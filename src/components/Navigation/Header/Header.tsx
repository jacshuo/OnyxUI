import React from "react";
import { PanelLeft, MoreHorizontal } from "lucide-react";
import { cn } from "../../../lib/utils";
import { DropdownButton, type DropdownItem } from "../../Primitives/DropdownButton";

/* ── Types ─────────────────────────────────────────────── */

export interface HeaderNavItem {
  /** Display label. */
  label: React.ReactNode;
  /** URL or route path. */
  href?: string;
  /** Marks this item as currently active. */
  active?: boolean;
  /** Click handler (for SPA routing or custom behaviour). */
  onClick?: (e: React.MouseEvent) => void;
}

export interface HeaderAction {
  /** Unique key. Falls back to index. */
  key?: string;
  /** Icon or element to render. */
  icon: React.ReactNode;
  /** Accessible label for the button. */
  ariaLabel?: string;
  /** Click handler. */
  onClick?: (e: React.MouseEvent) => void;
  /** Render as a link instead of a button. */
  href?: string;
  /** Open in new tab (when href is set). */
  external?: boolean;
}

export interface HeaderProps {
  /** Brand text, logo element, or both. */
  brand?: React.ReactNode;
  /** Click handler on the brand element (e.g. navigate home). */
  onBrandClick?: (e: React.MouseEvent) => void;
  /** Primary navigation items displayed after the brand. */
  navItems?: HeaderNavItem[];
  /** Action buttons rendered on the right side (e.g. search, theme toggle, login). */
  actions?: HeaderAction[];
  /** Override the link component used for nav items (e.g. React-Router NavLink). */
  linkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    children: React.ReactNode;
  }>;
  /** Fixed height class. @default 'h-12' */
  height?: string;
  /** Additional class names for the root header element. */
  className?: string;
  /** Content rendered between nav items and actions (e.g. search bar). */
  children?: React.ReactNode;
  /** Show a hamburger menu button on small screens (< md) that reveals nav items. @default false */
  mobileMenu?: boolean;
  /** Custom icon for the mobile nav toggle (left side). @default <PanelLeft> */
  navMenuIcon?: React.ReactNode;
  /** Custom icon for the mobile actions toggle (right side). @default <MoreHorizontal> */
  actionsMenuIcon?: React.ReactNode;
}

/* ── Default link ──────────────────────────────────────── */

function DefaultLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

/* ── Component ─────────────────────────────────────────── */

export function Header({
  brand,
  onBrandClick,
  navItems = [],
  actions = [],
  linkComponent: Link = DefaultLink,
  height = "h-12",
  mobileMenu = false,
  navMenuIcon,
  actionsMenuIcon,
  className,
  children,
}: HeaderProps) {
  const hasNavHamburger = mobileMenu && navItems.length > 0;
  const hasActionsHamburger = mobileMenu && actions.length > 0;

  const iconBtnTriggerCls =
    "md:hidden rounded-md px-1.5 py-1.5 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 [&_svg]:h-5 [&_svg]:w-5";

  const desktopNavCls = (active?: boolean) =>
    active
      ? "text-primary-900 font-medium dark:text-primary-100"
      : "text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200 transition-colors";

  const iconBtnCls =
    "rounded-md p-1.5 text-primary-500 hover:bg-primary-100 hover:text-primary-700 dark:text-primary-400 dark:hover:bg-primary-800 dark:hover:text-primary-200 transition-colors [&_svg]:h-5 [&_svg]:w-5";

  /* Map navItems → DropdownItem (handles both href and onClick items) */
  const navDropdownItems: DropdownItem[] = navItems.map((item, i) => ({
    key: typeof item.label === "string" ? item.label : String(i),
    label: item.active ? (
      <span className="font-semibold text-primary-900 dark:text-primary-100">{item.label}</span>
    ) : (
      (item.label as React.ReactNode)
    ),
    onClick: () => {
      if (item.onClick) {
        item.onClick({ preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent);
      } else if (item.href) {
        window.location.href = item.href;
      }
    },
  }));

  /* Map actions → DropdownItem (icon + label text) */
  const actionDropdownItems: DropdownItem[] = actions.map((action, i) => ({
    key: action.key ?? String(i),
    label: (
      <span className="flex items-center gap-2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0">
        {action.icon}
        <span>{action.ariaLabel}</span>
      </span>
    ),
    onClick: () => {
      if (action.onClick) {
        action.onClick({ preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent);
      } else if (action.href) {
        if (action.external) {
          window.open(action.href, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = action.href;
        }
      }
    },
  }));

  return (
    <header
      className={cn(
        "flex shrink-0 items-center justify-between border-b px-5",
        "border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-900",
        height,
        className,
      )}
    >
      {/* ── Left: brand + mobile nav hamburger + desktop nav ── */}
      <div className="flex items-center gap-2 md:gap-6">
        {brand && (
          <div
            className={cn(
              "text-lg font-bold text-primary-800 dark:text-primary-100",
              onBrandClick && "cursor-pointer",
            )}
            onClick={onBrandClick}
            role={onBrandClick ? "button" : undefined}
            tabIndex={onBrandClick ? 0 : undefined}
            onKeyDown={
              onBrandClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onBrandClick(e as unknown as React.MouseEvent);
                    }
                  }
                : undefined
            }
          >
            {brand}
          </div>
        )}

        {/* Mobile-only nav hamburger → DropdownButton */}
        {hasNavHamburger && (
          <DropdownButton
            intent="ghost"
            size="sm"
            className={iconBtnTriggerCls}
            label={navMenuIcon ?? <PanelLeft className="h-5 w-5" />}
            items={navDropdownItems}
            align="left"
            chevron={false}
            aria-label="Open navigation"
          />
        )}

        {/* Desktop nav */}
        {navItems.length > 0 && (
          <nav
            className={cn(
              "flex items-center gap-4 text-sm",
              mobileMenu ? "hidden md:flex" : "flex",
            )}
          >
            {navItems.map((item, i) => {
              const key = typeof item.label === "string" ? item.label : i;
              const cls = desktopNavCls(item.active);
              if (item.href) {
                return (
                  <Link key={key} href={item.href} className={cls} onClick={item.onClick}>
                    {item.label}
                  </Link>
                );
              }
              return (
                <button
                  key={key}
                  type="button"
                  className={cn(cls, "cursor-pointer")}
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* ── Center ── */}
      {children && <div className="flex items-center">{children}</div>}

      {/* ── Right: desktop actions + mobile actions hamburger ── */}
      <div className="flex items-center gap-1">
        {actions.length > 0 && (
          <div className={cn("flex items-center gap-1", mobileMenu ? "hidden md:flex" : "flex")}>
            {actions.map((action, i) => {
              if (action.href) {
                return (
                  <a
                    key={action.key ?? i}
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noopener noreferrer" : undefined}
                    className={iconBtnCls}
                    aria-label={action.ariaLabel}
                    onClick={action.onClick}
                  >
                    {action.icon}
                  </a>
                );
              }
              return (
                <button
                  key={action.key ?? i}
                  type="button"
                  className={iconBtnCls}
                  aria-label={action.ariaLabel}
                  onClick={action.onClick}
                >
                  {action.icon}
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile-only actions hamburger → DropdownButton */}
        {hasActionsHamburger && (
          <DropdownButton
            intent="ghost"
            size="sm"
            className={iconBtnTriggerCls}
            label={actionsMenuIcon ?? <MoreHorizontal className="h-5 w-5" />}
            items={actionDropdownItems}
            align="right"
            chevron={false}
            aria-label="Open menu"
          />
        )}
      </div>
    </header>
  );
}
