import React, { useState, useCallback } from "react";
import { cn } from "../../../lib/utils";
import { ratingVariants } from "../../../styles/theme/primitives";
import "./Rating.css";

export type RatingSize = "sm" | "md" | "lg";
export type RatingIntent = "warning" | "danger" | "success" | "primary";

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  max?: number;
  size?: RatingSize;
  intent?: RatingIntent;
  precision?: 0.5 | 1;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  icon?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  label?: string;
  className?: string;
}

const intentFilledClass: Record<RatingIntent, string> = {
  warning: "text-warning-400",
  danger: "text-danger-400",
  success: "text-success-500",
  primary: "text-primary-500",
};

const EMPTY_CLASS = "text-secondary-200 dark:text-secondary-700";

function StarSVG({ className }: { className?: string }) {
  return (
    <svg
      className={cn("rating-icon transition-colors duration-150", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26Z" />
    </svg>
  );
}

type Fill = 0 | 0.5 | 1;

interface StarSlotVisualProps {
  fill: Fill;
  filledClass: string;
  icon?: React.ReactNode;
  emptyIcon?: React.ReactNode;
}

function StarSlotVisual({ fill, filledClass, icon, emptyIcon }: StarSlotVisualProps) {
  return (
    <span className="relative inline-flex">
      {/* Base (empty) star */}
      {emptyIcon ? (
        <span className={cn("rating-icon", EMPTY_CLASS)}>{emptyIcon}</span>
      ) : (
        <StarSVG className={EMPTY_CLASS} />
      )}
      {/* Filled overlay */}
      {fill > 0 && (
        <span
          aria-hidden
          className="absolute inset-0 overflow-hidden"
          style={{ width: fill === 0.5 ? "50%" : "100%" }}
        >
          {icon ? (
            <span className={cn("rating-icon", filledClass)}>{icon}</span>
          ) : (
            <StarSVG className={filledClass} />
          )}
        </span>
      )}
    </span>
  );
}

export function Rating({
  value: controlledValue,
  defaultValue = 0,
  max = 5,
  size = "md",
  intent = "warning",
  precision = 1,
  readOnly = false,
  disabled = false,
  onChange,
  icon,
  emptyIcon,
  label = "Rating",
  className,
}: RatingProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const isControlled = controlledValue !== undefined;
  const actualValue = isControlled ? controlledValue : internalValue;
  const displayValue = hoverValue ?? actualValue;

  const commit = useCallback(
    (v: number) => {
      if (disabled || readOnly) return;
      if (!isControlled) setInternalValue(v);
      onChange?.(v);
    },
    [disabled, readOnly, isControlled, onChange],
  );

  const clearHover = useCallback(() => {
    if (!disabled && !readOnly) setHoverValue(null);
  }, [disabled, readOnly]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled || readOnly) return;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        commit(Math.min(actualValue + precision, max));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        commit(Math.max(actualValue - precision, 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        commit(0);
      } else if (e.key === "End") {
        e.preventDefault();
        commit(max);
      }
    },
    [disabled, readOnly, actualValue, precision, max, commit],
  );

  const getFill = (slot: number): Fill => {
    if (displayValue >= slot) return 1;
    if (precision === 0.5 && displayValue >= slot - 0.5) return 0.5;
    return 0;
  };

  const filledClass = intentFilledClass[intent];
  const interactive = !readOnly && !disabled;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        ratingVariants({ size }),
        disabled && "opacity-50 cursor-not-allowed",
        interactive && "cursor-pointer",
        className,
      )}
      onMouseLeave={interactive ? clearHover : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
    >
      {Array.from({ length: max }, (_, i) => {
        const slot = i + 1;
        const fill = getFill(slot);
        const visual = (
          <StarSlotVisual fill={fill} filledClass={filledClass} icon={icon} emptyIcon={emptyIcon} />
        );

        if (!interactive) {
          return (
            <span
              key={slot}
              role="radio"
              aria-label={`${slot} star${slot !== 1 ? "s" : ""}`}
              aria-checked={Math.round(actualValue) === slot}
            >
              {visual}
            </span>
          );
        }

        const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
          if (precision === 0.5) {
            const rect = e.currentTarget.getBoundingClientRect();
            const half = e.clientX - rect.left < rect.width / 2;
            setHoverValue(half ? slot - 0.5 : slot);
          } else {
            setHoverValue(slot);
          }
        };

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
          if (precision === 0.5) {
            const rect = e.currentTarget.getBoundingClientRect();
            const half = e.clientX - rect.left < rect.width / 2;
            commit(half ? slot - 0.5 : slot);
          } else {
            commit(slot);
          }
        };

        const roundedActual = Math.round(actualValue / precision) * precision;
        const isSelected =
          roundedActual === slot || (precision === 0.5 && roundedActual === slot - 0.5);
        const tabIndex = isSelected || (actualValue === 0 && slot === 1) ? 0 : -1;

        return (
          <button
            key={slot}
            type="button"
            role="radio"
            aria-label={`${slot} star${slot !== 1 ? "s" : ""}`}
            aria-checked={Math.round(actualValue) === slot}
            tabIndex={tabIndex}
            className="border-0 bg-transparent p-0 cursor-pointer rounded transition-transform duration-100 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseMove}
            onClick={handleClick}
          >
            {visual}
          </button>
        );
      })}
    </div>
  );
}
