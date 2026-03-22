import { useState, useCallback } from "react";
import { SplitPanel } from "../../src";
import type { SplitPanelPane } from "../../src";
import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "./helpers";

// ─── Prop tables ───────────────────────────────────────────────────────────────

const splitPanelProps: PropRow[] = [
  {
    prop: "panes",
    type: "SplitPanelPane[]",
    required: true,
    description: "Ordered list of pane configurations including content and style.",
  },
  {
    prop: "direction",
    type: `"horizontal" | "vertical"`,
    default: `"horizontal"`,
    description: "Arrange panes side-by-side (horizontal) or top-to-bottom (vertical).",
  },
  {
    prop: "visibility",
    type: "Record<string, boolean>",
    default: "{}",
    description:
      "Controlled visibility map. Key = pane id, value = visible. Hidden panes are removed from layout; their space is given to adjacent neighbours.",
  },
  {
    prop: "onVisibilityChange",
    type: "(id: string, visible: boolean) => void",
    description: "Fires when the component requests a visibility toggle (future use).",
  },
  {
    prop: "width",
    type: "string | number",
    default: `"100%"`,
    description:
      'Container width. Numbers treated as px; strings passed as-is (e.g. "400px", "50vw").',
  },
  {
    prop: "height",
    type: "string | number",
    default: `"100%"`,
    description: "Container height. Numbers treated as px.",
  },
  {
    prop: "handleSize",
    type: "number",
    default: "4",
    description:
      "Visual thickness of the resize divider bar in px. Interactive hit area is always ≥ 8 px.",
  },
  {
    prop: "defaultBackground",
    type: "string",
    description: "CSS background color applied to every pane unless overridden per-pane.",
  },
  {
    prop: "autoSaveId",
    type: "string",
    description: "When set, pane sizes are persisted in localStorage and restored on re-mount.",
  },
  {
    prop: "onResizeEnd",
    type: "(sizes: Record<string, number>) => void",
    description:
      "Called after the user finishes a resize drag. Receives a snapshot of all pane sizes in pixels.",
  },
  {
    prop: "className",
    type: "string",
    description: "Additional CSS class names for the container element.",
  },
  {
    prop: "style",
    type: "React.CSSProperties",
    description: "Inline style overrides for the container element.",
  },
];

const splitPanelPaneProps: PropRow[] = [
  { prop: "id", type: "string", required: true, description: "Unique identifier for this pane." },
  {
    prop: "defaultSize",
    type: "number",
    description: "Initial size in pixels. Omit to share remaining space equally.",
  },
  {
    prop: "minSize",
    type: "number",
    default: "48",
    description: "Minimum size in px. The pane won't be draggable below this.",
  },
  {
    prop: "maxSize",
    type: "number",
    description: "Maximum size in px. The pane won't be draggable above this.",
  },
  {
    prop: "background",
    type: "string",
    description: "Per-pane CSS background color. Overrides the container-level defaultBackground.",
  },
  { prop: "className", type: "string", description: "Additional CSS class names for this pane." },
  {
    prop: "style",
    type: "React.CSSProperties",
    description: "Inline style overrides for this pane.",
  },
  { prop: "children", type: "React.ReactNode", description: "Pane content." },
];

// ─── Demo utilities ────────────────────────────────────────────────────────────

function PlaceholderContent({
  label,
  note,
  color,
}: {
  label: string;
  note?: string;
  color?: string;
}) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center"
      style={color ? { color } : undefined}
    >
      <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">{label}</span>
      {note && <span className="text-xs text-primary-400 dark:text-primary-500">{note}</span>}
    </div>
  );
}

// ─── Demo page ─────────────────────────────────────────────────────────────────

