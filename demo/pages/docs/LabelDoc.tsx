import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const labelProps: PropRow[] = [
  {
    prop: "intent",
    type: `"default" | "primary" | "danger"`,
    default: `"default"`,
    description: "Color intent",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Label size" },
  {
    prop: "...rest",
    type: "LabelHTMLAttributes<HTMLLabelElement>",
    description: "All native label attributes including htmlFor",
  },
];

const usageCode = `import { Label, Input } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="email" intent="primary">Email address</Label>
      <Input id="email" placeholder="you@example.com" />
    </div>
  );
}`;

export default function LabelDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Label</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Label } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={labelProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
