import { useEffect, useRef, useCallback } from "react";

// ─── Item height for drum-roll columns (px) ──────────────────────────────────
export const ITEM_H = 40;

// ─── Outside click ──────────────────────────────────────────────────────────

export function useOutsideClick(
  refs: ReadonlyArray<{ readonly current: Element | null }>,
  callback: () => void,
  enabled = true,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    function handle(e: MouseEvent) {
      const target = e.target as Node;
      const inside = refs.some((r) => r.current?.contains(target));
      if (!inside) callbackRef.current();
    }

    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [refs, enabled]);
}

// ─── Scroll column ───────────────────────────────────────────────────────────

export function useScrollColumn(
  containerRef: React.RefObject<HTMLDivElement | null>,
  count: number,
  onSelectIndex: (idx: number) => void,
) {
  const isScrollingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onSelectRef = useRef(onSelectIndex);
  onSelectRef.current = onSelectIndex;
  const countRef = useRef(count);
  countRef.current = count;

  const scrollToIndex = useCallback(
    (index: number, behavior: "smooth" | "instant" | "auto" = "smooth") => {
      const el = containerRef.current;
      if (!el) return;
      const target = index * ITEM_H;
      if (Math.abs(el.scrollTop - target) < 2 && behavior !== "instant") return;
      if (behavior === "instant") {
        el.scrollTop = target;
      } else {
        el.scrollTo({ top: target, behavior });
      }
    },
    [containerRef],
  );

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    isScrollingRef.current = true;
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      const el2 = containerRef.current;
      if (!el2) return;
      const rawIdx = Math.round(el2.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(countRef.current - 1, rawIdx));
      const target = clamped * ITEM_H;
      if (Math.abs(el2.scrollTop - target) > 1) {
        el2.scrollTo({ top: target, behavior: "smooth" });
      }
      onSelectRef.current(clamped);
    }, 120);
  }, [containerRef]);

  return { scrollToIndex, handleScroll, isScrollingRef };
}

// ─── Popup positioning ───────────────────────────────────────────────────────

export function usePositioning(
  anchorRef: { readonly current: Element | null },
  popupRef: { readonly current: HTMLElement | null },
  isOpen: boolean,
) {
  useEffect(() => {
    if (!isOpen) return;

    function update() {
      const anchor = anchorRef.current;
      const popup = popupRef.current;
      if (!anchor || !popup) return;

      // On small screens the CSS bottom-sheet handles positioning.
      if (window.innerWidth <= 640) {
        popup.style.top = "";
        popup.style.left = "";
        return;
      }

      const rect = anchor.getBoundingClientRect();
      const vH = window.innerHeight;
      const vW = window.innerWidth;
      const popupH = popup.offsetHeight || 460;
      const popupW = popup.offsetWidth || 340;

      let top = rect.bottom + 8;
      let left = rect.left;

      // Flip up if below viewport
      if (top + popupH > vH - 16) {
        top = Math.max(16, rect.top - popupH - 8);
      }
      // Clamp horizontally
      if (left + popupW > vW - 16) left = Math.max(16, vW - popupW - 16);
      if (left < 16) left = 16;

      popup.style.top = `${Math.round(top)}px`;
      popup.style.left = `${Math.round(left)}px`;
    }

    const tid = setTimeout(update, 0);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [isOpen, anchorRef, popupRef]);
}
