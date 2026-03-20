import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const buttonProps: PropRow[] = [
  {
    prop: "intent",
    type: `"primary" | "secondary" | "danger" | "ghost" | "link"`,
    default: `"primary"`,
    description: "Visual intent / color variant",
  },
  { prop: "size", type: `"xs" | "sm" | "md" | "lg"`, default: `"md"`, description: "Button size" },
  { prop: "className", type: "string", description: "Extra CSS classes" },
  {
    prop: "...rest",
    type: "ButtonHTMLAttributes<HTMLButtonElement>",
    description: "All native button attributes",
  },
];

const usageCode = `import { Button } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button intent="primary">Primary</Button>
      <Button intent="secondary">Secondary</Button>
      <Button intent="danger" size="sm">Delete</Button>
      <Button intent="ghost">Ghost</Button>
      <Button intent="link">Link</Button>
    </div>
  );
}`;

export default function ButtonDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Button</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Button } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={buttonProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
