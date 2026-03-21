import React, { useCallback, useRef, useState, useId } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { sliderVariants } from "../../../styles/theme/primitives";
import "./Slider.css";

/* ── Types ────────────────────────────────────────────── */

type SliderBaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> &
  VariantProps<typeof sliderVariants> & {
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    /** Display the current value above the thumb. */
    showValue?: boolean;
    /** Format the displayed value. */
    formatValue?: (value: number) => string;
    label?: string;
  };

export type SliderProps = SliderBaseProps & {
  mode?: "single";
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
};

export type SliderRangeProps = SliderBaseProps & {
  mode: "range";
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
};

/* ── helpers ──────────────────────────────────────────── */

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function snapToStep(v: number, min: number, step: number) {
  return Math.round((v - min) / step) * step + min;
}

function pct(v: number, min: number, max: number) {
  return ((v - min) / (max - min)) * 100;
}

function fromPct(p: number, min: number, max: number, step: number) {
  const raw = min + (p / 100) * (max - min);
  return snapToStep(raw, min, step);
}

/* ── useSliderPointer ─────────────────────────────────── */

function useSliderPointer(
  trackRef: React.RefObject<HTMLDivElement | null>,
  min: number,
  max: number,
  step: number,
  disabled?: boolean,
  onMove?: (p: number) => void,
) {
  const dragging = useRef(false);

  const getPct = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const track = trackRef.current;
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const raw = ((clientX - rect.left) / rect.width) * 100;
      return clamp(raw, 0, 100);
    },
    [trackRef],
  );

  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragging.current = true;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const raw = ((e.clientX - rect.left) / rect.width) * 100;
      onMove?.(fromPct(clamp(raw, 0, 100), min, max, step));
    },
    [disabled, getPct, min, max, step, onMove, trackRef],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || disabled) return;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const raw = ((e.clientX - rect.left) / rect.width) * 100;
      onMove?.(fromPct(clamp(raw, 0, 100), min, max, step));
    },
    [disabled, min, max, step, onMove, trackRef],
  );

  const stopDrag = useCallback(() => {
    dragging.current = false;
  }, []);

  return { startDrag, onPointerMove, stopDrag };
}

/* ── Slider (single) ──────────────────────────────────── */

