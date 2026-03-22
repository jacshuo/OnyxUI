import React, { useRef } from "react";
import { cn } from "../../../lib/utils";
import { useSplitPanel, visibleIds } from "./SplitPanel.hooks";
import type { SplitPanelProps, SplitPanelPane, _HandleProps } from "./types";

// ─── Constants ─────────────────────────────────────────────────────────────────

/** Minimum interactive hit-area size for the resize handle in px. */
const HIT_AREA = 8;

// ─── Handle ────────────────────────────────────────────────────────────────────

/**
 * Resize divider rendered between two adjacent visible panes.
 * Provides hover + active visual feedback and keyboard accessibility.
 */
function SplitHandle({
  isDragging,
  handleSize,
  isHorizontal,
  paneA,
  paneB,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: _HandleProps) {
  const barThickness = Math.max(1, handleSize);
  const hitSize = Math.max(barThickness, HIT_AREA);

  return (
    <div
      role="separator"
      aria-orientation={isHorizontal ? "vertical" : "horizontal"}
      aria-label={`Resize handle between ${paneA.id} and ${paneB.id}`}
      tabIndex={0}
      className={cn(
        "group relative z-10 shrink-0 select-none outline-none",
        isHorizontal ? "cursor-col-resize" : "cursor-row-resize",
      )}
      style={
        isHorizontal
          ? { width: hitSize, minWidth: hitSize }
          : { height: hitSize, minHeight: hitSize }
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      {/* Visual bar — centered in the hit area */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute rounded-sm transition-colors duration-150",
          "bg-primary-200 dark:bg-primary-700",
          // hover state
          "group-hover:bg-primary-400 dark:group-hover:bg-primary-500",
          // focus-visible ring
          "group-focus-visible:bg-primary-400 dark:group-focus-visible:bg-primary-500",
          // active drag state
          isDragging ? "bg-primary-500 dark:bg-primary-400" : undefined,
          isHorizontal
            ? "top-0 bottom-0 left-1/2 -translate-x-1/2"
            : "left-0 right-0 top-1/2 -translate-y-1/2",
        )}
        style={isHorizontal ? { width: barThickness } : { height: barThickness }}
      />

      {/* Grip dots — subtle visual cue centred on the handle */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "flex gap-0.5 opacity-0 transition-opacity duration-150",
          "group-hover:opacity-100",
          isDragging ? "opacity-100" : undefined,
          isHorizontal ? "flex-col" : "flex-row",
        )}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "rounded-full bg-primary-400 dark:bg-primary-500",
              isHorizontal ? "h-0.5 w-0.5" : "h-0.5 w-0.5",
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Pane ──────────────────────────────────────────────────────────────────────

interface PaneViewProps {
  pane: SplitPanelPane;
  sizeInPx: number;
  isHorizontal: boolean;
  defaultBackground?: string;
}

function SplitPaneView({ pane, sizeInPx, isHorizontal, defaultBackground }: PaneViewProps) {
  const background = pane.background ?? defaultBackground;

  return (
    <div
      data-split-pane-id={pane.id}
      className={cn("relative overflow-auto", pane.className)}
      style={{
        // Fixed size along the split axis; grow freely on the cross axis
        ...(isHorizontal
          ? { width: sizeInPx, minWidth: 0, flexShrink: 0 }
          : { height: sizeInPx, minHeight: 0, flexShrink: 0 }),
        ...(background ? { background } : {}),
        ...pane.style,
      }}
    >
      {pane.children}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

/**
 * SplitPanel — VSCode-style resizable split-pane layout for desktop applications.
 *
 * - Supports horizontal (side-by-side) and vertical (stacked) splits.
 * - Any number of panes; each can be independently shown or hidden.
 * - Drag handles with hover & active visual feedback.
 * - Keyboard resize (arrow keys) for accessibility.
 * - Optional localStorage persistence via `autoSaveId`.
 * - Data-driven via the `panes` prop + controlled `visibility` map.
 */
export function SplitPanel({
  direction = "horizontal",
  panes,
  visibility = {},
  onVisibilityChange,
  width = "100%",
  height = "100%",
  handleSize = 4,
  defaultBackground,
  autoSaveId,
  onResizeEnd,
  className,
  style,
}: SplitPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHorizontal = direction === "horizontal";

  const { sizes, activeHandleIndex, buildHandlers } = useSplitPanel({
    panes,
    direction,
    containerRef,
    visibility,
    autoSaveId,
    onResizeEnd,
  });

  // Only render panes that are currently visible
  const currentlyVisible = visibleIds(panes, visibility);
  const visiblePanes: SplitPanelPane[] = panes.filter((p) => currentlyVisible.includes(p.id));

  // Resolve CSS dimension helpers
  const resolveSize = (v: string | number | undefined, fallback: string): string => {
    if (v === undefined) return fallback;
    return typeof v === "number" ? `${v}px` : v;
  };

  return (
    <div
      ref={containerRef}
      data-split-panel
      data-direction={direction}
      className={cn("flex overflow-hidden", isHorizontal ? "flex-row" : "flex-col", className)}
      style={{
        width: resolveSize(width, "100%"),
        height: resolveSize(height, "100%"),
        ...style,
      }}
    >
      {visiblePanes.map((pane, i) => {
        const sizeInPx = sizes[pane.id] ?? pane.defaultSize ?? 200;
        const isLast = i === visiblePanes.length - 1;
        const nextPane = visiblePanes[i + 1];

        const handleIdx = i; // handle sits between pane[i] and pane[i+1]
        const isDraggingThis = activeHandleIndex === handleIdx;

        const handlers = !isLast && nextPane ? buildHandlers(handleIdx, pane, nextPane) : null;

        return (
          <React.Fragment key={pane.id}>
            <SplitPaneView
              pane={pane}
              sizeInPx={sizeInPx}
              isHorizontal={isHorizontal}
              defaultBackground={defaultBackground}
            />

            {/* Resize handle — render between every two adjacent visible panes */}
            {!isLast && nextPane && handlers && (
              <SplitHandle
                index={handleIdx}
                paneA={pane}
                paneB={nextPane}
                isDragging={isDraggingThis}
                handleSize={handleSize}
                isHorizontal={isHorizontal}
                onPointerDown={handlers.onPointerDown}
                onPointerMove={handlers.onPointerMove}
                onPointerUp={handlers.onPointerUp}
                onKeyDown={handlers.onKeyDown}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Re-export types for consumers who import from the component file
export type { SplitPanelPane, SplitPanelProps };
