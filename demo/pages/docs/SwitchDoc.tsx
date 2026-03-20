import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const switchProps: PropRow[] = [
  { prop: "checked", type: "boolean", description: "Controlled checked state" },
  { prop: "defaultChecked", type: "boolean", description: "Uncontrolled initial state" },
  { prop: "onCheckedChange", type: "(checked: boolean) => void", description: "Change callback" },
  {
    prop: "checkedContent",
    type: "React.ReactNode",
    description: "Content displayed inside the thumb when ON",
  },
  {
    prop: "uncheckedContent",
    type: "React.ReactNode",
    description: "Content displayed inside the thumb when OFF",
  },
  { prop: "label", type: "string", description: "Label text displayed alongside the switch" },
  {
    prop: "intent",
    type: `"primary" | "success" | "danger" | "warning"`,
    default: `"primary"`,
    description: "Color intent when checked",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Switch size" },
];

const usageCode = `import { Switch } from "@jacshuo/onyx";
import { useState } from "react";

export function Example() {
  const [on, setOn] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Switch checked={on} onCheckedChange={setOn} label="Enable notifications" />
      <Switch defaultChecked intent="success" label="Auto-save" />
      <Switch intent="danger" label="Delete mode" size="sm" />
    </div>
  );
}`;

export default function SwitchDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Switch</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Switch, type SwitchProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={switchProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