export function Slider({
  mode,
  value: valueProp,
  defaultValue = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  intent,
  size,
  disabled,
  showValue = false,
  formatValue = String,
  label,
  className,
  id: propId,
  ...props
}: SliderProps) {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp! : internal;

  const autoId = useId();
  const id = propId ?? autoId;
  const trackRef = useRef<HTMLDivElement>(null);

  const set = useCallback(
    (v: number) => {
      const clamped = clamp(v, min, max);
      if (!controlled) setInternal(clamped);
      onChange?.(clamped);
    },
    [controlled, min, max, onChange],
  );

  const { startDrag, onPointerMove, stopDrag } = useSliderPointer(
    trackRef,
    min,
    max,
    step,
    disabled,
    set,
  );

  const fillPct = pct(value, min, max);

  const handleKey = (e: React.KeyboardEvent) => {
    const delta =
      e.key === "ArrowRight" || e.key === "ArrowUp"
        ? step
        : e.key === "ArrowLeft" || e.key === "ArrowDown"
          ? -step
          : e.key === "Home"
            ? -(value - min)
            : e.key === "End"
              ? max - value
              : 0;
    if (delta !== 0) {
      e.preventDefault();
      set(value + delta);
    }
  };

  return (
    <div className={cn("slider-root flex flex-col gap-1", className)}>
      {/* sr-only range input — labelable native element for htmlFor / FormItem wiring */}
      <input
        type="range"
        id={id}
        className="sr-only"
        tabIndex={-1}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        readOnly
        onChange={() => {}}
      />
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={id}
              className="text-sm font-medium text-primary-700 dark:text-primary-300"
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {formatValue(value)}
            </span>
          )}
        </div>
      )}
      <div
        {...props}
        ref={trackRef}
        className={cn(
          sliderVariants({ intent, size }),
          disabled && "opacity-40 cursor-not-allowed",
        )}
        onPointerDown={startDrag}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        style={{ touchAction: "none" }}
      >
        {/* Track background */}
        <div className="relative h-1.5 w-full grow rounded-full bg-primary-200 dark:bg-primary-700">
          {/* Fill */}
          <div
            className="slider-fill absolute left-0 top-0 h-full rounded-full transition-none"
            style={{ width: `${fillPct}%` }}
          />
          {/* Thumb */}
          <div
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-disabled={disabled}
            onKeyDown={handleKey}
            className={cn(
              "slider-thumb absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
              "h-4 w-4 rounded-full border-2 bg-white shadow-md",
              "transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:scale-110",
              !disabled && "cursor-grab active:cursor-grabbing active:scale-110",
            )}
            style={{ left: `${fillPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── SliderRange ──────────────────────────────────────── */

export function SliderRange({
  value: valueProp,
  defaultValue = [20, 80],
  onChange,
  min = 0,
  max = 100,
  step = 1,
  intent,
  size,
  disabled,
  showValue = false,
  formatValue = String,
  label,
  className,
  id: propId,
  ...props
}: SliderRangeProps) {
  const [internal, setInternal] = useState<[number, number]>(defaultValue);
  const controlled = valueProp !== undefined;
  const [lo, hi] = controlled ? valueProp! : internal;

  const trackRef = useRef<HTMLDivElement>(null);

  // Which thumb is being dragged — "lo" or "hi"
  const activeThumb = useRef<"lo" | "hi">("lo");

  const set = useCallback(
    (newVal: [number, number]) => {
      if (!controlled) setInternal(newVal);
      onChange?.(newVal);
    },
    [controlled, onChange],
  );

  const onMove = useCallback(
    (v: number) => {
      if (activeThumb.current === "lo") {
        set([clamp(v, min, hi), hi]);
      } else {
        set([lo, clamp(v, lo, max)]);
      }
    },
    [lo, hi, min, max, set],
  );

  const { startDrag, onPointerMove, stopDrag } = useSliderPointer(
    trackRef,
    min,
    max,
    step,
    disabled,
    onMove,
  );

  const loPct = pct(lo, min, max);
  const hiPct = pct(hi, min, max);

  const makeStartDrag = (thumb: "lo" | "hi") => (e: React.PointerEvent) => {
    activeThumb.current = thumb;
    startDrag(e);
  };

  const makeKeyDown = (thumb: "lo" | "hi") => (e: React.KeyboardEvent) => {
    const curr = thumb === "lo" ? lo : hi;
    const delta =
      e.key === "ArrowRight" || e.key === "ArrowUp"
        ? step
        : e.key === "ArrowLeft" || e.key === "ArrowDown"
          ? -step
          : 0;
    if (delta !== 0) {
      e.preventDefault();
      if (thumb === "lo") set([clamp(lo + delta, min, hi), hi]);
      else set([lo, clamp(hi + delta, lo, max)]);
    }
  };

  return (
    <div className={cn("slider-root flex flex-col gap-1", className)}>
      {/* sr-only range input — labelable native element for htmlFor / FormItem wiring */}
      {propId && (
        <input
          type="range"
          id={propId}
          className="sr-only"
          tabIndex={-1}
          min={min}
          max={max}
          step={step}
          value={lo}
          disabled={disabled}
          readOnly
          onChange={() => {}}
        />
      )}
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {formatValue(lo)} – {formatValue(hi)}
            </span>
          )}
        </div>
      )}
      <div
        {...props}
        ref={trackRef}
        className={cn(
          sliderVariants({ intent, size }),
          disabled && "opacity-40 cursor-not-allowed",
        )}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        style={{ touchAction: "none" }}
      >
        <div className="relative h-1.5 w-full rounded-full bg-primary-200 dark:bg-primary-700">
          {/* Fill between thumbs */}
          <div
            className="slider-fill absolute top-0 h-full rounded-full"
            style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }}
          />
          {/* Lo thumb */}
          <div
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={hi}
            aria-valuenow={lo}
            aria-label="Range start"
            aria-disabled={disabled}
            onPointerDown={makeStartDrag("lo")}
            onKeyDown={makeKeyDown("lo")}
            className={cn(
              "slider-thumb absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
              "h-4 w-4 rounded-full border-2 bg-white shadow-md",
              "transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:scale-110",
              !disabled && "cursor-grab active:cursor-grabbing active:scale-110",
            )}
            style={{ left: `${loPct}%`, zIndex: lo > hi - step ? 3 : 2 }}
          />
          {/* Hi thumb */}
          <div
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={lo}
            aria-valuemax={max}
            aria-valuenow={hi}
            aria-label="Range end"
            aria-disabled={disabled}
            onPointerDown={makeStartDrag("hi")}
            onKeyDown={makeKeyDown("hi")}
            className={cn(
              "slider-thumb absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
              "h-4 w-4 rounded-full border-2 bg-white shadow-md",
              "transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:scale-110",
              !disabled && "cursor-grab active:cursor-grabbing active:scale-110",
            )}
            style={{ left: `${hiPct}%`, zIndex: 2 }}
          />
        </div>
      </div>
    </div>
  );
}
