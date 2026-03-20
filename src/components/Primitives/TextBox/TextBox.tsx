import React, { useState, useCallback, useMemo } from "react";
import { cn } from "../../../lib/utils";

export type TextBoxProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
  /** Visual state. @default 'default' */
  state?: "default" | "error";
  /** Size variant. @default 'md' */
  size?: "sm" | "md" | "lg";
  /** Show a live word count below the textarea. @default false */
  showWordCount?: boolean;
  /** Maximum number of words. When exceeded the counter turns red. */
  maxWords?: number;
};

const sizeClasses = {
  sm: "px-2 py-1.5 text-xs min-h-[60px]",
  md: "px-3 py-2 text-sm min-h-[80px]",
  lg: "px-4 py-2.5 text-base min-h-[100px]",
} as const;

const stateClasses = {
  default:
    "border-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-600",
  error: "border-danger-400 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20",
} as const;

/**
 * Count for mixed-language text.
 * - CJK: every character counts as 1 (including CJK punctuation, spaces and
 *   newlines that appear between CJK characters).
 * - Latin / other: whitespace-separated words each count as 1.
 */
function countWords(text: string): number {
  if (!text) return 0;

  // CJK ideographs, kana, hangul, and CJK punctuation / symbols
  const CJK =
    "\u2E80-\u2EFF" + // CJK Radicals Supplement
    "\u3000-\u303F" + // CJK Symbols and Punctuation (includes ideographic space \u3000)
    "\u3040-\u309F" + // Hiragana
    "\u30A0-\u30FF" + // Katakana
    "\u3400-\u4DBF" + // CJK Extension A
    "\u4E00-\u9FFF" + // CJK Unified Ideographs
    "\uAC00-\uD7AF" + // Hangul Syllables
    "\uF900-\uFAFF" + // CJK Compatibility Ideographs
    "\uFE30-\uFE4F" + // CJK Compatibility Forms
    "\uFF00-\uFFEF"; // Halfwidth and Fullwidth Forms

  const cjkCharRegex = new RegExp(`[${CJK}]`);

  // Split into segments: runs of CJK chars (+ any whitespace/punct between them)
  // vs runs of pure non-CJK text.
  // Strategy: walk character by character.
  let count = 0;
  let latinBuf = "";

  const flushLatin = () => {
    const trimmed = latinBuf.trim();
    if (trimmed) {
      count += trimmed.split(/\s+/).length;
    }
    latinBuf = "";
  };

  for (const ch of text) {
    if (cjkCharRegex.test(ch)) {
      flushLatin();
      count += 1;
    } else {
      latinBuf += ch;
    }
  }
  flushLatin();

  return count;
}

export function TextBox({
  state = "default",
  size = "md",
  showWordCount = false,
  maxWords,
  className,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled,
  ...props
}: TextBoxProps) {
  const [internalValue, setInternalValue] = useState(() => (defaultValue as string) ?? "");
  const value = controlledValue !== undefined ? String(controlledValue) : internalValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (controlledValue === undefined) setInternalValue(e.target.value);
      onChange?.(e);
    },
    [controlledValue, onChange],
  );

  const wordCount = useMemo(() => countWords(value), [value]);
  const overLimit = maxWords != null && wordCount > maxWords;

  return (
    <div className={cn("inline-flex w-full flex-col", className)}>
      <textarea
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "w-full resize-y rounded-md border bg-white text-secondary-900 transition-colors placeholder:text-secondary-400 focus:outline-none dark:bg-secondary-900 dark:text-secondary-100 dark:placeholder:text-secondary-600",
          sizeClasses[size],
          stateClasses[overLimit ? "error" : state],
          disabled && "pointer-events-none opacity-50",
        )}
        {...props}
      />
      {(showWordCount || maxWords != null) && (
        <span
          className={cn(
            "mt-1 self-end text-xs",
            overLimit
              ? "text-danger-500 dark:text-danger-400"
              : "text-secondary-400 dark:text-secondary-500",
          )}
        >
          {maxWords != null ? `${wordCount} / ${maxWords} words` : `${wordCount} words`}
        </span>
      )}
    </div>
  );
}
