import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const inputProps: PropRow[] = [
  {
    prop: "state",
    type: `"default" | "error"`,
    default: `"default"`,
    description: "Validation state — error shows red border",
  },
  {
    prop: "inputSize",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Input height size",
  },
  {
    prop: "prefix",
    type: "React.ReactNode",
    description: "Leading adornment (icon or text) inside the input",
  },
  {
    prop: "suffix",
    type: "React.ReactNode",
    description: "Trailing adornment (icon or text) inside the input",
  },
  {
    prop: "action",
    type: '{ icon: React.ReactNode; onClick: () => void; "aria-label"?: string }',
    description: "Action button rendered at the end of the input",
  },
  {
    prop: "...rest",
    type: "InputHTMLAttributes<HTMLInputElement>",
    description: "All native input attributes (omits size and prefix)",
  },
];

const usageCode = `import { Input } from "@jacshuo/onyx";
import { Search } from "lucide-react";

export function Example() {
  return (
    <div className="flex flex-col gap-3 max-w-sm">
      <Input placeholder="Default input" />
      <Input
        placeholder="Search…"
        prefix={<Search size={16} />}
        inputSize="sm"
      />
      <Input
        state="error"
        defaultValue="bad value"
        placeholder="Error state"
      />
    </div>
  );
}`;

export default function InputDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Input</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Input } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={inputProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
