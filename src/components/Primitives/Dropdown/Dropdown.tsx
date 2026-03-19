import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { cn } from "../../../lib/utils";
import { inputVariants } from "../../../styles/theme/primitives";

/* ── Types ─────────────────────────────────────────────── */

export interface DropdownOption {
  /** Unique value for this option. */
  value: string;
  /** Display label. Defaults to value. */
  label?: string;
  /** Icon rendered before the label. */
  icon?: React.ReactNode;
  /** Disable this option. */
  disabled?: boolean;
  /** Nested children for cascading (hierarchical) menus. */
  children?: DropdownOption[];
}

interface DropdownBaseProps {
  /** Available options. Supports nested children for cascading. */
  options: DropdownOption[];
  /** Placeholder text when nothing is selected. */
  placeholder?: string;
  /** Allow the user to type to filter options. @default false */
  editable?: boolean;
  /** Called when the user submits a value not in the list (editable mode). */
  onAddItem?: (value: string) => void;
  /** Disable the entire dropdown. */
  disabled?: boolean;
  /** Menu alignment. @default 'left' */
  align?: "left" | "right";
  /** Additional class name for the root container. */
  className?: string;
  /** Controls the trigger height and text size. @default 'md' */
  size?: "sm" | "md" | "lg";
  /** Enable domino flip-in/flip-out animation for menu items. @default true */
  animated?: boolean;
}

export interface DropdownSingleProps extends DropdownBaseProps {
  /** Enable multi-select with checkboxes. @default false */
  multiple?: false;
  /** Currently selected value (controlled, single mode). */
  value?: string;
  /** Default selected value (uncontrolled, single mode). */
  defaultValue?: string;
  /** Callback fired when an option is selected (single mode). */
  onChange?: (value: string, option: DropdownOption) => void;
  /** Not used in single mode. */
  selected?: never;
  /** Not used in single mode. */
  defaultSelected?: never;
  /** Not used in single mode. */
  onSelectionChange?: never;
}

export interface DropdownMultipleProps extends DropdownBaseProps {
  /** Enable multi-select with checkboxes. */
  multiple: true;
  /** Currently selected values (controlled, multi mode). */
  selected?: string[];
  /** Default selected values (uncontrolled, multi mode). */
  defaultSelected?: string[];
  /** Callback fired when selection changes (multi mode). */
  onSelectionChange?: (selected: string[]) => void;
  /** Not used in multi mode. */
  value?: never;
  /** Not used in multi mode. */
  defaultValue?: never;
  /** Not used in multi mode. */
  onChange?: never;
}

export type DropdownProps = DropdownSingleProps | DropdownMultipleProps;

/* ── Helpers ───────────────────────────────────────────── */

/** Recursively find an option by value across all levels. */
function findOption(options: DropdownOption[], value: string): DropdownOption | undefined {
  for (const opt of options) {
    if (opt.value === value) return opt;
    if (opt.children) {
      const found = findOption(opt.children, value);
      if (found) return found;
    }
  }
  return undefined;
}

/** Recursively flatten options for editable filtering. */
function flattenOptions(options: DropdownOption[]): DropdownOption[] {
  const result: DropdownOption[] = [];
  for (const opt of options) {
    if (!opt.children?.length) result.push(opt);
    if (opt.children) result.push(...flattenOptions(opt.children));
  }
  return result;
}

/* ── Animation helpers ─────────────────────────────────── */

const ITEM_STEP_MS = 40; // stagger between items
const ITEM_IN_MS = 200; // must match --animate-dropdown-item-in duration
const ITEM_OUT_MS = 150; // must match --animate-dropdown-item-out duration
const CONTAINER_OUT_MS = 120; // must match --animate-dropdown-container-out duration

// Note: delay is inlined into the shorthand to avoid mixing `animation` shorthand
// with the `animationDelay` longhand, which triggers a React style-conflict warning.
function itemStyle(
  index: number,
  total: number,
  closing: boolean,
  animated: boolean,
): React.CSSProperties {
  if (!animated) return {};
  if (closing) {
    const delay = (total - 1 - index) * ITEM_STEP_MS;
    return { animation: `dropdown-item-out ${ITEM_OUT_MS}ms ease-in both ${delay}ms` };
  }
  const delay = index * ITEM_STEP_MS;
  return { animation: `dropdown-item-in ${ITEM_IN_MS}ms ease-out both ${delay}ms` };
}

