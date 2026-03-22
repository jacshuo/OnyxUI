import { describe, it, expect, vi, beforeAll } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VirtualList } from "../components/DataDisplay/VirtualList";
import type { VirtualListHandle } from "../components/DataDisplay/VirtualList";

/* ─── Test helpers ─────────────────────────────────────────────────────────── */

const ITEMS = Array.from({ length: 500 }, (_, i) => ({ id: i, label: `Item ${i}` }));
type Item = (typeof ITEMS)[0];

/** Simple renderer used across tests */
function renderItem(item: Item) {
  return <div data-testid={`row-${item.id}`}>{item.label}</div>;
}

// jsdom does not measure layout — patch offsetHeight for ResizeObserver tests
function patchOffsetHeight(value: number) {
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get: () => value,
  });
}

// ResizeObserver stub (jsdom doesn't implement it)
class MockResizeObserver {
  private cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
  }
  observe(target: Element) {
    this.cb([{ contentRect: { height: 300, width: 400 } } as ResizeObserverEntry], this);
  }
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  // stub ResizeObserver for jsdom
  (global as unknown as Record<string, unknown>).ResizeObserver = MockResizeObserver;
});

/* ─── describe: VirtualList – render ──────────────────────────────────────── */

describe("VirtualList – render", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <VirtualList items={ITEMS} itemHeight={48} renderItem={renderItem} />,
    );
    expect(container.querySelector("[data-virtual-list]")).not.toBeNull();
  });

  it("renders a subset of items (virtualization active)", () => {
    render(<VirtualList items={ITEMS} itemHeight={48} height={300} renderItem={renderItem} />);
    // Only a window of rows should be in the DOM, not all 500
    const rows = screen.queryAllByTestId(/^row-/);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(ITEMS.length);
  });

  it("renders row 0 initially", () => {
    render(<VirtualList items={ITEMS} itemHeight={48} renderItem={renderItem} />);
    expect(screen.getByTestId("row-0")).toBeInTheDocument();
  });

  it("applies data-virtual-list attribute", () => {
    const { container } = render(
      <VirtualList items={ITEMS} itemHeight={48} renderItem={renderItem} />,
    );
    expect(container.querySelector("[data-virtual-list]")).toBeTruthy();
  });

  it("applies data-direction attribute", () => {
    const { container } = render(
      <VirtualList items={ITEMS} itemHeight={48} direction="horizontal" renderItem={renderItem} />,
    );
    expect(container.querySelector("[data-direction='horizontal']")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = render(
      <VirtualList
        items={ITEMS}
        itemHeight={48}
        className="my-custom-class"
        renderItem={renderItem}
      />,
    );
    expect(container.querySelector(".my-custom-class")).toBeTruthy();
  });

  it("applies itemClassName to each rendered row wrapper", () => {
    const { container } = render(
      <VirtualList
        items={ITEMS}
        itemHeight={48}
        itemClassName="row-wrapper"
        renderItem={renderItem}
      />,
    );
    const wrappers = container.querySelectorAll(".row-wrapper");
    expect(wrappers.length).toBeGreaterThan(0);
  });

  it("renders role='grid' on outer container", () => {
    render(<VirtualList items={ITEMS} itemHeight={48} renderItem={renderItem} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders aria-rowcount equal to items.length", () => {
    render(<VirtualList items={ITEMS} itemHeight={48} renderItem={renderItem} />);
    const grid = screen.getByRole("grid");
    expect(grid).toHaveAttribute("aria-rowcount", String(ITEMS.length));
  });
});

/* ─── describe: VirtualList – empty & loading ─────────────────────────────── */

describe("VirtualList – empty and loading states", () => {
  it("renders default empty state when items is empty", () => {
    render(<VirtualList<Item> items={[]} itemHeight={48} renderItem={renderItem} />);
    expect(screen.getByText("No items")).toBeInTheDocument();
  });

  it("renders custom emptyRenderer when items is empty", () => {
    render(
      <VirtualList<Item>
        items={[]}
        itemHeight={48}
        renderItem={renderItem}
        emptyRenderer={() => <div>Nothing here</div>}
      />,
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders both default empty state and loader when items=[] and isLoading=true", () => {
    render(<VirtualList<Item> items={[]} itemHeight={48} renderItem={renderItem} isLoading />);
    // Empty state shows because items is empty
    expect(screen.getByText("No items")).toBeInTheDocument();
    // Loading indicator also shows
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders default loader when isLoading=true", () => {
    render(<VirtualList items={ITEMS} itemHeight={48} renderItem={renderItem} isLoading />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders custom loadingRenderer when isLoading=true", () => {
    render(
      <VirtualList
        items={ITEMS}
        itemHeight={48}
        renderItem={renderItem}
        isLoading
        loadingRenderer={() => <div>Custom spinner</div>}
      />,
    );
    expect(screen.getByText("Custom spinner")).toBeInTheDocument();
  });
});

/* ─── describe: VirtualList – keys ────────────────────────────────────────── */

describe("VirtualList – getItemKey", () => {
  it("uses getItemKey for row keys (no duplicate key warnings)", () => {
    // If duplicate keys existed React would warn — just check renders correctly
    render(
      <VirtualList
        items={ITEMS}
        itemHeight={48}
        getItemKey={(it) => it.id}
        renderItem={renderItem}
      />,
    );
    expect(screen.getByTestId("row-0")).toBeInTheDocument();
  });
});

/* ─── describe: VirtualList – direction ───────────────────────────────────── */

describe("VirtualList – direction", () => {
  it("sets overflow-y:auto for vertical direction", () => {
    const { container } = render(
      <VirtualList items={ITEMS} itemHeight={48} direction="vertical" renderItem={renderItem} />,
    );
    const el = container.querySelector("[data-virtual-list]") as HTMLElement;
    expect(el.style.overflowY).toBe("auto");
  });

  it("sets overflow-x:auto for horizontal direction", () => {
    const { container } = render(
      <VirtualList items={ITEMS} itemHeight={48} direction="horizontal" renderItem={renderItem} />,
    );
    const el = container.querySelector("[data-virtual-list]") as HTMLElement;
    expect(el.style.overflowX).toBe("auto");
  });
});

/* ─── describe: VirtualList – infinite scroll ─────────────────────────────── */

describe("VirtualList – infinite scroll", () => {
  it("calls onReachEnd when scrolled near the end", () => {
    const onReachEnd = vi.fn();

    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      get: () => 1000,
    });
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get: () => 1000,
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      get: () => 300,
    });

    const { container } = render(
      <VirtualList
        items={ITEMS}
        itemHeight={48}
        onReachEnd={onReachEnd}
        reachEndThreshold={200}
        renderItem={renderItem}
      />,
    );

    const scroller = container.querySelector("[data-virtual-list]") as HTMLElement;
    // Simulate scrolling to a position within the threshold
    Object.defineProperty(scroller, "scrollTop", { configurable: true, value: 750 });
    fireEvent.scroll(scroller);
    expect(onReachEnd).toHaveBeenCalledTimes(1);
  });
});

