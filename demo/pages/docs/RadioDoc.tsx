import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const radioGroupProps: PropRow[] = [
  { prop: "name", type: "string", description: "HTML name for the radio group" },
  { prop: "value", type: "string", description: "Controlled selected value" },
  { prop: "defaultValue", type: "string", description: "Uncontrolled initial value" },
  { prop: "onValueChange", type: "(value: string) => void", description: "Change callback" },
  {
    prop: "intent",
    type: `"primary" | "success" | "danger" | "warning"`,
    default: `"primary"`,
    description: "Color intent for all radios",
  },
  {
    prop: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Size for all radio buttons",
  },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable entire group" },
  {
    prop: "orientation",
    type: `"vertical" | "horizontal"`,
    default: `"vertical"`,
    description: "Layout direction",
  },
];

const radioItemProps: PropRow[] = [
  {
    prop: "value",
    type: "string",
    required: true,
    description: "The radio value (matched against RadioGroup value)",
  },
  { prop: "label", type: "string", description: "Label text displayed next to the radio" },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable this individual radio",
  },
];

const usageCode = `import { RadioGroup, Radio } from "@jacshuo/onyx";
import { useState } from "react";

export function Example() {
  const [value, setValue] = useState("typescript");

  return (
    <RadioGroup value={value} onValueChange={setValue} orientation="vertical">
      <Radio value="typescript" label="TypeScript" />
      <Radio value="javascript" label="JavaScript" />
      <Radio value="rust" label="Rust" disabled />
    </RadioGroup>
  );
}`;

export default function RadioDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Radio / RadioGroup</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Radio, RadioGroup, type RadioProps, type RadioGroupProps } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="RadioGroup Props">
        <PropTable rows={radioGroupProps} title="RadioGroup" />
      </Section>

      <Section title="Radio Props">
        <PropTable rows={radioItemProps} title="Radio" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
