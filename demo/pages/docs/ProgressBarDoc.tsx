import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const progressBarProps: PropRow[] = [
  { prop: "value", type: "number", default: "0", description: "Progress value 0–100" },
  { prop: "showLabel", type: "boolean", default: "false", description: "Show percentage label" },
  {
    prop: "indeterminate",
    type: "boolean",
    default: "false",
    description: "Indeterminate animation (unknown progress)",
  },
  {
    prop: "animated",
    type: "boolean",
    default: "false",
    description: "Shimmer animation on the bar",
  },
  { prop: "duration", type: "number", description: "Animation duration in milliseconds" },
  {
    prop: "intent",
    type: `"primary" | "success" | "danger" | "warning"`,
    default: `"primary"`,
    description: "Bar color",
  },
  { prop: "size", type: `"xs" | "sm" | "md" | "lg"`, default: `"md"`, description: "Bar height" },
  { prop: "edge", type: `"top" | "bottom"`, description: "Fix bar to top or bottom of viewport" },
];

const usageCode = `import { ProgressBar } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <ProgressBar value={65} showLabel intent="primary" />
      <ProgressBar value={30} intent="success" size="sm" />
      <ProgressBar indeterminate intent="warning" size="xs" />
    </div>
  );
}`;

export default function ProgressBarDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>ProgressBar</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { ProgressBar, type ProgressBarProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={progressBarProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
