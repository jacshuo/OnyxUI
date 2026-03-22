import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import type { Ref } from "react";
import type { VirtualListAlign, VirtualListHandle, VirtualListProps } from "./types";

// ─── Internal helpers ──────────────────────────────────────────────────────────

const LS_PREFIX = "onyx-vlist:";

/** Binary search: returns the last index i where `offsets[i] <= target`. */
function bisectRight(offsets: number[], target: number): number {
  let lo = 0;
  let hi = offsets.length - 2; // offsets.length === items.length + 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (offsets[mid + 1] <= target) {
      lo = mid + 1;
    } else if (offsets[mid] > target) {
      hi = mid - 1;
    } else {
      return mid;
    }
  }
  return Math.max(0, lo);
}

// ─── Hook return type ─────────────────────────────────────────────────────────

export interface UseVirtualListReturn {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
  startIndex: number;
  endIndex: number;
  totalSize: number;
  getItemOffset: (index: number) => number;
  getItemSize: (index: number) => number;
  measureItem: (index: number, el: Element | null) => void;
}

// ─── Core hook ────────────────────────────────────────────────────────────────

export function useVirtualList<T>(
  props: VirtualListProps<T>,
  handleRef: Ref<VirtualListHandle>,
): UseVirtualListReturn {
  const {
    items,
    itemHeight,
    estimatedItemHeight = 48,
    direction = "vertical",
    overscan = 3,
    onReachEnd,
    reachEndThreshold = 120,
    isLoading,
    onScroll: onScrollProp,
    onVisibleRangeChange,
    scrollRestorationId,
  } = props;

  const isVertical = direction === "vertical";
  const isFixed = typeof itemHeight === "number";
  const fixedSize = isFixed ? (itemHeight as number) : 0;

  const scrollerRef = useRef<HTMLDivElement>(null);

  // ── Viewport size ────────────────────────────────────────────────────────
  const [viewportSize, setViewportSize] = useState(300);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const size = isVertical ? entry.contentRect.height : entry.contentRect.width;
      if (size > 0) setViewportSize(size);
    });
    ro.observe(el);
    // Seed with current size
    const rect = el.getBoundingClientRect();
    const initial = isVertical ? rect.height : rect.width;
    if (initial > 0) setViewportSize(initial);
    return () => ro.disconnect();
  }, [isVertical]);

  // ── Scroll position ───────────────────────────────────────────────────────
  const [scrollOffset, setScrollOffset] = useState(0);

  // Restore scroll on mount
  useEffect(() => {
    if (!scrollRestorationId) return;
    const el = scrollerRef.current;
    if (!el) return;
    try {
      const raw = localStorage.getItem(LS_PREFIX + scrollRestorationId);
      if (raw !== null) {
        const offset = parseFloat(raw);
        if (!Number.isNaN(offset) && offset > 0) {
          requestAnimationFrame(() => {
            if (isVertical) el.scrollTop = offset;
            else el.scrollLeft = offset;
          });
        }
      }
    } catch {
      // localStorage may be unavailable
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Infinite-scroll dedup guard ───────────────────────────────────────────
  const reachEndFiredRef = useRef(false);

  // Reset the guard when items grow (new page has arrived)
  const itemsLenRef = useRef(items.length);
  if (items.length !== itemsLenRef.current) {
    itemsLenRef.current = items.length;
    reachEndFiredRef.current = false;
  }

  // ── Scroll handler ────────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const offset = isVertical ? el.scrollTop : el.scrollLeft;
    setScrollOffset(offset);
    onScrollProp?.(offset);

    // Persist
    if (scrollRestorationId) {
      try {
        localStorage.setItem(LS_PREFIX + scrollRestorationId, String(offset));
      } catch {
        // ignore
      }
    }

    // Infinite scroll trigger
    if (onReachEnd && !isLoading) {
      const scrollSize = isVertical
        ? el.scrollHeight - el.clientHeight
        : el.scrollWidth - el.clientWidth;
      if (scrollSize - offset <= reachEndThreshold) {
        if (!reachEndFiredRef.current) {
          reachEndFiredRef.current = true;
          onReachEnd();
        }
      }
    }
  }, [isVertical, onScrollProp, scrollRestorationId, onReachEnd, isLoading, reachEndThreshold]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── Horizontal wheel → scrollLeft redirect ────────────────────────────────
  // Browsers send vertical wheel events by default; for horizontal lists we
  // intercept and redirect deltaY onto scrollLeft so a standard scroll-wheel
  // (or vertical trackpad gesture) scrolls the carousel left/right.
  useEffect(() => {
    if (isVertical) return;
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // Let native horizontal gestures (two-finger trackpad swipe) pass through.
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isVertical]);

  // ── Pointer drag scroll (horizontal lists) ────────────────────────────────
  // Lets users click-and-drag the horizontal list like a carousel.
  // Activates only after the pointer has moved > 5 px to preserve click events
  // on interactive children (buttons, links, checkboxes, …).
  useEffect(() => {
    if (isVertical) return;
    const el = scrollerRef.current;
    if (!el) return;

    const THRESHOLD = 5;
    let active = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;

    const onDown = (e: PointerEvent) => {
      const target = e.target as Element;
      if (
        target.closest(
          "button,a,input,select,textarea,[role=button],[role=checkbox],[role=radio],[role=option]",
        )
      )
        return;
      if (e.button !== 0) return;
      active = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!active) return;
      const delta = startX - e.clientX;
      if (!moved) {
        if (Math.abs(delta) < THRESHOLD) return;
        moved = true;
        el.style.cursor = "grabbing";
        el.style.userSelect = "none";
      }
      el.scrollLeft = startLeft + delta;
    };

    const onUp = (e: PointerEvent) => {
      if (!active) return;
      active = false;
      el.style.cursor = "";
      el.style.userSelect = "";
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // ignore — element may have been removed
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [isVertical]);

  // ── Variable-height measured sizes ────────────────────────────────────────
  const measuredHeightsRef = useRef<Map<number, number>>(new Map());
  // Bumped each time a new measurement arrives to trigger offset recompute
  const [measureEpoch, setMeasureEpoch] = useState(0);

  const measureItem = useCallback(
    (index: number, el: Element | null) => {
      if (isFixed || !el) return;
      const size = isVertical ? (el as HTMLElement).offsetHeight : (el as HTMLElement).offsetWidth;
      if (size > 0 && measuredHeightsRef.current.get(index) !== size) {
        measuredHeightsRef.current.set(index, size);
        setMeasureEpoch((e) => e + 1);
      }
    },
    [isFixed, isVertical],
  );

  // Clear measurements when items array reference changes (dataset swap)
  const prevItemsRef = useRef(items);
  if (prevItemsRef.current !== items) {
    prevItemsRef.current = items;
    if (!isFixed) {
      measuredHeightsRef.current = new Map();
    }
  }

  // ── Offset cache (variable height only) ───────────────────────────────────
  const offsets = useMemo(() => {
    if (isFixed) return [] as number[];
    const arr = new Array<number>(items.length + 1);
    arr[0] = 0;
    for (let i = 0; i < items.length; i++) {
      const measured = measuredHeightsRef.current.get(i);
      let h: number;
      if (measured !== undefined) {
        h = measured;
      } else if (typeof itemHeight === "function") {
        h = items[i] !== undefined ? itemHeight(items[i], i) : estimatedItemHeight;
      } else {
        h = estimatedItemHeight;
      }
      arr[i + 1] = arr[i] + h;
    }
    return arr;
    // measureEpoch deliberately included to recompute after measurements
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFixed, items, itemHeight, estimatedItemHeight, measureEpoch]);

  // ── Size accessors ────────────────────────────────────────────────────────
  const getItemOffset = useCallback(
    (index: number): number => {
      if (isFixed) return index * fixedSize;
      return offsets[index] ?? 0;
    },
    [isFixed, fixedSize, offsets],
  );

  const getItemSize = useCallback(
    (index: number): number => {
      if (isFixed) return fixedSize;
      const measured = measuredHeightsRef.current.get(index);
      if (measured !== undefined) return measured;
      if (typeof itemHeight === "function" && items[index] !== undefined) {
        return itemHeight(items[index], index);
      }
      return estimatedItemHeight;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFixed, fixedSize, itemHeight, items, estimatedItemHeight, measureEpoch],
  );

  // ── Virtual window ────────────────────────────────────────────────────────
  let totalSize: number;
  let startIndex: number;
  let endIndex: number;

  if (isFixed) {
    totalSize = fixedSize * items.length;
    const rawStart = Math.floor(scrollOffset / fixedSize);
    const rawEnd = Math.ceil((scrollOffset + viewportSize) / fixedSize);
    startIndex = Math.max(0, rawStart - overscan);
    endIndex = Math.min(items.length - 1, rawEnd + overscan - 1);
  } else {
    totalSize = offsets[items.length] ?? 0;
    if (offsets.length > 1) {
      const rawStart = bisectRight(offsets, scrollOffset);
      startIndex = Math.max(0, rawStart - overscan);
      let rawEnd = rawStart;
      while (rawEnd < items.length && offsets[rawEnd] < scrollOffset + viewportSize) rawEnd++;
      endIndex = Math.min(items.length - 1, rawEnd + overscan - 1);
    } else {
      startIndex = 0;
      endIndex = Math.min(items.length - 1, overscan * 2);
    }
  }
  startIndex = Math.max(0, startIndex);
  endIndex = Math.max(startIndex, Math.min(items.length - 1, endIndex));

  // ── Visible range callback ────────────────────────────────────────────────
  const prevRangeRef = useRef({ start: -1, end: -1 });
  useEffect(() => {
    let visStart: number;
    let visEnd: number;
    if (isFixed && fixedSize > 0) {
      visStart = Math.max(0, Math.floor(scrollOffset / fixedSize));
      visEnd = Math.min(items.length - 1, Math.ceil((scrollOffset + viewportSize) / fixedSize) - 1);
    } else {
      visStart = bisectRight(offsets, scrollOffset);
      visEnd = visStart;
      while (visEnd < items.length && offsets[visEnd] < scrollOffset + viewportSize) visEnd++;
      visEnd = Math.max(0, visEnd - 1);
    }
    if (prevRangeRef.current.start !== visStart || prevRangeRef.current.end !== visEnd) {
      prevRangeRef.current = { start: visStart, end: visEnd };
      onVisibleRangeChange?.(visStart, visEnd);
    }
  });

  // ── Imperative scroll API ─────────────────────────────────────────────────
  useImperativeHandle(
    handleRef,
    () => ({
      scrollToIndex(index: number, align: VirtualListAlign = "auto") {
        const el = scrollerRef.current;
        if (!el) return;
        const itemOffset = getItemOffset(index);
        const itemSize = getItemSize(index);
        const viewport = isVertical ? el.clientHeight : el.clientWidth;
        const current = isVertical ? el.scrollTop : el.scrollLeft;

        let target: number;
        if (align === "start") {
          target = itemOffset;
        } else if (align === "end") {
          target = itemOffset - viewport + itemSize;
        } else if (align === "center") {
          target = itemOffset - (viewport - itemSize) / 2;
        } else {
          // "auto" — minimal movement
          if (itemOffset < current) {
            target = itemOffset;
          } else if (itemOffset + itemSize > current + viewport) {
            target = itemOffset - viewport + itemSize;
          } else {
            return;
          }
        }
        el.scrollTo({
          [isVertical ? "top" : "left"]: Math.max(0, target),
          behavior: "smooth",
        });
      },
      scrollToOffset(offset: number) {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollTo({ [isVertical ? "top" : "left"]: offset, behavior: "smooth" });
      },
      getScrollOffset() {
        const el = scrollerRef.current;
        if (!el) return 0;
        return isVertical ? el.scrollTop : el.scrollLeft;
      },
    }),
    [getItemOffset, getItemSize, isVertical],
  );

  return {
    scrollerRef,
    startIndex,
    endIndex,
    totalSize,
    getItemOffset,
    getItemSize,
    measureItem,
  };
}