export default function SplitPanelPage() {
  // ── Controlled visibility demo state ────────────────────────────────────────
  const [visibility, setVisibility] = useState<Record<string, boolean>>({
    sidebar: true,
    editor: true,
    panel: true,
  });

  const togglePane = (id: string) =>
    setVisibility((prev) => ({ ...prev, [id]: prev[id] === false }));

  // ── Visibility demo state for the 3-pane demo ────────────────────────────────
  const [vis3, setVis3] = useState<Record<string, boolean>>({
    left: true,
    center: true,
    right: true,
  });

  const toggle3 = (id: string) => setVis3((prev) => ({ ...prev, [id]: prev[id] === false }));

  // ── Resize end callback demo ─────────────────────────────────────────────────
  const [lastSizes, setLastSizes] = useState<Record<string, number> | null>(null);

  // ── Dynamic add / remove demo ────────────────────────────────────────────────
  const PANE_COLORS = ["#f0f4ff", "#fff7ed", "#f0fdf4", "#fdf2f8", "#fefce8", "#f0fdfa"];
  const [dynPanes, setDynPanes] = useState<SplitPanelPane[]>([
    { id: "dyn-1", defaultSize: 200, minSize: 80, background: PANE_COLORS[0], children: null },
    { id: "dyn-2", defaultSize: 200, minSize: 80, background: PANE_COLORS[1], children: null },
  ]);
  const dynCounter = dynPanes.length;

  const addPane = useCallback(() => {
    const id = `dyn-${Date.now()}`;
    const color = PANE_COLORS[dynCounter % PANE_COLORS.length];
    setDynPanes((prev) => [
      ...prev,
      { id, defaultSize: 160, minSize: 80, background: color, children: null },
    ]);
  }, [dynCounter]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeLastPane = useCallback(() => {
    setDynPanes((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const removePane = useCallback((id: string) => {
    setDynPanes((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <div className="space-y-10 p-6">
      <PageTitle>SplitPanel</PageTitle>

      {/* ── Basic horizontal split ────────────────────────── */}
      <Section title="Basic Horizontal Split">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Two panes side-by-side. Drag the divider to resize. Hover the handle to see the visual
          indicator.
        </p>
        <div className="h-48 rounded-lg border border-primary-200 dark:border-primary-700 overflow-hidden">
          <SplitPanel
            direction="horizontal"
            panes={[
              {
                id: "left",
                defaultSize: 200,
                minSize: 80,
                children: (
                  <PlaceholderContent label="Left Pane" note="defaultSize: 200 · minSize: 80" />
                ),
              },
              {
                id: "right",
                minSize: 80,
                children: <PlaceholderContent label="Right Pane" note="fills remaining width" />,
              },
            ]}
          />
        </div>
        <CodeExample
          code={`<SplitPanel
  direction="horizontal"
  panes={[
    { id: "left",  defaultSize: 200, minSize: 80, children: <LeftContent /> },
    { id: "right", minSize: 80,                   children: <RightContent /> },
  ]}
/>`}
        />
      </Section>

      {/* ── Vertical split ───────────────────────────────── */}
      <Section title="Vertical Split">
        <div className="h-56 rounded-lg border border-primary-200 dark:border-primary-700 overflow-hidden">
          <SplitPanel
            direction="vertical"
            panes={[
              {
                id: "top",
                defaultSize: 120,
                minSize: 60,
                children: <PlaceholderContent label="Top Pane" note="defaultSize: 120" />,
              },
              {
                id: "bottom",
                minSize: 60,
                children: <PlaceholderContent label="Bottom Pane" note="fills remaining height" />,
              },
            ]}
          />
        </div>
        <CodeExample
          code={`<SplitPanel
  direction="vertical"
  panes={[
    { id: "top",    defaultSize: 120, minSize: 60, children: <TopContent /> },
    { id: "bottom", minSize: 60,                   children: <BottomContent /> },
  ]}
/>`}
        />
      </Section>

      {/* ── 3-pane VSCode-like layout ─────────────────────── */}
      <Section title="Three Panes — VSCode-style Layout">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Individually toggle each pane. Hidden panes donate their space to the nearest visible
          neighbour; re-showing a pane restores its previous size.
        </p>

        <div className="mb-3 flex flex-wrap gap-2">
          {(["left", "center", "right"] as const).map((id) => (
            <button
              key={id}
              onClick={() => toggle3(id)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                vis3[id] === false
                  ? "bg-primary-100 text-primary-500 dark:bg-primary-800 dark:text-primary-400"
                  : "bg-primary-600 text-white dark:bg-primary-500"
              }`}
            >
              {vis3[id] === false ? "Show" : "Hide"} {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>

        <div className="h-52 rounded-lg border border-primary-200 dark:border-primary-700 overflow-hidden">
          <SplitPanel
            direction="horizontal"
            visibility={vis3}
            panes={[
              {
                id: "left",
                defaultSize: 180,
                minSize: 80,
                maxSize: 320,
                background: "var(--color-primary-50)",
                children: <PlaceholderContent label="Explorer" note="maxSize: 320" />,
              },
              {
                id: "center",
                minSize: 120,
                children: <PlaceholderContent label="Editor" note="minSize: 120" />,
              },
              {
                id: "right",
                defaultSize: 200,
                minSize: 80,
                maxSize: 400,
                background: "var(--color-primary-50)",
                children: <PlaceholderContent label="Inspector" note="maxSize: 400" />,
              },
            ]}
          />
        </div>
        <CodeExample
          code={`const [visibility, setVisibility] = useState({ left: true, center: true, right: true });

<SplitPanel
  direction="horizontal"
  visibility={visibility}
  panes={[
    {
      id: "left",
      defaultSize: 180,
      minSize: 80,
      maxSize: 320,
      background: "var(--color-primary-50)",
      children: <Explorer />,
    },
    { id: "center", minSize: 120, children: <Editor /> },
    {
      id: "right",
      defaultSize: 200,
      minSize: 80,
      maxSize: 400,
      background: "var(--color-primary-50)",
      children: <Inspector />,
    },
  ]}
/>`}
        />
      </Section>

      {/* ── Controlled visibility ─────────────────────────── */}
      <Section title="Controlled Show / Hide">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Full externally-controlled visibility. The panel redistributes space on every toggle.
        </p>

        <div className="mb-3 flex flex-wrap gap-2">
          {(["sidebar", "editor", "panel"] as const).map((id) => (
            <button
              key={id}
              onClick={() => togglePane(id)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                visibility[id] === false
                  ? "bg-danger-100 text-danger-600 dark:bg-danger-900/40 dark:text-danger-400"
                  : "bg-success-500 text-white dark:bg-success-600"
              }`}
            >
              {visibility[id] === false ? "▶ Show" : "■ Hide"} {id}
            </button>
          ))}
        </div>

        <div className="h-48 rounded-lg border border-primary-200 dark:border-primary-700 overflow-hidden">
          <SplitPanel
            direction="horizontal"
            visibility={visibility}
            panes={[
              {
                id: "sidebar",
                defaultSize: 160,
                minSize: 80,
                children: <PlaceholderContent label="Sidebar" />,
              },
              {
                id: "editor",
                minSize: 100,
                children: <PlaceholderContent label="Editor" />,
              },
              {
                id: "panel",
                defaultSize: 180,
                minSize: 80,
                children: <PlaceholderContent label="Panel" />,
              },
            ]}
          />
        </div>
        <CodeExample
          code={`const [visibility, setVisibility] = useState({ sidebar: true, editor: true, panel: true });

// Toggle externally:
setVisibility(prev => ({ ...prev, sidebar: !prev.sidebar }));

<SplitPanel
  direction="horizontal"
  visibility={visibility}
  panes={[
    { id: "sidebar", defaultSize: 160, minSize: 80, children: <Sidebar /> },
    { id: "editor",  minSize: 100,                  children: <Editor /> },
    { id: "panel",   defaultSize: 180, minSize: 80,  children: <Panel /> },
  ]}
/>`}
        />
      </Section>

      {/* ── Per-pane backgrounds ─────────────────────────── */}
      <Section title="Per-pane Background & defaultBackground">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Set a container-level <code>defaultBackground</code> and override individual panes via the{" "}
          <code>background</code> pane field.
        </p>
        <div className="h-36 rounded-lg border border-primary-200 dark:border-primary-700 overflow-hidden">
          <SplitPanel
            direction="horizontal"
            defaultBackground="white"
            panes={[
              {
                id: "a",
                defaultSize: 160,
                minSize: 60,
                background: "#f0f4ff",
                children: <PlaceholderContent label="Custom BG" note="#f0f4ff" />,
              },
              {
                id: "b",
                minSize: 60,
                children: <PlaceholderContent label="Default BG" note="inherits white" />,
              },
              {
                id: "c",
                defaultSize: 140,
                minSize: 60,
                background: "#fff7ed",
                children: <PlaceholderContent label="Custom BG" note="#fff7ed" />,
              },
            ]}
          />
        </div>
        <CodeExample
          code={`<SplitPanel
  direction="horizontal"
  defaultBackground="white"
  panes={[
    { id: "a", defaultSize: 160, background: "#f0f4ff", children: <A /> },
    { id: "b",                                          children: <B /> },
    { id: "c", defaultSize: 140, background: "#fff7ed", children: <C /> },
  ]}
/>`}
        />
      </Section>

      {/* ── Custom dimensions ────────────────────────────── */}
      <Section title="Custom Container Dimensions">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Control the container size via <code>width</code> and <code>height</code>.
        </p>
        <div className="flex items-start">
          <SplitPanel
            direction="horizontal"
            width={480}
            height={120}
            panes={[
              {
                id: "x",
                defaultSize: 160,
                minSize: 60,
                children: <PlaceholderContent label="Fixed 480×120" />,
              },
              { id: "y", minSize: 60, children: <PlaceholderContent label="Right" /> },
            ]}
            className="rounded-lg border border-primary-200 dark:border-primary-700"
          />
        </div>
        <CodeExample
          code={`<SplitPanel
  direction="horizontal"
  width={480}
  height={120}
  panes={[
    { id: "x", defaultSize: 160, minSize: 60, children: <Left /> },
    { id: "y", minSize: 60,                   children: <Right /> },
  ]}
/>`}
        />
      </Section>

      {/* ── localStorage persistence ─────────────────────── */}
      <Section title="localStorage Persistence (autoSaveId)">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Resize the panes below, then reload — sizes are restored automatically.
        </p>
        <div className="h-40 rounded-lg border border-primary-200 dark:border-primary-700 overflow-hidden">
          <SplitPanel
            direction="horizontal"
            autoSaveId="demo-persist"
            onResizeEnd={(sizes) => setLastSizes(sizes)}
            panes={[
              {
                id: "p1",
                defaultSize: 200,
                minSize: 60,
                children: <PlaceholderContent label="Pane A" note="sizes persist" />,
              },
              {
                id: "p2",
                minSize: 60,
                children: <PlaceholderContent label="Pane B" note="sizes persist" />,
              },
            ]}
          />
        </div>
        {lastSizes && (
          <p className="mt-2 text-xs text-primary-500 dark:text-primary-400">
            Last resize:{" "}
            {Object.entries(lastSizes)
              .map(([k, v]) => `${k}: ${Math.round(v)}px`)
              .join(" · ")}
          </p>
        )}
        <CodeExample
          code={`<SplitPanel
  direction="horizontal"
  autoSaveId="my-layout"
  onResizeEnd={(sizes) => console.log(sizes)}
  panes={[
    { id: "p1", defaultSize: 200, minSize: 60, children: <PaneA /> },
    { id: "p2", minSize: 60,                   children: <PaneB /> },
  ]}
/>`}
        />
      </Section>

      {/* ── Custom handle size ───────────────────────────── */}
      <Section title="Custom Handle Size">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Choose a thicker handle for more prominent dividers.
        </p>
        <div className="h-32 rounded-lg border border-primary-200 dark:border-primary-700 overflow-hidden">
          <SplitPanel
            direction="horizontal"
            handleSize={8}
            panes={[
              {
                id: "h1",
                defaultSize: 200,
                minSize: 60,
                children: <PlaceholderContent label="handleSize: 8" />,
              },
              { id: "h2", minSize: 60, children: <PlaceholderContent label="Pane B" /> },
              { id: "h3", minSize: 60, children: <PlaceholderContent label="Pane C" /> },
            ]}
          />
        </div>
        <CodeExample
          code={`<SplitPanel
  direction="horizontal"
  handleSize={8}
  panes={[...]}
/>`}
        />
      </Section>

      {/* ── Nested SplitPanel ────────────────────────────── */}
      <Section title="Nested SplitPanel">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Place a <code>&lt;SplitPanel&gt;</code> as the <code>children</code> of a pane to create
          complex multi-axis layouts — here a horizontal three-pane layout where the middle pane is
          further split vertically into top and bottom halves.
        </p>
        <div className="h-64 overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700">
          <SplitPanel
            direction="horizontal"
            panes={[
              {
                id: "left",
                defaultSize: 180,
                minSize: 80,
                background: "var(--color-primary-50)",
                children: <PlaceholderContent label="Left" />,
              },
              {
                id: "center",
                minSize: 100,
                children: (
                  /* inner vertical split — must fill 100% of the pane */
                  <SplitPanel
                    direction="vertical"
                    height="100%"
                    panes={[
                      {
                        id: "center-top",
                        minSize: 48,
                        background: "var(--color-success-50)",
                        children: <PlaceholderContent label="Center · Top" />,
                      },
                      {
                        id: "center-bottom",
                        minSize: 48,
                        background: "var(--color-warning-50)",
                        children: <PlaceholderContent label="Center · Bottom" />,
                      },
                    ]}
                  />
                ),
              },
              {
                id: "right",
                defaultSize: 180,
                minSize: 80,
                background: "var(--color-secondary-50)",
                children: <PlaceholderContent label="Right" />,
              },
            ]}
          />
        </div>
        <CodeExample
          code={`<SplitPanel
  direction="horizontal"
  panes={[
    { id: "left",   defaultSize: 180, minSize: 80, children: <LeftPanel /> },
    {
      id: "center",
      minSize: 100,
      // Nest a vertical SplitPanel inside
      children: (
        <SplitPanel
          direction="vertical"
          height="100%"
          panes={[
            { id: "center-top",    minSize: 48, children: <TopPanel /> },
            { id: "center-bottom", minSize: 48, children: <BottomPanel /> },
          ]}
        />
      ),
    },
    { id: "right",  defaultSize: 180, minSize: 80, children: <RightPanel /> },
  ]}
/>`}
        />
      </Section>

      {/* ── Dynamic add / remove panes ───────────────────── */}
      <Section title="Dynamic Add / Remove Panes">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Pass a different <code>panes</code> array each render. The component detects newly-added
          ids and borrows space from the largest neighbour; removed ids donate their space back
          automatically.
        </p>

        {/* Controls */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            onClick={addPane}
            className="rounded bg-primary-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400"
          >
            + Add Pane
          </button>
          <button
            onClick={removeLastPane}
            disabled={dynPanes.length <= 1}
            className="rounded bg-danger-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-danger-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            − Remove Last
          </button>
          <span className="text-xs text-primary-400 dark:text-primary-500">
            {dynPanes.length} pane{dynPanes.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="h-52 overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700">
          <SplitPanel
            direction="horizontal"
            panes={dynPanes.map((p) => ({
              ...p,
              children: (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-3">
                  <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                    {p.id}
                  </span>
                  <button
                    onClick={() => removePane(p.id)}
                    disabled={dynPanes.length <= 1}
                    className="rounded bg-white/70 px-2 py-0.5 text-xs text-danger-500 shadow hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Remove
                  </button>
                </div>
              ),
            }))}
          />
        </div>
        <CodeExample
          code={`import { useState } from "react";
import { SplitPanel } from "@jacshuo/onyx";
import type { SplitPanelPane } from "@jacshuo/onyx";

export function DynamicDemo() {
  const [panes, setPanes] = useState<SplitPanelPane[]>([
    { id: "pane-1", defaultSize: 200, minSize: 80, children: <PaneA /> },
    { id: "pane-2", defaultSize: 200, minSize: 80, children: <PaneB /> },
  ]);

  const addPane = () => {
    const id = \`pane-\${Date.now()}\`;
    setPanes((prev) => [...prev, { id, defaultSize: 160, minSize: 80, children: <NewPane /> }]);
  };

  const removePane = (id: string) => {
    setPanes((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <button onClick={addPane}>Add Pane</button>
      <SplitPanel direction="horizontal" panes={panes} />
    </>
  );
}`}
        />
      </Section>

      {/* ── Prop tables ──────────────────────────────────── */}
      <Section title="SplitPanel Props">
        <PropTable rows={splitPanelProps} title="SplitPanel" />
      </Section>

      <Section title="SplitPanelPane Props">
        <PropTable rows={splitPanelPaneProps} title="SplitPanelPane" />
      </Section>
    </div>
  );
}