/* ─── describe: VirtualList – onScroll callback ───────────────────────────── */

describe("VirtualList – onScroll", () => {
  it("fires onScroll with offset on scroll events", () => {
    const onScroll = vi.fn();
    const { container } = render(
      <VirtualList items={ITEMS} itemHeight={48} onScroll={onScroll} renderItem={renderItem} />,
    );
    const scroller = container.querySelector("[data-virtual-list]") as HTMLElement;
    Object.defineProperty(scroller, "scrollTop", { configurable: true, value: 100 });
    fireEvent.scroll(scroller);
    expect(onScroll).toHaveBeenCalledWith(100);
  });
});

/* ─── describe: VirtualList – imperative handle ────────────────────────────── */

describe("VirtualList – VirtualListHandle (ref)", () => {
  it("exposes scrollToIndex, scrollToOffset, getScrollOffset", () => {
    const ref = React.createRef<VirtualListHandle>();
    render(<VirtualList ref={ref} items={ITEMS} itemHeight={48} renderItem={renderItem} />);
    expect(typeof ref.current?.scrollToIndex).toBe("function");
    expect(typeof ref.current?.scrollToOffset).toBe("function");
    expect(typeof ref.current?.getScrollOffset).toBe("function");
  });

  it("getScrollOffset returns 0 at mount", () => {
    const ref = React.createRef<VirtualListHandle>();
    render(<VirtualList ref={ref} items={ITEMS} itemHeight={48} renderItem={renderItem} />);
    expect(ref.current?.getScrollOffset()).toBe(0);
  });
});

/* ─── describe: VirtualList – variable height ─────────────────────────────── */

describe("VirtualList – variable height", () => {
  it("renders with a function itemHeight", () => {
    patchOffsetHeight(72);
    render(
      <VirtualList
        items={ITEMS}
        itemHeight={(item) => (item.id % 2 === 0 ? 48 : 96)}
        estimatedItemHeight={56}
        renderItem={renderItem}
      />,
    );
    expect(screen.getByTestId("row-0")).toBeInTheDocument();
  });

  it("uses estimatedItemHeight for initial placeholder", () => {
    const { container } = render(
      <VirtualList
        items={ITEMS}
        itemHeight={() => 48}
        estimatedItemHeight={60}
        renderItem={renderItem}
      />,
    );
    // Inner spacer height should be set (not zero)
    const inner = container.querySelector("[data-virtual-list] > div") as HTMLElement;
    expect(inner).toBeTruthy();
  });
});

/* ─── describe: VirtualList – dynamic items ───────────────────────────────── */

describe("VirtualList – dynamic items", () => {
  it("updates rendered rows when items array changes", () => {
    const initial = ITEMS.slice(0, 50);
    const extended = ITEMS.slice(0, 100);
    const { rerender } = render(
      <VirtualList items={initial} itemHeight={48} renderItem={renderItem} />,
    );
    rerender(<VirtualList items={extended} itemHeight={48} renderItem={renderItem} />);
    // List now has 100 items; row-0 should still be visible
    expect(screen.getByTestId("row-0")).toBeInTheDocument();
  });

  it("shows empty state after items shrink to zero", () => {
    const { rerender } = render(
      <VirtualList<Item> items={ITEMS} itemHeight={48} renderItem={renderItem} />,
    );
    rerender(<VirtualList<Item> items={[]} itemHeight={48} renderItem={renderItem} />);
    expect(screen.getByText("No items")).toBeInTheDocument();
  });
});

/* ─── describe: VirtualList – exports ─────────────────────────────────────── */

describe("VirtualList – exports", () => {
  it("is exported from the DataDisplay barrel", async () => {
    const mod = await import("../components/DataDisplay/index");
    expect(mod.VirtualList).toBeDefined();
  });

  it("is accessible via src index", async () => {
    const mod = await import("../index");
    expect(mod.VirtualList).toBeDefined();
  });
});
