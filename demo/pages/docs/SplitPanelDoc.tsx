import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

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
    description: 'Arrange panes side-by-side ("horizontal") or top-to-bottom ("vertical").',
  },
  {
    prop: "visibility",
    type: "Record<string, boolean>",
    default: "{}",
    description:
      "Controlled visibility map. Key = pane id, value = visible. Set false to remove a pane from layout and redistribute its space.",
  },
  {
    prop: "onVisibilityChange",
    type: "(id: string, visible: boolean) => void",
    description: "Reserved callback for future programmatic visibility toggle APIs.",
  },
  {
    prop: "width",
    type: "string | number",
    default: `"100%"`,
    description: 'Container width. Numbers treated as px; strings passed as-is (e.g. "50vw").',
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
      "Visual thickness of the resize divider bar in px. The interactive hit-area is always ≥ 8 px regardless of this value.",
  },
  {
    prop: "defaultBackground",
    type: "string",
    description: "CSS background color applied to all panes unless overridden per pane.",
  },
  {
    prop: "autoSaveId",
    type: "string",
    description:
      'Persist pane sizes in localStorage under key "onyx-split:<autoSaveId>" and restore on re-mount.',
  },
  {
    prop: "onResizeEnd",
    type: "(sizes: Record<string, number>) => void",
    description: "Called after the user finishes a resize drag. Receives all pane sizes in pixels.",
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

const paneProps: PropRow[] = [
  { prop: "id", type: "string", required: true, description: "Unique identifier for this pane." },
  {
    prop: "defaultSize",
    type: "number",
    description:
      "Initial size in pixels. Panes without a defaultSize share remaining space equally.",
  },
  {
    prop: "minSize",
    type: "number",
    default: "48",
    description: "Minimum size in px. The user cannot drag this pane below this size.",
  },
  {
    prop: "maxSize",
    type: "number",
    description: "Maximum size in px. The user cannot drag this pane above this size.",
  },
  {
    prop: "background",
    type: "string",
    description: "Per-pane CSS background color. Overrides the container-level defaultBackground.",
  },
  {
    prop: "className",
    type: "string",
    description: "Additional CSS class names for this pane's wrapper.",
  },
  {
    prop: "style",
    type: "React.CSSProperties",
    description: "Inline style overrides for this pane's wrapper.",
  },
  { prop: "children", type: "React.ReactNode", description: "Pane content." },
];

const importCode = `import { SplitPanel } from "@jacshuo/onyx";
import type { SplitPanelPane, SplitPanelProps } from "@jacshuo/onyx";`;

const usageCode = `import { useState } from "react";
import { SplitPanel } from "@jacshuo/onyx";

export function VSCodeLayout() {
  const [visibility, setVisibility] = useState({ sidebar: true, editor: true, panel: true });

  return (
    <SplitPanel
      direction="horizontal"
      visibility={visibility}
      autoSaveId="my-app-layout"
      panes={[
        {
          id: "sidebar",
          defaultSize: 220,
          minSize: 100,
          maxSize: 400,
          background: "var(--surface-2)",
          children: <Sidebar />,
        },
        {
          id: "editor",
          minSize: 200,
          children: <Editor />,
        },
        {
          id: "panel",
          defaultSize: 280,
          minSize: 100,
          maxSize: 480,
          background: "var(--surface-2)",
          children: <OutlinePanel />,
        },
      ]}
    />
  );
}`;

const typeRefCode = `/**
 * Configuration for a single resizable pane.
 */
export interface SplitPanelPane {
  id: string;
  defaultSize?: number;   // px — initial pane size
  minSize?: number;       // px — default: 48
  maxSize?: number;       // px — default: unlimited
  background?: string;   // CSS color
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * SplitPanel component props.
 */
export interface SplitPanelProps {
  direction?: "horizontal" | "vertical";  // default: "horizontal"
  panes: SplitPanelPane[];
  visibility?: Record<string, boolean>;   // omit or true = visible
  onVisibilityChange?: (id: string, visible: boolean) => void;
  width?: string | number;                // default: "100%"
  height?: string | number;               // default: "100%"
  handleSize?: number;                    // px, default: 4
  defaultBackground?: string;
  autoSaveId?: string;
  onResizeEnd?: (sizes: Record<string, number>) => void;
  className?: string;
  style?: React.CSSProperties;
}`;

export default function SplitPanelDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>SplitPanel</PageTitle>

      <Section title="Import">
        <CodeExample code={importCode} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="SplitPanel Props">
        <PropTable rows={splitPanelProps} title="SplitPanel" />
      </Section>

      <Section title="SplitPanelPane Props">
        <PropTable rows={paneProps} title="SplitPanelPane" />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typeRefCode} />
      </Section>

      <Section title="Behaviour Notes">
        <ul className="list-inside list-disc space-y-1.5 text-sm text-primary-700 dark:text-primary-300">
          <li>
            The component fills its parent container by default (<code>width=&quot;100%&quot;</code>
            , <code>height=&quot;100%&quot;</code>). Wrap in a sized container when needed.
          </li>
          <li>
            Resize handles support both <strong>mouse drag</strong> and{" "}
            <strong>arrow-key nudge</strong> (10 px / step) for accessibility.
          </li>
          <li>
            When a pane is hidden via <code>visibility</code>, its size is donated to the nearest
            visible neighbour and restored when the pane becomes visible again.
          </li>
          <li>
            <code>autoSaveId</code> persists sizes in <code>localStorage</code>; the component
            gracefully ignores missing or corrupt data.
          </li>
          <li>
            Designed for <strong>desktop applications only</strong> — no mobile layout
            considerations are applied.
          </li>
        </ul>
      </Section>
    </div>
  );
}
