import type React from "react";

// ─── Public types ──────────────────────────────────────────────────────────────

/**
 * Configuration for a single pane inside SplitPanel.
 */
export interface SplitPanelPane {
  /** Unique identifier used to key the pane and track visibility/sizes. */
  id: string;

  /**
   * Initial size in pixels when the pane has no persisted size.
   * Panes without a `defaultSize` share remaining container space equally.
   */
  defaultSize?: number;

  /** Minimum size in pixels. The pane cannot be dragged smaller than this. Default: 48. */
  minSize?: number;

  /** Maximum size in pixels. The pane cannot be dragged larger than this. Default: unlimited. */
  maxSize?: number;

  /**
   * CSS background color for this pane.
   * Overrides the container-level `defaultBackground`.
   * Accepts any valid CSS color value.
   */
  background?: string;

  /** Additional CSS class names applied to this pane's wrapper element. */
  className?: string;

  /** Inline style overrides for this pane's wrapper element. */
  style?: React.CSSProperties;

  /** Pane content. */
  children?: React.ReactNode;
}

/**
 * Props for the SplitPanel component.
 */
export interface SplitPanelProps {
  /**
   * Controls whether panes are arranged side-by-side (`"horizontal"`) or
   * stacked top-to-bottom (`"vertical"`). Default: `"horizontal"`.
   */
  direction?: "horizontal" | "vertical";

  /**
   * Pane definitions. Order determines visual order left-to-right (horizontal)
   * or top-to-bottom (vertical).
   */
  panes: SplitPanelPane[];

  /**
   * Controlled visibility map `{ [paneId]: boolean }`.
   * Omitted or `true` → visible. `false` → the pane is removed from layout
   * and its space is redistributed to its neighbours.
   */
  visibility?: Record<string, boolean>;

  /**
   * Fires when the component wants to toggle a pane.
   * (Reserved for future imperative toggle APIs — the consumer drives state.)
   */
  onVisibilityChange?: (id: string, visible: boolean) => void;

  /** Container width. Default: `"100%"`. Accepts CSS length strings or numbers (px). */
  width?: string | number;

  /** Container height. Default: `"100%"`. Accepts CSS length strings or numbers (px). */
  height?: string | number;

  /**
   * Visual thickness of the resize divider bar in pixels. Default: 4.
   * The interactive hit-area is always ≥ 8 px for usability.
   */
  handleSize?: number;

  /**
   * Default background color applied to every pane unless the pane defines
   * its own `background`. Accepts any CSS color value.
   */
  defaultBackground?: string;

  /**
   * When provided, each pane's pixel size is persisted under
   * `localStorage["onyx-split:<autoSaveId>"]` and restored on re-mount.
   */
  autoSaveId?: string;

  /**
   * Called after the user finishes a resize drag interaction.
   * Receives a snapshot of all pane sizes (visible and hidden) in pixels.
   */
  onResizeEnd?: (sizes: Record<string, number>) => void;

  /** Additional CSS class names for the container element. */
  className?: string;

  /** Inline style overrides for the container element. */
  style?: React.CSSProperties;
}

// ─── Internal types (not exported from the library barrel) ─────────────────────

/** State passed to a rendered handle element. */
export interface _HandleProps {
  /** Index in the visible-pane array: handle sits between [index] and [index+1]. */
  index: number;
  /** Configuration of the pane to the left / above. */
  paneA: SplitPanelPane;
  /** Configuration of the pane to the right / below. */
  paneB: SplitPanelPane;
  /** Whether this handle is currently being dragged. */
  isDragging: boolean;
  /** Visual bar thickness in px. */
  handleSize: number;
  /** Are panels stacked horizontally? */
  isHorizontal: boolean;
  /** Pointer event handlers. */
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  /** Keyboard step resize handler. */
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}
