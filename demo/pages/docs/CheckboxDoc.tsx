import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const checkboxProps: PropRow[] = [
  { prop: "checked", type: "boolean", description: "Controlled checked state" },
  { prop: "defaultChecked", type: "boolean", description: "Uncontrolled initial checked state" },
  {
    prop: "indeterminate",
    type: "boolean",
    default: "false",
    description: "Shows indeterminate (dash) state",
  },
  { prop: "onCheckedChange", type: "(checked: boolean) => void", description: "Change callback" },
  { prop: "label", type: "string", description: "Label text displayed next to the checkbox" },
  {
    prop: "intent",
    type: `"primary" | "success" | "danger" | "warning"`,
    default: `"primary"`,
    description: "Color intent",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Checkbox size" },
  { prop: "disabled", type: "boolean", default: "false", description: "Disabled state" },
];

const usageCode = `import { Checkbox } from "@jacshuo/onyx";
import { useState } from "react";

export function Example() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        label="Accept terms"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Checkbox label="Success intent" intent="success" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
    </div>
  );
}`;

export default function CheckboxDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Checkbox</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Checkbox, type CheckboxProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={checkboxProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
