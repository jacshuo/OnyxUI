import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { progressBarVariants } from "../../../styles/theme/feedback";

export type ProgressBarProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof progressBarVariants> & {
    /** Current value 0–100 */
    value?: number;
    /** Show the percentage label inside the bar */
    showLabel?: boolean;
    /** Enable the indeterminate (loading) animation — ignores `value` */
    indeterminate?: boolean;
    /** Enable the shine / pulse glow animation on the fill */
    animated?: boolean;
    /** Duration of the value transition in ms @default 500 */
    duration?: number;
  };

export function ProgressBar({
  value = 0,
  size,
  intent,
  edge,
  showLabel = false,
  indeterminate = false,
  animated = false,
  duration = 500,
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  /* track previous width so the fill animates smoothly */
  const [displayWidth, setDisplayWidth] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (indeterminate) return;
    // wait one frame so the browser paints width:0 first on mount
    rafRef.current = requestAnimationFrame(() => {
      setDisplayWidth(clampedValue);
    });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [clampedValue, indeterminate]);

  const showInlineLabel = showLabel && !indeterminate && size !== "xs" && size !== "sm";

  const bar = (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(progressBarVariants({ size, intent, edge }), className)}
      {...props}
    >
      {indeterminate ? (
        <div className="progress-fill absolute top-0 h-full rounded-full animate-progress-indeterminate" />
      ) : (
        <div
          className={cn(
            "progress-fill h-full rounded-full transition-[width] ease-out",
            animated && "animate-progress-shine",
          )}
          style={{
            width: `${displayWidth}%`,
            transitionDuration: `${duration}ms`,
          }}
        >
          {showInlineLabel && (
            <span className="flex h-full items-center justify-end pr-2 text-[10px] font-semibold text-white">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
    </div>
  );

  // Portal edge bars to document.body so they are never inside an overflow
  // container — iOS treats position:fixed inside overflow:auto as position:absolute.
  if (edge === "top" || edge === "bottom") {
    return createPortal(bar, document.body);
  }

  return bar;
}