function containerAnimStyle(
  total: number,
  closing: boolean,
  animated: boolean,
): React.CSSProperties {
  if (!animated) return {};
  if (closing) {
    const delay = Math.max(total - 1, 0) * ITEM_STEP_MS + ITEM_OUT_MS;
    return { animation: `dropdown-container-out ${CONTAINER_OUT_MS}ms ease-in both ${delay}ms` };
  }
  return { animation: `var(--animate-dropdown-container-in)` };
}

/* ── Sub-menu (cascading — single-select only) ─────────── */

function CascadeMenu({
  options,
  onSelect,
  animated = true,
  closing = false,
  depth = 0,
}: {
  options: DropdownOption[];
  onSelect: (value: string, option: DropdownOption) => void;
  animated?: boolean;
  closing?: boolean;
  depth?: number;
}) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredKey(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHoveredKey(null), 150);
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return (
    <div
      className={cn(
        "absolute z-50 min-w-44 rounded-md border py-1 shadow-lg overflow-hidden",
        "border-primary-200 dark:border-primary-700 dark:bg-primary-800 bg-white",
        depth === 0 ? "mt-1 w-full" : "top-0 ml-0.5",
      )}
      style={{
        ...(depth > 0 ? { left: "100%" } : {}),
        ...containerAnimStyle(options.length, closing, animated),
      }}
      role="listbox"
    >
      {options.map((opt, i) => {
        const hasSub = !!opt.children?.length;
        const isHovered = hoveredKey === opt.value;

        return (
          <div
            key={opt.value}
            className="relative"
            style={itemStyle(i, options.length, closing, animated)}
            onMouseEnter={() => handleMouseEnter(opt.value)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              role="option"
              aria-selected={false}
              aria-disabled={opt.disabled}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors",
                "text-primary-700 hover:bg-primary-100 dark:text-primary-300 dark:hover:bg-primary-700/50",
                opt.disabled && "pointer-events-none opacity-50",
              )}
              onClick={() => {
                if (opt.disabled || hasSub) return;
                onSelect(opt.value, opt);
              }}
            >
              {opt.icon && (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {opt.icon}
                </span>
              )}
              <span className="flex-1 truncate">{opt.label ?? opt.value}</span>
              {hasSub && <ChevronRight className="text-primary-400 h-3.5 w-3.5 shrink-0" />}
            </div>

            {hasSub && isHovered && (
              <CascadeMenu
                options={opt.children!}
                onSelect={onSelect}
                animated={animated}
                depth={depth + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Flat option list (editable filter + multi-select) ─── */

function FlatMenu({
  options,
  filter,
  multiple,
  selected,
  canAdd,
  animated = true,
  closing = false,
  onSelect,
  onToggle,
  onAdd,
}: {
  options: DropdownOption[];
  filter: string;
  multiple: boolean;
  selected: string[];
  canAdd: boolean;
  animated?: boolean;
  closing?: boolean;
  onSelect: (value: string, option: DropdownOption) => void;
  onToggle: (value: string) => void;
  onAdd: () => void;
}) {
  const flat = useMemo(() => flattenOptions(options), [options]);
  const lowerFilter = filter.toLowerCase();
  const filtered = filter
    ? flat.filter(
        (o) =>
          (o.label ?? o.value).toLowerCase().includes(lowerFilter) ||
          o.value.toLowerCase().includes(lowerFilter),
      )
    : flat;

  // Extra rows: empty state or add prompt
  const extraCount = (filtered.length === 0 && !canAdd) || canAdd ? 1 : 0;
  const totalRows = filtered.length + extraCount;

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 w-full max-h-60 min-w-44 overflow-y-auto rounded-md border py-1 shadow-lg",
        "border-primary-200 dark:border-primary-700 dark:bg-primary-800 bg-white",
      )}
      role="listbox"
      aria-multiselectable={multiple || undefined}
      style={containerAnimStyle(totalRows, closing, animated)}
    >
      {filtered.map((opt, i) => {
        const isSelected = multiple && selected.includes(opt.value);
        return (
          <div
            key={opt.value}
            role="option"
            aria-selected={multiple ? isSelected : false}
            aria-disabled={opt.disabled}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors",
              "text-primary-700 hover:bg-primary-100 dark:text-primary-300 dark:hover:bg-primary-700/50",
              opt.disabled && "pointer-events-none opacity-50",
            )}
            style={itemStyle(i, totalRows, closing, animated)}
            onClick={() => {
              if (opt.disabled) return;
              if (multiple) {
                onToggle(opt.value);
              } else {
                onSelect(opt.value, opt);
              }
            }}
          >
            {multiple && (
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                  isSelected
                    ? "border-primary-600 bg-primary-600 text-white dark:border-primary-500 dark:bg-primary-500"
                    : "border-secondary-300 bg-white dark:border-secondary-600 dark:bg-secondary-800",
                )}
              >
                {isSelected && <Check className="h-3 w-3" />}
              </span>
            )}
            {opt.icon && (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center">{opt.icon}</span>
            )}
            <span className="truncate">{opt.label ?? opt.value}</span>
          </div>
        );
      })}

      {filtered.length === 0 && !canAdd && (
        <div
          className="text-primary-400 px-3 py-2 text-center text-sm"
          style={itemStyle(0, 1, closing, animated)}
        >
          No matches
        </div>
      )}

      {canAdd && (
        <div
          className={cn(
            "flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors",
            "text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30",
          )}
          style={itemStyle(filtered.length, totalRows, closing, animated)}
          onClick={onAdd}
        >
          <span className="flex h-4 w-4 shrink-0 items-center justify-center text-lg leading-none">
            +
          </span>
          <span className="truncate">Add &ldquo;{filter.trim()}&rdquo;</span>
        </div>
      )}
    </div>
  );
}

