import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const badgeProps: PropRow[] = [
  {
    prop: "intent",
    type: `"primary" | "secondary" | "success" | "danger" | "warning" | "info"`,
    default: `"primary"`,
    description: "Color intent",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Badge size" },
  {
    prop: "...rest",
    type: "HTMLAttributes<HTMLSpanElement>",
    description: "All native span attributes",
  },
];

const usageCode = `import { Badge } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Badge intent="primary">New</Badge>
      <Badge intent="success">Active</Badge>
      <Badge intent="danger" size="sm">Error</Badge>
      <Badge intent="warning">Warning</Badge>
    </div>
  );
}`;

export default function BadgeDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Badge</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Badge } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={badgeProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
