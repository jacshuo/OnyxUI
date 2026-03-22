import React from "react";
import { cn } from "../../../lib/utils";
import { kbdVariants } from "../../../styles/theme/primitives";
import "./Kbd.css";

export type KbdSize = "xs" | "sm" | "md" | "lg";
export type KbdVariant = "default" | "outline" | "ghost";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  size?: KbdSize;
  variant?: KbdVariant;
  className?: string;
  children: React.ReactNode;
}

export interface KbdGroupProps {
  separator?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Kbd({ size = "sm", variant = "default", className, children, ...rest }: KbdProps) {
  return (
    <kbd className={cn(kbdVariants({ size, variant }), className)} {...rest}>
      {children}
    </kbd>
  );
}

export function KbdGroup({ separator = "+", className, children }: KbdGroupProps) {
  const items = React.Children.toArray(children);
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {child}
          {i < items.length - 1 && (
            <span
              className="select-none text-xs text-secondary-400 dark:text-secondary-500"
              aria-hidden
            >
              {separator}
            </span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}