/* ── Dropdown (main) ───────────────────────────────────── */

export function Dropdown(props: DropdownProps) {
  const {
    options,
    placeholder = "Select…",
    editable = false,
    onAddItem,
    disabled = false,
    align = "left",
    className,
    size = "md",
    animated = true,
  } = props;

  const multiple = props.multiple === true;

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState<string | undefined>(
    !multiple ? (props as DropdownSingleProps).defaultValue : undefined,
  );
  const [internalSelected, setInternalSelected] = useState<string[]>(
    multiple ? ((props as DropdownMultipleProps).defaultSelected ?? []) : [],
  );

  const selectedValues: string[] = multiple
    ? ((props as DropdownMultipleProps).selected ?? internalSelected)
    : [];

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Animated close: play out animation then actually hide
  const closeMenu = useCallback(() => {
    if (!animated || !open) {
      setOpen(false);
      setSearch("");
      return;
    }
    setClosing(true);
    // Total out duration: last item delay + item out duration
    const totalItems = Math.max(options.length, 1);
    const delay = (totalItems - 1) * ITEM_STEP_MS + ITEM_OUT_MS + CONTAINER_OUT_MS + 20;
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setSearch("");
    }, delay);
  }, [animated, open, options.length]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  // Single-select: find current option
  const singleValue = !multiple
    ? ((props as DropdownSingleProps).value ?? internalValue)
    : undefined;
  const singleSelected = useMemo(
    () => (singleValue ? findOption(options, singleValue) : undefined),
    [options, singleValue],
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, closeMenu]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, closeMenu]);

  /* ── Single-select handler ──────────────────────────── */
  const handleSelect = useCallback(
    (val: string, opt: DropdownOption) => {
      if (!multiple) {
        if ((props as DropdownSingleProps).value === undefined) setInternalValue(val);
        (props as DropdownSingleProps).onChange?.(val, opt);
      }
      // No close animation on selection — close immediately for snappy feel
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setOpen(false);
      setClosing(false);
      setSearch("");
    },

    [multiple, props],
  );

  /* ── Multi-select toggle ────────────────────────────── */
  const handleToggle = useCallback(
    (val: string) => {
      if (!multiple) return;
      const prev = (props as DropdownMultipleProps).selected ?? internalSelected;
      const next = prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val];
      if ((props as DropdownMultipleProps).selected === undefined) setInternalSelected(next);
      (props as DropdownMultipleProps).onSelectionChange?.(next);
    },

    [multiple, internalSelected, props],
  );

  /* ── Can add? ───────────────────────────────────────── */
  const lowerSearch = search.toLowerCase();
  const canAdd = useMemo(() => {
    if (!editable || !search.trim()) return false;
    const flat = flattenOptions(options);
    return !flat.some(
      (o) =>
        o.value.toLowerCase() === lowerSearch || (o.label ?? o.value).toLowerCase() === lowerSearch,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, lowerSearch, options]);

  const handleAdd = useCallback(() => {
    const value = search.trim();
    if (!value) return;
    onAddItem?.(value);
    setSearch("");
  }, [search, onAddItem]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && canAdd) {
        e.preventDefault();
        handleAdd();
      }
    },
    [canAdd, handleAdd],
  );

  /* ── Toggle open ────────────────────────────────────── */
  const toggleOpen = useCallback(() => {
    if (disabled) return;
    if (open) {
      closeMenu();
    } else {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setClosing(false);
      setOpen(true);
      setSearch("");
      if (editable) requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [disabled, open, closeMenu, editable]);

  /* ── Display label ──────────────────────────────────── */
  let displayLabel: string;
  if (multiple) {
    const count = selectedValues.length;
    if (count === 0) {
      displayLabel = "";
    } else if (count <= 2) {
      displayLabel = selectedValues
        .map((v) => findOption(options, v))
        .map((o) => (o ? (o.label ?? o.value) : ""))
        .filter(Boolean)
        .join(", ");
    } else {
      displayLabel = `${count} selected`;
    }
  } else {
    displayLabel = singleSelected ? (singleSelected.label ?? singleSelected.value) : "";
  }

  /* ── Need flat menu? (editable, multi, or filtering) ─ */
  const useFlatMenu = multiple || editable;

  return (
    <div ref={containerRef} className={cn("relative inline-block min-w-44", className)}>
      {/* Trigger */}
      <div
        className={cn(
          inputVariants({ state: "default", size }),
          "flex cursor-pointer items-center gap-1",
          disabled && "pointer-events-none opacity-50",
        )}
        onClick={toggleOpen}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {editable ? (
          <input
            ref={inputRef}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-secondary-400 dark:placeholder:text-secondary-600"
            value={open ? search : displayLabel}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!open) setOpen(true);
            }}
            onKeyDown={handleInputKeyDown}
            onClick={(e) => {
              e.stopPropagation();
              if (!open) setOpen(true);
            }}
          />
        ) : (
          <span
            className={cn(
              "flex-1 truncate",
              !displayLabel && "text-secondary-400 dark:text-secondary-600",
            )}
          >
            {displayLabel || placeholder}
          </span>
        )}
        {singleSelected?.icon && !editable && !multiple && (
          <span className="flex h-4 w-4 shrink-0 items-center justify-center">
            {singleSelected.icon}
          </span>
        )}
        {multiple && selectedValues.length > 0 && (
          <span className="rounded-full bg-primary-100 px-1.5 text-xs font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
            {selectedValues.length}
          </span>
        )}
        <ChevronDown
          className={cn(
            "text-primary-400 h-4 w-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </div>

      {/* Menu */}
      {open && (
        <div className={cn(align === "right" ? "right-0" : "left-0", "absolute w-full")}>
          {useFlatMenu ? (
            <FlatMenu
              options={options}
              filter={search}
              multiple={multiple}
              selected={selectedValues}
              canAdd={canAdd}
              animated={animated}
              closing={closing}
              onSelect={handleSelect}
              onToggle={handleToggle}
              onAdd={handleAdd}
            />
          ) : (
            <CascadeMenu
              options={options}
              onSelect={handleSelect}
              animated={animated}
              closing={closing}
            />
          )}
        </div>
      )}
    </div>
  );
}
