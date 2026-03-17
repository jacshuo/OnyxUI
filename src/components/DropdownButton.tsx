import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { buttonVariants } from '../styles/theme';

/* ── Types ─────────────────────────────────────────────── */

export interface DropdownItem {
  /** Unique key. Falls back to label when label is a string. */
  key?: string;
  label: React.ReactNode;
  /** Disable this item. */
  disabled?: boolean;
  /** Divider rendered before this item. */
  divider?: boolean;
  onClick?: () => void;
}

export interface DropdownButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof buttonVariants> {
  /** Button label. */
  label: React.ReactNode;
  /** Dropdown menu items. */
  items: DropdownItem[];
  /** Menu alignment. @default 'left' */
  align?: 'left' | 'right';

  /* ── Editable ────────────────────────────────────────── */
  /** Show a search/add input at the top of the menu. */
  editable?: boolean;
  /** Called when the user presses Enter on a value not in the list. */
  onAddItem?: (value: string) => void;

  /* ── Multiple selection ──────────────────────────────── */
  /** Enable multi-select with checkboxes. */
  multiple?: boolean;
  /** Currently selected keys (controlled). */
  selected?: string[];
  /** Called when the selection changes (multi-select mode). */
  onSelectionChange?: (selected: string[]) => void;
}

/* ── Helpers ───────────────────────────────────────────── */

function itemKey(item: DropdownItem, index: number): string {
  return item.key ?? (typeof item.label === 'string' ? item.label : String(index));
}

/* ── Component ─────────────────────────────────────────── */

export function DropdownButton({
  label,
  items,
  intent,
  size,
  align = 'left',
  className,
  disabled,
  editable = false,
  onAddItem,
  multiple = false,
  selected = [],
  onSelectionChange,
  ...props
}: DropdownButtonProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = useCallback(() => {
    if (!disabled) {
      setOpen((prev) => {
        const next = !prev;
        if (next && editable) {
          requestAnimationFrame(() => inputRef.current?.focus());
        }
        if (!next) setFilter('');
        return next;
      });
    }
  }, [disabled, editable]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFilter('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setFilter('');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  /* ── Filtered items ────────────────────────────────── */
  const lowerFilter = filter.toLowerCase();
  const filteredItems = useMemo(() => {
    if (!filter) return items;
    return items.filter((item) => {
      const text = typeof item.label === 'string' ? item.label : (item.key ?? '');
      return text.toLowerCase().includes(lowerFilter);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, lowerFilter]);

  /* ── Can add? (editable, non-empty filter, no exact match) */
  const canAdd = useMemo(() => {
    if (!editable || !filter.trim()) return false;
    return !items.some((item) => {
      const text = typeof item.label === 'string' ? item.label : (item.key ?? '');
      return text.toLowerCase() === lowerFilter;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, lowerFilter, items]);

  const handleAdd = useCallback(() => {
    const value = filter.trim();
    if (!value) return;
    onAddItem?.(value);
    setFilter('');
  }, [filter, onAddItem]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && canAdd) {
        e.preventDefault();
        handleAdd();
      }
    },
    [canAdd, handleAdd],
  );

  /* ── Toggle selection (multi) ──────────────────────── */
  const toggleItem = useCallback(
    (key: string) => {
      const next = selected.includes(key)
        ? selected.filter((k) => k !== key)
        : [...selected, key];
      onSelectionChange?.(next);
    },
    [selected, onSelectionChange],
  );

  /* ── Button display label ──────────────────────────── */
  const displayLabel = multiple && selected.length > 0
    ? <>{label} <span className="ml-1 rounded-full bg-white/20 px-1.5 text-xs font-semibold">{selected.length}</span></>
    : label;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        className={cn(
          buttonVariants({ intent, size }),
          'inline-flex items-center gap-1',
          className,
        )}
        aria-haspopup={multiple ? 'listbox' : 'true'}
        aria-expanded={open ? 'true' : 'false'}
        {...props}
      >
        {displayLabel}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-44 rounded-md border py-1 shadow-lg',
            'border-primary-200 dark:border-primary-700 dark:bg-primary-800 bg-white',
            'animate-fade-in',
            align === 'right' ? 'right-0' : 'left-0',
          )}
          role={multiple ? 'listbox' : 'menu'}
          aria-multiselectable={multiple || undefined}
        >
          {/* Editable filter/add input */}
          {editable && (
            <div className="border-primary-200 dark:border-primary-700 border-b px-2 pb-1.5 pt-1">
              <input
                ref={inputRef}
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type to filter or add…"
                className="w-full bg-transparent text-sm text-secondary-900 placeholder:text-secondary-400 focus:outline-none dark:text-secondary-100 dark:placeholder:text-secondary-600"
              />
            </div>
          )}

          {/* Menu items */}
          <div className="max-h-60 overflow-y-auto">
            {filteredItems.map((item, i) => {
              const key = itemKey(item, i);
              const isSelected = multiple && selected.includes(key);

              return (
                <React.Fragment key={key}>
                  {item.divider && (
                    <div className="border-primary-200 dark:border-primary-700 my-1 border-t" />
                  )}
                  <button
                    type="button"
                    role={multiple ? 'option' : 'menuitem'}
                    aria-selected={multiple ? isSelected : undefined}
                    disabled={item.disabled}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors',
                      'text-primary-700 hover:bg-primary-100 dark:text-primary-300 dark:hover:bg-primary-700/50',
                      item.disabled && 'pointer-events-none opacity-50',
                    )}
                    onClick={() => {
                      if (multiple) {
                        toggleItem(key);
                      } else {
                        item.onClick?.();
                        setOpen(false);
                        setFilter('');
                      }
                    }}
                  >
                    {multiple && (
                      <span
                        className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                          isSelected
                          ? 'border-primary-600 bg-primary-600 text-white dark:border-primary-500 dark:bg-primary-500'
                          : 'border-secondary-300 bg-white dark:border-secondary-600 dark:bg-secondary-800',
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </span>
                    )}
                    <span className="flex-1 truncate">{item.label}</span>
                  </button>
                </React.Fragment>
              );
            })}

            {/* No results */}
            {filteredItems.length === 0 && !canAdd && (
              <div className="text-primary-400 px-3 py-2 text-center text-sm">No matches</div>
            )}

            {/* Add new item prompt */}
            {canAdd && (
              <button
                type="button"
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors',
                  'text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30',
                )}
                onClick={handleAdd}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center text-lg leading-none">+</span>
                <span className="truncate">Add &ldquo;{filter.trim()}&rdquo;</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
