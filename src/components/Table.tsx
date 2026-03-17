import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { ArrowUp, ArrowDown, ArrowUpDown, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { tableVariants } from '../styles/theme';

/* ═══════════════════════════════════════════════════════════
   Primitive table elements (unchanged API)
   ═══════════════════════════════════════════════════════════ */

type TableProps = React.TableHTMLAttributes<HTMLTableElement> & VariantProps<typeof tableVariants>;

export function Table({ intent, className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className={cn(tableVariants({ intent }), className)} {...props} />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        'bg-primary-50 text-primary-600 dark:bg-primary-800/50 dark:text-primary-400',
        className,
      )}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'border-primary-200 hover:bg-primary-50/50 dark:border-primary-700 dark:hover:bg-primary-800/30 border-b transition-colors',
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase',
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('text-primary-700 dark:text-primary-300 px-4 py-3', className)} {...props} />
  );
}

/* ═══════════════════════════════════════════════════════════
   Shared types
   ═══════════════════════════════════════════════════════════ */

export type SortDirection = 'asc' | 'desc';

export type SortState<K extends string = string> = {
  column: K;
  direction: SortDirection;
} | null;

export type ColumnDef<T, K extends string = string> = {
  /** Unique key identifying this column. */
  key: K;
  /** Header label. */
  header: React.ReactNode;
  /** Extract the cell value from a row. */
  cell: (row: T) => React.ReactNode;
  /** Whether this column is sortable. @default true */
  sortable?: boolean;
  /** Custom comparator. Receives two row objects and should return <0, 0, or >0. */
  compareFn?: (a: T, b: T) => number;
  /** Custom class for the <th> element. */
  headerClassName?: string;
  /** Custom class for the <td> element. */
  cellClassName?: string;
  /** Whether this column can be edited inline. @default true when table is editable. */
  editable?: boolean;
  /** Extract a raw string value for editing. Falls back to cell(). */
  editValue?: (row: T) => string;
};

/* ═══════════════════════════════════════════════════════════
   SortableTable — data-driven table with per-column sorting
   ═══════════════════════════════════════════════════════════ */

type SortableTableProps<T, K extends string = string> = {
  columns: ColumnDef<T, K>[];
  data: T[];
  sort?: SortState<K>;
  onSortChange?: (sort: SortState<K>) => void;
  defaultSort?: SortState<K>;
  rowKey?: (row: T, index: number) => React.Key;
  intent?: VariantProps<typeof tableVariants>['intent'];
  className?: string;
};

