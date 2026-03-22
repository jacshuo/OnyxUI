import { useState, useRef, useCallback, useEffect, type RefObject } from "react";
import type { SplitPanelPane } from "./types";

// ─── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_PREFIX = "onyx-split:";
const KEYBOARD_STEP = 10; // px per arrow key press

// ─── Helpers ───────────────────────────────────────────────────────────────────

function persisted(autoSaveId: string | undefined): Record<string, number> {
  if (!autoSaveId) return {};
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + autoSaveId);
    if (raw) return JSON.parse(raw) as Record<string, number>;
  } catch {
    // corrupt / unavailable storage: ignore
  }
  return {};
}

function persist(autoSaveId: string | undefined, sizes: Record<string, number>): void {
  if (!autoSaveId) return;
  try {
    localStorage.setItem(STORAGE_PREFIX + autoSaveId, JSON.stringify(sizes));
  } catch {
    // storage full / unavailable: ignore
  }
}

/** Return ids of panes that are currently visible. */
function visibleIds(panes: SplitPanelPane[], visibility: Record<string, boolean>): string[] {
  return panes.filter((p) => visibility[p.id] !== false).map((p) => p.id);
}

/** Clamp `value` between lo and hi. */
function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

/** Distribute `totalPx` equally among the provided ids. */
function even(ids: string[], totalPx: number): Record<string, number> {
  if (ids.length === 0) return {};
  const share = totalPx / ids.length;
  return Object.fromEntries(ids.map((id) => [id, share]));
}

// ─── Drag state ────────────────────────────────────────────────────────────────

