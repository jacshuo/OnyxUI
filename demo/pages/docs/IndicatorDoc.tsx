import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const indicatorProps: PropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    required: true,
    description: "The element to attach the indicator to",
  },
  {
    prop: "show",
    type: "boolean",
    default: "true",
    description: "Whether the indicator dot is visible",
  },
  {
    prop: "content",
    type: "React.ReactNode",
    description: "Content inside the indicator (e.g. count number)",
  },
  {
    prop: "pulse",
    type: "boolean",
    default: "false",
    description: "Animate the indicator with a pulse effect",
  },
  {
    prop: "intent",
    type: `"primary" | "success" | "danger" | "warning"`,
    default: `"primary"`,
    description: "Indicator color",
  },
  {
    prop: "placement",
    type: `"top-right" | "top-left" | "bottom-right" | "bottom-left"`,
    default: `"top-right"`,
    description: "Dot position relative to the child",
  },
  { prop: "className", type: "string", description: "Extra CSS classes on the wrapper" },
];

const usageCode = `import { Indicator, Button } from "@jacshuo/onyx";

export function Example() {
  return (
    <Indicator content={3} intent="danger" pulse>
      <Button>Inbox</Button>
    </Indicator>
  );
}`;

export default function IndicatorDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Indicator</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Indicator, type IndicatorProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={indicatorProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
