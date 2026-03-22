import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SplitPanel } from "../components/Layout/SplitPanel";
import type { SplitPanelPane } from "../components/Layout/SplitPanel";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const basicPanes: SplitPanelPane[] = [
  { id: "left", defaultSize: 200, minSize: 60, children: <div>Left</div> },
  { id: "right", defaultSize: 300, minSize: 60, children: <div>Right</div> },
];

const threePanes: SplitPanelPane[] = [
  { id: "a", defaultSize: 150, children: <div>Pane A</div> },
  { id: "b", defaultSize: 250, children: <div>Pane B</div> },
  { id: "c", defaultSize: 150, children: <div>Pane C</div> },
];

// ─── Render ────────────────────────────────────────────────────────────────────

describe("SplitPanel — render", () => {
  it("renders all visible panes", () => {
    render(<SplitPanel panes={basicPanes} />);
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("renders a flex container", () => {
    const { container } = render(<SplitPanel panes={basicPanes} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("data-split-panel");
  });

  it("sets direction=horizontal by default", () => {
    const { container } = render(<SplitPanel panes={basicPanes} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("data-direction", "horizontal");
  });

  it("sets direction=vertical when specified", () => {
    const { container } = render(<SplitPanel panes={basicPanes} direction="vertical" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("data-direction", "vertical");
  });

  it("renders resize handle(s) between panes", () => {
    render(<SplitPanel panes={basicPanes} />);
    // Handles have role="separator"
    const handles = screen.getAllByRole("separator");
    // 2 panes → 1 handle
    expect(handles).toHaveLength(1);
  });

  it("renders N-1 handles for N visible panes", () => {
    render(<SplitPanel panes={threePanes} />);
    const handles = screen.getAllByRole("separator");
    expect(handles).toHaveLength(2);
  });

  it("merges custom className on container", () => {
    const { container } = render(<SplitPanel panes={basicPanes} className="my-split" />);
    expect(container.firstChild).toHaveClass("my-split");
  });

  it("applies custom style to container", () => {
    const { container } = render(<SplitPanel panes={basicPanes} style={{ borderRadius: "8px" }} />);
    expect((container.firstChild as HTMLElement).style.borderRadius).toBe("8px");
  });

  it("applies width/height as px when number is provided", () => {
    const { container } = render(<SplitPanel panes={basicPanes} width={600} height={400} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("600px");
    expect(el.style.height).toBe("400px");
  });

  it("applies width/height when string is provided", () => {
    const { container } = render(<SplitPanel panes={basicPanes} width="50vw" height="80vh" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("50vw");
    expect(el.style.height).toBe("80vh");
  });
});

// ─── Visibility ────────────────────────────────────────────────────────────────

describe("SplitPanel — visibility", () => {
  it("hides a pane when visibility[id] = false", () => {
    render(<SplitPanel panes={threePanes} visibility={{ a: false }} />);
    expect(screen.queryByText("Pane A")).not.toBeInTheDocument();
    expect(screen.getByText("Pane B")).toBeInTheDocument();
    expect(screen.getByText("Pane C")).toBeInTheDocument();
  });

  it("renders N-1-hidden-1 handles when one pane is hidden", () => {
    render(<SplitPanel panes={threePanes} visibility={{ a: false }} />);
    // 2 visible panes → 1 handle
    const handles = screen.getAllByRole("separator");
    expect(handles).toHaveLength(1);
  });

  it("renders no handle when only one pane is visible", () => {
    render(<SplitPanel panes={basicPanes} visibility={{ right: false }} />);
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });

  it("renders nothing when all panes are hidden", () => {
    render(<SplitPanel panes={basicPanes} visibility={{ left: false, right: false }} />);
    expect(screen.queryByText("Left")).not.toBeInTheDocument();
    expect(screen.queryByText("Right")).not.toBeInTheDocument();
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });
});

// ─── Pane data attributes ──────────────────────────────────────────────────────

describe("SplitPanel — pane data attributes", () => {
  it("assigns data-split-pane-id to each pane wrapper", () => {
    const { container } = render(<SplitPanel panes={basicPanes} />);
    expect(container.querySelector('[data-split-pane-id="left"]')).toBeInTheDocument();
    expect(container.querySelector('[data-split-pane-id="right"]')).toBeInTheDocument();
  });
});

// ─── Handle ARIA ──────────────────────────────────────────────────────────────

describe("SplitPanel — handle accessibility", () => {
  it("handles have aria-label describing adjacent panes", () => {
    render(<SplitPanel panes={basicPanes} />);
    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("aria-label", "Resize handle between left and right");
  });

  it("horizontal handles have aria-orientation=vertical", () => {
    render(<SplitPanel panes={basicPanes} direction="horizontal" />);
    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("aria-orientation", "vertical");
  });

  it("vertical handles have aria-orientation=horizontal", () => {
    render(<SplitPanel panes={basicPanes} direction="vertical" />);
    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("handles are focusable", () => {
    render(<SplitPanel panes={basicPanes} />);
    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("tabindex", "0");
  });
});

// ─── Per-pane background ──────────────────────────────────────────────────────

describe("SplitPanel — pane background", () => {
  it("applies per-pane background style", () => {
    const panes: SplitPanelPane[] = [
      { id: "left", defaultSize: 200, background: "red", children: <div>L</div> },
      { id: "right", children: <div>R</div> },
    ];
    const { container } = render(<SplitPanel panes={panes} />);
    const leftPane = container.querySelector('[data-split-pane-id="left"]') as HTMLElement;
    expect(leftPane.style.background).toBe("red");
  });

  it("applies defaultBackground to panes without explicit background", () => {
    const panes: SplitPanelPane[] = [
      { id: "left", defaultSize: 200, children: <div>L</div> },
      { id: "right", children: <div>R</div> },
    ];
    const { container } = render(<SplitPanel panes={panes} defaultBackground="blue" />);
    const leftPane = container.querySelector('[data-split-pane-id="left"]') as HTMLElement;
    expect(leftPane.style.background).toBe("blue");
  });

  it("per-pane background overrides defaultBackground", () => {
    const panes: SplitPanelPane[] = [
      { id: "left", defaultSize: 200, background: "green", children: <div>L</div> },
      { id: "right", children: <div>R</div> },
    ];
    const { container } = render(<SplitPanel panes={panes} defaultBackground="blue" />);
    const leftPane = container.querySelector('[data-split-pane-id="left"]') as HTMLElement;
    expect(leftPane.style.background).toBe("green");
  });
});

// ─── onResizeEnd callback ─────────────────────────────────────────────────────

describe("SplitPanel — onResizeEnd", () => {
  it("calls onResizeEnd after pointer up on handle", () => {
    const onResizeEnd = vi.fn();
    render(<SplitPanel panes={basicPanes} onResizeEnd={onResizeEnd} />);
    const handle = screen.getByRole("separator");

    // jsdom does not implement setPointerCapture; stub it to avoid unhandled errors
    handle.setPointerCapture = vi.fn();

    fireEvent.pointerDown(handle, { clientX: 200, clientY: 0 });
    fireEvent.pointerMove(handle, { clientX: 220, clientY: 0 });
    fireEvent.pointerUp(handle, { clientX: 220, clientY: 0 });

    expect(onResizeEnd).toHaveBeenCalledTimes(1);
    expect(onResizeEnd).toHaveBeenCalledWith(
      expect.objectContaining({ left: expect.any(Number), right: expect.any(Number) }),
    );
  });
});

// ─── Exports ──────────────────────────────────────────────────────────────────

describe("SplitPanel — exports", () => {
  it("is exported from the library barrel src/index.ts", async () => {
    const mod = await import("../index");
    expect(mod.SplitPanel).toBeDefined();
    expect(typeof mod.SplitPanel).toBe("function");
  });
});

// ─── Dynamic add / remove ──────────────────────────────────────────────────────

describe("SplitPanel — dynamic panes", () => {
  it("renders a newly added pane after rerender", () => {
    const { rerender } = render(<SplitPanel panes={basicPanes} />);
    expect(screen.queryByText("Extra")).not.toBeInTheDocument();

    const newPanes = [
      ...basicPanes,
      { id: "extra", defaultSize: 100, minSize: 60, children: <div>Extra</div> },
    ];
    rerender(<SplitPanel panes={newPanes} />);

    expect(screen.getByText("Extra")).toBeInTheDocument();
    // 3 panes → 2 handles
    expect(screen.getAllByRole("separator")).toHaveLength(2);
  });

  it("removes a pane and its handle after rerender", () => {
    const { rerender } = render(<SplitPanel panes={threePanes} />);
    expect(screen.getByText("Pane A")).toBeInTheDocument();
    // 3 panes → 2 handles
    expect(screen.getAllByRole("separator")).toHaveLength(2);

    const reduced = threePanes.filter((p) => p.id !== "a");
    rerender(<SplitPanel panes={reduced} />);

    expect(screen.queryByText("Pane A")).not.toBeInTheDocument();
    // 2 panes → 1 handle
    expect(screen.getAllByRole("separator")).toHaveLength(1);
  });

  it("keeps remaining panes visible after removing one", () => {
    const { rerender } = render(<SplitPanel panes={threePanes} />);

    const reduced = threePanes.filter((p) => p.id !== "b");
    rerender(<SplitPanel panes={reduced} />);

    expect(screen.getByText("Pane A")).toBeInTheDocument();
    expect(screen.queryByText("Pane B")).not.toBeInTheDocument();
    expect(screen.getByText("Pane C")).toBeInTheDocument();
  });

  it("renders correctly when all panes are replaced", () => {
    const { rerender } = render(<SplitPanel panes={basicPanes} />);

    const freshPanes: SplitPanelPane[] = [
      { id: "x", defaultSize: 200, children: <div>X</div> },
      { id: "y", defaultSize: 200, children: <div>Y</div> },
      { id: "z", defaultSize: 200, children: <div>Z</div> },
    ];
    rerender(<SplitPanel panes={freshPanes} />);

    expect(screen.queryByText("Left")).not.toBeInTheDocument();
    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("Y")).toBeInTheDocument();
    expect(screen.getByText("Z")).toBeInTheDocument();
    expect(screen.getAllByRole("separator")).toHaveLength(2);
  });
});
