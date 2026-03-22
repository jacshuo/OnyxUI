import type { CSSProperties, ReactNode } from "react";

// ─── Public types ──────────────────────────────────────────────────────────────

/**
 * Alignment hint for `scrollToIndex`.
 * - `"start"` — item top/left aligns with viewport start
 * - `"end"` — item bottom/right aligns with viewport end
 * - `"center"` — item is centered in the viewport
 * - `"auto"` — minimal scroll to bring the item into view (default)
 */
export type VirtualListAlign = "start" | "center" | "end" | "auto";

/** Scroll axis for the virtual list. */
export type VirtualListDirection = "vertical" | "horizontal";

/** Imperative handle exposed via `ref` on `<VirtualList>`. */
export interface VirtualListHandle {
  /** Scroll to bring item at `index` into view at the specified alignment. */
  scrollToIndex: (index: number, align?: VirtualListAlign) => void;
  /** Jump to an exact pixel offset (smooth by default). */
  scrollToOffset: (offset: number) => void;
  /** Returns the current scroll offset in pixels. */
  getScrollOffset: () => number;
}

export interface VirtualListProps<T = unknown> {
  // ── Data ──────────────────────────────────────────────────────────────────
  /** Dataset to virtualise. Change the reference to swap/extend data. */
  items: T[];
  /**
   * Returns a stable key for an item. Defaults to the item's array index.
   * Provide this whenever items can be reordered or inserted at arbitrary positions.
   */
  getItemKey?: (item: T, index: number) => string | number;

  // ── Rendering ─────────────────────────────────────────────────────────────
  /**
   * Render callback for each visible item.
   * The component wraps every item in an absolutely-positioned container, so
   * your element can fill 100 % of its wrapper without extra layout work.
   */
  renderItem: (item: T, index: number) => ReactNode;

  // ── Item sizing ───────────────────────────────────────────────────────────
  /**
   * Height (vertical) or width (horizontal) of each item in pixels.
   *
   * - **number** — fixed uniform size; fastest render path (O(1) offset lookup).
   * - **function** — variable per-item size; items are measured via
   *   `ResizeObserver` after first render and the layout is corrected automatically.
   */
  itemHeight: number | ((item: T, index: number) => number);
  /**
   * Estimated size used as a placeholder before a variable-height item is
   * measured. Only relevant when `itemHeight` is a function.
   * A good estimate reduces layout shift on first render.
   * @default 48
   */
  estimatedItemHeight?: number;

  // ── Container ─────────────────────────────────────────────────────────────
  /** Viewport height (CSS value). Set to `"100%"` to fill a parent container. @default "100%" */
  height?: number | string;
  /** Viewport width (CSS value). @default "100%" */
  width?: number | string;

  // ── Scroll direction ──────────────────────────────────────────────────────
  direction?: VirtualListDirection;

  // ── Performance ───────────────────────────────────────────────────────────
  /**
   * Extra rows rendered outside the visible viewport on each side to reduce
   * white-flash during fast scroll. Higher values trade CPU/memory for smoothness.
   * @default 3
   */
  overscan?: number;

  // ── Infinite scroll ───────────────────────────────────────────────────────
  /** Fired when the user scrolls within `reachEndThreshold` px of the end. */
  onReachEnd?: () => void;
  /**
   * Pixel distance from the scroll end that triggers `onReachEnd`.
   * @default 120
   */
  reachEndThreshold?: number;
  /** When `true` a loading indicator is shown at the bottom/right. */
  isLoading?: boolean;
  /** Custom loading indicator. Overrides the default spinner row entirely. */
  loadingRenderer?: () => ReactNode;
  /**
   * Text shown in the **default** loading indicator (when `loadingRenderer` is not provided).
   * @default "Loading…"
   */
  loadingText?: string;

  // ── Empty state ───────────────────────────────────────────────────────────
  /** Rendered when `items` is empty. Overrides the default empty state entirely. */
  emptyRenderer?: () => ReactNode;
  /**
   * Text shown in the **default** empty-state indicator (when `emptyRenderer` is not provided).
   * @default "No items"
   */
  emptyText?: string;

  // ── Scroll restoration ────────────────────────────────────────────────────
  /**
   * When provided the scroll position is persisted to `localStorage` under
   * the key `"onyx-vlist:<scrollRestorationId>"` and restored on mount.
   */
  scrollRestorationId?: string;

  // ── Callbacks ─────────────────────────────────────────────────────────────
  /** Called on every scroll event with the current pixel offset. */
  onScroll?: (offset: number) => void;
  /**
   * Called whenever the set of *visually* visible items changes.
   * Indices exclude the overscan buffer.
   */
  onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;

  // ── Styling ────────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
  /**
   * Class name applied to every item's wrapper `<div>`. Use this to add
   * borders, hover states, or selection highlights without modifying each
   * rendered item.
   */
  itemClassName?: string;
}