interface DragState {
  /** id of the pane to the left / above the handle */
  idA: string;
  /** id of the pane to the right / below the handle */
  idB: string;
  /** Raw client coordinate at drag start */
  startPos: number;
  /** Size of paneA at drag start */
  startA: number;
  /** Size of paneB at drag start */
  startB: number;
  /** Resolved minSize for paneA */
  minA: number;
  /** Resolved maxA for paneA */
  maxA: number;
  /** Resolved minSize for paneB */
  minB: number;
  /** Resolved maxB for paneB */
  maxB: number;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export interface UseSplitPanelOptions {
  panes: SplitPanelPane[];
  direction: "horizontal" | "vertical";
  containerRef: RefObject<HTMLDivElement | null>;
  visibility: Record<string, boolean>;
  autoSaveId?: string;
  onResizeEnd?: (sizes: Record<string, number>) => void;
}

export interface UseSplitPanelReturn {
  /** Current px sizes for every pane, keyed by id. */
  sizes: Record<string, number>;
  /** Index of the handle currently being dragged, or null. */
  activeHandleIndex: number | null;
  /**
   * Build pointer-event handlers for interacting with a specific resize handle.
   * `handleIndex` is the index within the *visible* pane array —
   * the handle sits between visiblePanes[handleIndex] and visiblePanes[handleIndex + 1].
   */
  buildHandlers: (
    handleIndex: number,
    paneA: SplitPanelPane,
    paneB: SplitPanelPane,
  ) => {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  };
}

export function useSplitPanel({
  panes,
  direction,
  containerRef,
  visibility,
  autoSaveId,
  onResizeEnd,
}: UseSplitPanelOptions): UseSplitPanelReturn {
  const isHorizontal = direction === "horizontal";

  // ── Size state ──────────────────────────────────────────────────────────────
  // Sizes are stored for ALL panes (including hidden ones so we can restore them).
  const [sizes, setSizes] = useState<Record<string, number>>(() => persisted(autoSaveId));

  // Track whether we've completed the first-layout initialisation
  const initialised = useRef(false);

  // ── Initialise sizes on mount ───────────────────────────────────────────────
  useEffect(() => {
    if (initialised.current) return;
    const el = containerRef.current;
    if (!el) return;

    const containerSize = isHorizontal ? el.clientWidth : el.clientHeight;
    const saved = persisted(autoSaveId);

    const next: Record<string, number> = {};
    const unspecified: SplitPanelPane[] = [];
    let allocated = 0;

    for (const p of panes) {
      const isVisible = visibility[p.id] !== false;

      if (!isVisible) {
        // Hidden pane: keep saved / default size for future restore; don't count toward layout
        next[p.id] = saved[p.id] ?? p.defaultSize ?? 200;
        continue;
      }

      if (saved[p.id] !== undefined) {
        next[p.id] = saved[p.id];
        allocated += saved[p.id];
      } else if (p.defaultSize !== undefined) {
        next[p.id] = p.defaultSize;
        allocated += p.defaultSize;
      } else {
        unspecified.push(p);
      }
    }

    if (unspecified.length > 0) {
      const remaining = Math.max(0, containerSize - allocated);
      const share = remaining / unspecified.length;
      for (const p of unspecified) {
        next[p.id] = Math.max(share, p.minSize ?? 48);
      }
    }

    initialised.current = true;
    setSizes(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  // ── Unified sync effect: handles structural add/remove AND visibility changes ─
  // Both are tracked via refs so we can diff them inside a single effect.
  const prevVisibility = useRef<Record<string, boolean>>(visibility);
  const prevPaneIds = useRef<string[]>(panes.map((p) => p.id));

  useEffect(() => {
    const prevVis = prevVisibility.current;
    const prevIds = prevPaneIds.current;
    const currIds = panes.map((p) => p.id);

    prevVisibility.current = visibility;
    prevPaneIds.current = currIds;

    // ── Detect structural changes (add / remove from panes array) ──────────
    const added = currIds.filter((id) => !prevIds.includes(id));
    const removed = prevIds.filter((id) => !currIds.includes(id));

    // ── Detect visibility changes (only for panes that weren't added/removed) ─
    const hidden: string[] = []; // was visible, now hidden
    const shown: string[] = []; // was hidden, now visible

    for (const p of panes) {
      if (added.includes(p.id)) continue; // handled below
      const wasVisible = prevVis[p.id] !== false;
      const isVisible = visibility[p.id] !== false;
      if (wasVisible && !isVisible) hidden.push(p.id);
      if (!wasVisible && isVisible) shown.push(p.id);
    }

    if (added.length === 0 && removed.length === 0 && hidden.length === 0 && shown.length === 0)
      return;

    setSizes((prev) => {
      const next = { ...prev };

      // ── Remove panes: donate their size to the nearest remaining visible pane ─
      for (const id of removed) {
        const removedSize = next[id] ?? 0;
        delete next[id];
        if (removedSize > 0) {
          // Find the nearest visible remaining pane (prefer right/below, fallback left/above)
          const removedIdx = prevIds.indexOf(id);
          const visibleRemaining = currIds.filter((cid) => visibility[cid] !== false);
          // Try right/below first
          let receiver = visibleRemaining.find(
            (_, i) => prevIds.indexOf(currIds[currIds.indexOf(visibleRemaining[i])]) > removedIdx,
          );
          if (!receiver) receiver = visibleRemaining[visibleRemaining.length - 1];
          if (receiver) next[receiver] = (next[receiver] ?? 0) + removedSize;
        }
      }

      // ── Add panes: borrow space from the largest visible neighbour ────────
      for (const id of added) {
        const pane = panes.find((p) => p.id === id)!;

        if (visibility[id] === false) {
          // Added but immediately hidden: reserve default size for restoration
          next[id] = pane.defaultSize ?? 200;
          continue;
        }

        const targetSize = pane.defaultSize ?? 200;
        const newSize = Math.max(targetSize, pane.minSize ?? 48);

        // Find the largest visible pane (excluding other newly-added ones) to borrow from
        const donors = currIds
          .filter((cid) => cid !== id && !added.includes(cid) && visibility[cid] !== false)
          .map((cid) => ({ id: cid, size: next[cid] ?? 0 }))
          .sort((a, b) => b.size - a.size);

        if (donors.length > 0) {
          const donorConfig = panes.find((p) => p.id === donors[0].id);
          const donorMin = donorConfig?.minSize ?? 48;
          const canGive = Math.max(0, donors[0].size - donorMin);
          const give = Math.min(newSize, canGive);
          next[donors[0].id] = donors[0].size - give;
          next[id] = give;
        } else {
          next[id] = newSize;
        }
      }

      // ── Hide panes: donate size to the nearest visible neighbour ──────────
      for (const id of hidden) {
        const hiddenSize = next[id] ?? 0;
        if (hiddenSize === 0) continue;

        const paneIdx = panes.findIndex((p) => p.id === id);

        let giveTo: string | undefined;
        for (let i = paneIdx + 1; i < panes.length; i++) {
          if (visibility[panes[i].id] !== false && !hidden.includes(panes[i].id)) {
            giveTo = panes[i].id;
            break;
          }
        }
        if (!giveTo) {
          for (let i = paneIdx - 1; i >= 0; i--) {
            if (visibility[panes[i].id] !== false && !hidden.includes(panes[i].id)) {
              giveTo = panes[i].id;
              break;
            }
          }
        }
        if (giveTo) next[giveTo] = (next[giveTo] ?? 0) + hiddenSize;
        next[id] = hiddenSize; // keep virtual size for restoration
      }

      // ── Show panes: reclaim size from the nearest visible neighbour ───────
      for (const id of shown) {
        const restoreSize = next[id] ?? panes.find((p) => p.id === id)?.defaultSize ?? 200;
        const paneIdx = panes.findIndex((p) => p.id === id);

        let takeFrom: string | undefined;
        for (let i = paneIdx + 1; i < panes.length; i++) {
          if (visibility[panes[i].id] !== false && !shown.includes(panes[i].id)) {
            takeFrom = panes[i].id;
            break;
          }
        }
        if (!takeFrom) {
          for (let i = paneIdx - 1; i >= 0; i--) {
            if (visibility[panes[i].id] !== false && !shown.includes(panes[i].id)) {
              takeFrom = panes[i].id;
              break;
            }
          }
        }
        if (takeFrom) {
          const current = next[takeFrom] ?? 0;
          const minNeighbour = panes.find((p) => p.id === takeFrom)?.minSize ?? 48;
          const canGive = Math.max(0, current - minNeighbour);
          const give = Math.min(restoreSize, canGive);
          next[takeFrom] = current - give;
          next[id] = give;
        } else {
          next[id] = restoreSize;
        }
      }

      return next;
    });
  }, [visibility, panes]);

  // ── Drag state ──────────────────────────────────────────────────────────────
  const dragRef = useRef<DragState | null>(null);
  const [activeHandleIndex, setActiveHandleIndex] = useState<number | null>(null);
  const activeHandleIndexRef = useRef<number | null>(null);

  // ── Build per-handle event handlers ────────────────────────────────────────
  const buildHandlers = useCallback(
    (handleIndex: number, paneA: SplitPanelPane, paneB: SplitPanelPane) => {
      const MIN_A = paneA.minSize ?? 48;
      const MAX_A = paneA.maxSize ?? Infinity;
      const MIN_B = paneB.minSize ?? 48;
      const MAX_B = paneB.maxSize ?? Infinity;

      const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        // Capture pointer so we receive move/up even if cursor leaves the element
        // (setPointerCapture may be unavailable in non-browser environments)
        try {
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        } catch {
          // no-op in environments that do not support pointer capture
        }

        dragRef.current = {
          idA: paneA.id,
          idB: paneB.id,
          startPos: isHorizontal ? e.clientX : e.clientY,
          startA: sizes[paneA.id] ?? 0,
          startB: sizes[paneB.id] ?? 0,
          minA: MIN_A,
          maxA: MAX_A,
          minB: MIN_B,
          maxB: MAX_B,
        };
        activeHandleIndexRef.current = handleIndex;
        setActiveHandleIndex(handleIndex);
      };

      const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragRef.current || activeHandleIndexRef.current !== handleIndex) return;

        const { idA, idB, startPos, startA, startB, minA, maxA, minB, maxB } = dragRef.current;
        const delta = (isHorizontal ? e.clientX : e.clientY) - startPos;

        // Compute unclamped new sizes
        let newA = startA + delta;
        let newB = startB - delta;

        // Clamp pane A then compensate pane B (and vice-versa)
        if (newA < minA) {
          newA = minA;
          newB = startA + startB - minA;
        }
        if (newA > maxA) {
          newA = maxA;
          newB = startA + startB - maxA;
        }
        if (newB < minB) {
          newB = minB;
          newA = startA + startB - minB;
        }
        if (newB > maxB) {
          newB = maxB;
          newA = startA + startB - maxB;
        }

        // Final clamp after cross-compensation
        newA = clamp(newA, minA, maxA);
        newB = clamp(newB, minB, maxB);

        setSizes((prev) => ({ ...prev, [idA]: newA, [idB]: newB }));
      };

      const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragRef.current || activeHandleIndexRef.current !== handleIndex) return;

        dragRef.current = null;
        activeHandleIndexRef.current = null;
        setActiveHandleIndex(null);

        setSizes((prev) => {
          persist(autoSaveId, prev);
          onResizeEnd?.(prev);
          return prev;
        });
      };

      // ── Keyboard resize ─────────────────────────────────────────────────────
      const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const relevant = isHorizontal ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
        if (!relevant.includes(e.key)) return;
        e.preventDefault();

        const step = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -KEYBOARD_STEP : KEYBOARD_STEP;

        setSizes((prev) => {
          const curA = prev[paneA.id] ?? 0;
          const curB = prev[paneB.id] ?? 0;
          let newA = clamp(curA + step, MIN_A, MAX_A);
          let newB = curA + curB - newA;
          newB = clamp(newB, MIN_B, MAX_B);
          newA = curA + curB - newB;
          newA = clamp(newA, MIN_A, MAX_A);

          const next = { ...prev, [paneA.id]: newA, [paneB.id]: newB };
          persist(autoSaveId, next);
          onResizeEnd?.(next);
          return next;
        });
      };

      return { onPointerDown, onPointerMove, onPointerUp, onKeyDown };
    },
    // Rebuild handlers when key deps change (sizes captured via closure for pointer-down only)

    [isHorizontal, sizes, autoSaveId, onResizeEnd],
  );

  return { sizes, activeHandleIndex, buildHandlers };
}

// Re-export visible id helper for use in the component
export { visibleIds, even };
