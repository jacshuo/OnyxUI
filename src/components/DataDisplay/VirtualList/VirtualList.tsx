import React, { forwardRef, type CSSProperties } from "react";
import { cn } from "../../../lib/utils";
import { useVirtualList } from "./VirtualList.hooks";
import type { VirtualListHandle, VirtualListProps } from "./types";
import "./VirtualList.css";

// ─── Default renderers ─────────────────────────────────────────────────────────

function DefaultLoader({ text = "Loading…" }: { text?: string }): React.ReactElement {
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-sm text-primary-400">
      <span
        aria-hidden
        className="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500"
      />
      <span>{text}</span>
    </div>
  );
}

function DefaultEmpty({ text = "No items" }: { text?: string }): React.ReactElement {
  return (
    <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 text-sm text-primary-400">
      <svg
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 opacity-40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <span>{text}</span>
    </div>
  );
}

// ─── Inner component (receives forwarded ref) ─────────────────────────────────

function VirtualListInner<T>(
  props: VirtualListProps<T>,
  ref: React.Ref<VirtualListHandle>,
): React.ReactElement {
  const {
    items,
    renderItem,
    getItemKey,
    itemHeight,
    direction = "vertical",
    height = "100%",
    width = "100%",
    isLoading = false,
    loadingRenderer,
    loadingText,
    emptyRenderer,
    emptyText,
    itemClassName,
    className,
    style,
  } = props;

  const isVertical = direction === "vertical";
  const isVariable = typeof itemHeight !== "number";

  const { scrollerRef, startIndex, endIndex, totalSize, getItemOffset, getItemSize, measureItem } =
    useVirtualList(props, ref);

  // ── Outer scroll container ──────────────────────────────────────────────
  const containerStyle: CSSProperties = {
    position: "relative",
    overflowX: isVertical ? "hidden" : "auto",
    overflowY: isVertical ? "auto" : "hidden",
    height,
    width,
    // Horizontal lists show grab cursor; JS drag handler changes it to grabbing
    cursor: isVertical ? undefined : "grab",
  };

  // ── Inner spacer (total virtual content size) ───────────────────────────
  const innerStyle: CSSProperties = {
    position: "relative",
    [isVertical ? "height" : "width"]: totalSize,
    [isVertical ? "width" : "height"]: "100%",
    /* Prevent margin collapse from affecting measurements */
    overflow: "hidden",
  };

  // ── Build rendered items ────────────────────────────────────────────────
  const rendered: React.ReactNode[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const item = items[i];
    if (item === undefined) continue;

    const offset = getItemOffset(i);
    const size = getItemSize(i);
    const key = getItemKey ? getItemKey(item, i) : i;

    const wrapperStyle: CSSProperties = {
      position: "absolute",
      [isVertical ? "top" : "left"]: offset,
      [isVertical ? "height" : "width"]: isVariable ? undefined : size,
      [isVertical ? "width" : "height"]: "100%",
      boxSizing: "border-box",
    };

    rendered.push(
      <div
        key={key}
        role="row"
        aria-rowindex={i + 1}
        style={wrapperStyle}
        className={cn("onyx-vlist-item", itemClassName)}
        ref={isVariable ? (el) => measureItem(i, el) : undefined}
      >
        {renderItem(item, i)}
      </div>,
    );
  }

  const isEmpty = items.length === 0;

  return (
    <div
      ref={scrollerRef}
      role="grid"
      aria-rowcount={items.length}
      data-virtual-list
      data-direction={direction}
      className={cn("onyx-virtual-list", className)}
      style={{ ...containerStyle, ...style }}
    >
      {isEmpty ? (
        emptyRenderer ? (
          emptyRenderer()
        ) : (
          <DefaultEmpty text={emptyText} />
        )
      ) : (
        <div style={innerStyle}>{rendered}</div>
      )}

      {isLoading && (loadingRenderer ? loadingRenderer() : <DefaultLoader text={loadingText} />)}
    </div>
  );
}

// ─── Export with generic type parameter preserved ─────────────────────────────

/**
 * `VirtualList` renders only the visible slice of a (potentially enormous) dataset,
 * keeping DOM node count constant regardless of `items.length`.
 *
 * Supports **fixed-height** rows (O(1) offset lookup), **variable-height** rows
 * (auto-measured via `ResizeObserver`), **horizontal** axis, **infinite scroll**,
 * **scroll-to-index**, and **scroll restoration** out of the box.
 *
 * Drop it into any container — `Panel`, `SplitPanel`, `Card`, a bare `div` — and it
 * fills the available space.
 *
 * @example
 * ```tsx
 * <VirtualList
 *   items={myData}
 *   itemHeight={48}
 *   height={400}
 *   renderItem={(item, i) => <Row key={i} item={item} />}
 * />
 * ```
 */
export const VirtualList = forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & React.RefAttributes<VirtualListHandle>,
) => React.ReactElement;