export function SortableTable<T, K extends string = string>({
  columns,
  data,
  sort: controlledSort,
  onSortChange,
  defaultSort = null,
  rowKey,
  intent,
  className,
}: SortableTableProps<T, K>) {
  const [internalSort, setInternalSort] = useState<SortState<K>>(defaultSort);
  const sort = controlledSort ?? internalSort;

  const handleSort = useCallback(
    (column: K) => {
      const next: SortState<K> =
        sort?.column === column
          ? sort.direction === 'asc'
            ? { column, direction: 'desc' }
            : null
          : { column, direction: 'asc' };

      if (onSortChange) {
        onSortChange(next);
      } else {
        setInternalSort(next);
      }
    },
    [sort, onSortChange],
  );

  const sortedData = useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.column);
    if (!col) return data;

    const compare =
      col.compareFn ??
      ((a: T, b: T) => {
        const aVal = col.cell(a);
        const bVal = col.cell(b);
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return -1;
        if (bVal == null) return 1;
        if (typeof aVal === 'number' && typeof bVal === 'number') return aVal - bVal;
        return String(aVal).localeCompare(String(bVal));
      });

    const sorted = [...data].sort(compare);
    return sort.direction === 'desc' ? sorted.reverse() : sorted;
  }, [data, sort, columns]);

  return (
    <Table intent={intent} className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((col) => {
            const sortable = col.sortable !== false;
            const isActive = sort?.column === col.key;
            return (
              <TableHead
                key={col.key}
                className={cn(sortable && 'cursor-pointer select-none', col.headerClassName)}
                onClick={sortable ? () => handleSort(col.key) : undefined}
                aria-sort={
                  isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined
                }
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {sortable && (
                    <SortIcon active={isActive} direction={isActive ? sort!.direction : null} />
                  )}
                </span>
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((row, i) => (
          <TableRow key={rowKey ? rowKey(row, i) : i}>
            {columns.map((col) => (
              <TableCell key={col.key} className={col.cellClassName}>
                {col.cell(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/* ═══════════════════════════════════════════════════════════
   DataTable — full-featured table with selection, editing,
   toolbar (add/delete/edit rows)
   ═══════════════════════════════════════════════════════════ */

export type SelectionMode = 'none' | 'single' | 'multiple';

export type DataTableProps<T, K extends string = string> = {
  /** Column definitions. */
  columns: ColumnDef<T, K>[];
  /** Row data (controlled). */
  data: T[];
  /** Extract a unique key per row. */
  rowKey: (row: T, index: number) => React.Key;

  /* ── Sorting ─────────────────────────────────────────── */
  sort?: SortState<K>;
  onSortChange?: (sort: SortState<K>) => void;
  defaultSort?: SortState<K>;

  /* ── Selection ───────────────────────────────────────── */
  /** Row selection mode. @default 'none' */
  selectionMode?: SelectionMode;
  /** Controlled selected keys. */
  selected?: React.Key[];
  /** Fired when selection changes. */
  onSelectionChange?: (keys: React.Key[]) => void;

  /* ── Editing ─────────────────────────────────────────── */
  /** Enable inline cell editing on double-click. @default false */
  editable?: boolean;
  /** Called when a cell value is committed. */
  onCellEdit?: (rowKey: React.Key, columnKey: K, value: string) => void;

  /* ── Toolbar actions ─────────────────────────────────── */
  /** Show the toolbar. @default false */
  toolbar?: boolean;
  /** Called when the Add button is clicked. */
  onAdd?: () => void;
  /** Called when Delete is clicked. Receives currently selected keys. */
  onDelete?: (keys: React.Key[]) => void;

  intent?: VariantProps<typeof tableVariants>['intent'];
  className?: string;
};

/* ── Editable cell ─────────────────────────────────────── */

function EditableCell({
  value,
  onCommit,
  onCancel,
}: {
  value: string;
  onCommit: (v: string) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const commit = () => onCommit(draft);

  return (
    <span className="flex items-center gap-1">
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') onCancel();
        }}
        aria-label="Edit cell"
        className="min-w-0 flex-1 rounded border border-primary-400 bg-white px-1.5 py-0.5 text-sm outline-none focus:ring-1 focus:ring-primary-400 dark:border-primary-600 dark:bg-secondary-800"
      />
      <button
        type="button"
        onClick={commit}
        className="text-success-600 hover:text-success-700 dark:text-success-400"
        aria-label="Confirm"
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="text-danger-500 hover:text-danger-600 dark:text-danger-400"
        aria-label="Cancel"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

/* ── DataTable component ───────────────────────────────── */

export function DataTable<T, K extends string = string>({
  columns,
  data,
  rowKey,
  sort: controlledSort,
  onSortChange,
  defaultSort = null,
  selectionMode = 'none',
  selected: controlledSelected,
  onSelectionChange,
  editable = false,
  onCellEdit,
  toolbar = false,
  onAdd,
  onDelete,
  intent,
  className,
}: DataTableProps<T, K>) {
  /* ── Sort state ─────────────────────────────────────── */
  const [internalSort, setInternalSort] = useState<SortState<K>>(defaultSort);
  const sort = controlledSort ?? internalSort;

  const handleSort = useCallback(
    (column: K) => {
      const next: SortState<K> =
        sort?.column === column
          ? sort.direction === 'asc'
            ? { column, direction: 'desc' }
            : null
          : { column, direction: 'asc' };
      onSortChange ? onSortChange(next) : setInternalSort(next);
    },
    [sort, onSortChange],
  );

  const sortedData = useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.column);
    if (!col) return data;
    const compare =
      col.compareFn ??
      ((a: T, b: T) => {
        const aVal = col.cell(a);
        const bVal = col.cell(b);
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return -1;
        if (bVal == null) return 1;
        if (typeof aVal === 'number' && typeof bVal === 'number') return aVal - bVal;
        return String(aVal).localeCompare(String(bVal));
      });
    const sorted = [...data].sort(compare);
    return sort.direction === 'desc' ? sorted.reverse() : sorted;
  }, [data, sort, columns]);

  /* ── Selection state ────────────────────────────────── */
  const [internalSelected, setInternalSelected] = useState<React.Key[]>([]);
  const selected = controlledSelected ?? internalSelected;
  const setSelected = onSelectionChange ?? setInternalSelected;

  const allKeys = useMemo(() => sortedData.map((row, i) => rowKey(row, i)), [sortedData, rowKey]);
  const allSelected = selectionMode === 'multiple' && allKeys.length > 0 && allKeys.every((k) => selected.includes(k));
  const someSelected = selectionMode === 'multiple' && selected.length > 0 && !allSelected;

  const toggleRow = useCallback(
    (key: React.Key) => {
      if (selectionMode === 'single') {
        setSelected(selected.includes(key) ? [] : [key]);
      } else if (selectionMode === 'multiple') {
        setSelected(
          selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key],
        );
      }
    },
    [selectionMode, selected, setSelected],
  );

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(allKeys);
    }
  }, [allSelected, allKeys, setSelected]);

  /* ── Editing state ──────────────────────────────────── */
  const [editingCell, setEditingCell] = useState<{ rowKey: React.Key; colKey: K } | null>(null);

  const handleDoubleClick = useCallback(
    (rKey: React.Key, colKey: K, colEditable?: boolean) => {
      if (!editable) return;
      if (colEditable === false) return;
      setEditingCell({ rowKey: rKey, colKey });
    },
    [editable],
  );

  const handleCommit = useCallback(
    (rKey: React.Key, colKey: K, value: string) => {
      onCellEdit?.(rKey, colKey, value);
      setEditingCell(null);
    },
    [onCellEdit],
  );

  /* ── Toolbar ────────────────────────────────────────── */
  const showToolbar = toolbar;

  return (
    <div className="space-y-2">
      {showToolbar && (
        <div className="flex items-center gap-2">
          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center gap-1.5 rounded-md border border-secondary-300 bg-white px-3 py-1.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-700"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(selected)}
              disabled={selected.length === 0}
              className="inline-flex items-center gap-1.5 rounded-md border border-secondary-300 bg-white px-3 py-1.5 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50 disabled:opacity-40 disabled:pointer-events-none dark:border-secondary-600 dark:bg-secondary-800 dark:text-danger-400 dark:hover:bg-danger-900/20"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete{selected.length > 0 && ` (${selected.length})`}
            </button>
          )}
          {editable && selected.length === 1 && (
            <button
              type="button"
              onClick={() => {
                const firstEditableCol = columns.find((c) => c.editable !== false);
                if (firstEditableCol) {
                  setEditingCell({ rowKey: selected[0], colKey: firstEditableCol.key });
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-secondary-300 bg-white px-3 py-1.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50 dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-700"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          )}
          {selected.length > 0 && (
            <span className="ml-auto text-sm text-secondary-500 dark:text-secondary-400">
              {selected.length} row{selected.length > 1 ? 's' : ''} selected
            </span>
          )}
        </div>
      )}

      <Table intent={intent} className={className}>
        <TableHeader>
          <TableRow>
            {selectionMode === 'multiple' && (
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  className="h-4 w-4 cursor-pointer rounded border-secondary-300 accent-primary-600"
                  aria-label="Select all"
                />
              </TableHead>
            )}
            {selectionMode === 'single' && <TableHead className="w-10" />}
            {columns.map((col) => {
              const sortable = col.sortable !== false;
              const isActive = sort?.column === col.key;
              return (
                <TableHead
                  key={col.key}
                  className={cn(sortable && 'cursor-pointer select-none', col.headerClassName)}
                  onClick={sortable ? () => handleSort(col.key) : undefined}
                  aria-sort={
                    isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {sortable && (
                      <SortIcon active={isActive} direction={isActive ? sort!.direction : null} />
                    )}
                  </span>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row, i) => {
            const rKey = rowKey(row, i);
            const isSelected = selected.includes(rKey);

            return (
              <TableRow
                key={rKey}
                className={cn(isSelected && 'bg-primary-50/60 dark:bg-primary-900/20')}
                onClick={() => {
                  if (selectionMode !== 'none') toggleRow(rKey);
                }}
              >
                {selectionMode === 'multiple' && (
                  <TableCell className="w-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(rKey)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 cursor-pointer rounded border-secondary-300 accent-primary-600"
                      aria-label="Select row"
                    />
                  </TableCell>
                )}
                {selectionMode === 'single' && (
                  <TableCell className="w-10">
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => toggleRow(rKey)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 cursor-pointer accent-primary-600"
                      aria-label="Select row"
                    />
                  </TableCell>
                )}
                {columns.map((col) => {
                  const isEditing =
                    editingCell?.rowKey === rKey && editingCell?.colKey === col.key;

                  const rawValue =
                    col.editValue?.(row) ??
                    (() => {
                      const v = col.cell(row);
                      return typeof v === 'string' || typeof v === 'number' ? String(v) : '';
                    })();

                  return (
                    <TableCell
                      key={col.key}
                      className={cn(
                        col.cellClassName,
                        editable && col.editable !== false && 'cursor-text',
                      )}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleDoubleClick(rKey, col.key, col.editable);
                      }}
                    >
                      {isEditing ? (
                        <EditableCell
                          value={rawValue}
                          onCommit={(v) => handleCommit(rKey, col.key, v)}
                          onCancel={() => setEditingCell(null)}
                        />
                      ) : (
                        col.cell(row)
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

/* ── SortIcon ──────────────────────────────────────────── */

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection | null }) {
  const cls = 'h-3.5 w-3.5 shrink-0';
  if (!active || !direction) {
    return <ArrowUpDown className={cn(cls, 'opacity-30')} />;
  }
  return direction === 'asc' ? (
    <ArrowUp className={cn(cls, 'opacity-70')} />
  ) : (
    <ArrowDown className={cn(cls, 'opacity-70')} />
  );
}
