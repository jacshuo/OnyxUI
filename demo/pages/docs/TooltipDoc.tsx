import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const tooltipProps: PropRow[] = [
  { prop: "content", type: "React.ReactNode", required: true, description: "Tooltip content" },
  {
    prop: "position",
    type: `"top" | "bottom" | "left" | "right"`,
    default: `"top"`,
    description: "Tooltip placement relative to the trigger",
  },
  { prop: "delay", type: "number", default: "200", description: "Open delay in milliseconds" },
  {
    prop: "intent",
    type: `"default" | "primary" | "danger"`,
    default: `"default"`,
    description: "Color intent",
  },
  { prop: "maxWidth", type: "string | number", description: "Maximum tooltip width" },
];

const usageCode = `import { Tooltip, Button } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex gap-4">
      <Tooltip content="Save your work" position="top">
        <Button size="sm">Save</Button>
      </Tooltip>
      <Tooltip content="Danger zone!" intent="danger" position="bottom">
        <Button size="sm" intent="danger">Delete</Button>
      </Tooltip>
    </div>
  );
}`;

export default function TooltipDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Tooltip</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Tooltip } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={tooltipProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
