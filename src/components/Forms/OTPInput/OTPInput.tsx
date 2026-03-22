import React, { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { otpInputVariants } from "../../../styles/theme/form";
import "./OTPInput.css";

export type OTPInputSize = "sm" | "md" | "lg";
export type OTPInputVariant = "outline" | "filled" | "underline";

export interface OTPInputProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  size?: OTPInputSize;
  variant?: OTPInputVariant;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  alphanumeric?: boolean;
  mask?: boolean;
  invalid?: boolean;
  className?: string;
}

export function OTPInput({
  length = 6,
  value: controlledValue,
  defaultValue = "",
  onChange,
  onComplete,
  size = "md",
  variant = "outline",
  disabled = false,
  readOnly = false,
  autoFocus = false,
  alphanumeric = false,
  mask = false,
  invalid = false,
  className,
}: OTPInputProps) {
  const isControlled = controlledValue !== undefined;

  const [internalChars, setInternalChars] = useState<string[]>(() => {
    const init = (defaultValue ?? "").slice(0, length);
    return Array.from({ length }, (_, i) => init[i] ?? "");
  });

  const chars = isControlled
    ? Array.from({ length }, (_, i) => (controlledValue ?? "")[i] ?? "")
    : internalChars;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const popTimers = useRef<number[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const updateChars = useCallback(
    (newChars: string[]) => {
      if (!isControlled) setInternalChars(newChars);
      const value = newChars.join("");
      onChange?.(value);
      if (newChars.every((c) => c !== "") && newChars.length === length) {
        onComplete?.(value);
      }
    },
    [isControlled, onChange, onComplete, length],
  );

  const triggerPop = (index: number) => {
    const el = inputRefs.current[index];
    if (!el) return;
    el.classList.remove("otp-pop");
    clearTimeout(popTimers.current[index]);
    // Force reflow
    void el.offsetWidth;
    el.classList.add("otp-pop");
    popTimers.current[index] = window.setTimeout(() => el.classList.remove("otp-pop"), 200);
  };

  const handleChange = useCallback(
    (index: number, inputValue: string) => {
      const pattern = alphanumeric ? /[a-zA-Z0-9]/g : /[0-9]/g;
      const filtered = inputValue.match(pattern) ?? [];
      if (filtered.length === 0) return;

      const char = filtered[filtered.length - 1];
      const newChars = [...chars];
      newChars[index] = char;
      updateChars(newChars);
      triggerPop(index);

      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [chars, length, alphanumeric, updateChars],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (chars[index]) {
          const newChars = [...chars];
          newChars[index] = "";
          updateChars(newChars);
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          const newChars = [...chars];
          newChars[index - 1] = "";
          updateChars(newChars);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (index > 0) inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (index < length - 1) inputRefs.current[index + 1]?.focus();
      } else if (e.key === "Delete") {
        e.preventDefault();
        const newChars = [...chars];
        newChars[index] = "";
        updateChars(newChars);
      }
    },
    [chars, length, updateChars],
  );

  const handlePaste = useCallback(
    (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData("text");
      const pattern = alphanumeric ? /[a-zA-Z0-9]/g : /[0-9]/g;
      const filtered = pasteData.match(pattern) ?? [];

      const newChars = [...chars];
      let lastFilled = index;
      for (let i = 0; i < filtered.length && index + i < length; i++) {
        newChars[index + i] = filtered[i];
        lastFilled = index + i;
      }
      updateChars(newChars);

      const nextEmpty = newChars.findIndex((c, i) => i > lastFilled && c === "");
      const focusTarget = nextEmpty !== -1 ? nextEmpty : Math.min(lastFilled + 1, length - 1);
      inputRefs.current[focusTarget]?.focus();
    },
    [chars, length, alphanumeric, updateChars],
  );

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  return (
    <div role="group" aria-label="OTP Input" className={cn("inline-flex gap-2", className)}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type={mask ? "password" : "text"}
          inputMode={alphanumeric ? "text" : "numeric"}
          pattern={alphanumeric ? "[a-zA-Z0-9]" : "[0-9]"}
          maxLength={2}
          value={chars[i]}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete="one-time-code"
          aria-label={`Digit ${i + 1} of ${length}`}
          className={cn(
            otpInputVariants({ size, variant, invalid: invalid || undefined }),
            "text-secondary-900 dark:text-secondary-100",
          )}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={handleFocus}
        />
      ))}
    </div>
  );
}
