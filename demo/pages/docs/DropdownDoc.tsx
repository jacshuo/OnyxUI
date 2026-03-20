import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const dropdownOptionProps: PropRow[] = [
  { prop: "value", type: "string", required: true, description: "Option value" },
  { prop: "label", type: "string", description: "Display label (defaults to value if omitted)" },
  { prop: "icon", type: "React.ReactNode", description: "Leading icon" },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable this option" },
  { prop: "children", type: "DropdownOption[]", description: "Nested sub-options" },
];

const dropdownSingleProps: PropRow[] = [
  { prop: "options", type: "DropdownOption[]", required: true, description: "Options list" },
  { prop: "value", type: "string", description: "Controlled selected value" },
  { prop: "defaultValue", type: "string", description: "Uncontrolled initial value" },
  {
    prop: "onChange",
    type: "(value: string, option: DropdownOption) => void",
    description: "Change callback",
  },
  { prop: "placeholder", type: "string", description: "Placeholder text when nothing is selected" },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the entire dropdown",
  },
  { prop: "multiple", type: "false", description: "Single-select mode (omit or set false)" },
];

const dropdownMultiProps: PropRow[] = [
  { prop: "multiple", type: "true", required: true, description: "Enable multi-select mode" },
  { prop: "selected", type: "string[]", description: "Controlled selection array" },
  { prop: "defaultSelected", type: "string[]", description: "Uncontrolled initial selection" },
  {
    prop: "onSelectionChange",
    type: "(selected: string[]) => void",
    description: "Selection change callback",
  },
];

const dropdownButtonItemProps: PropRow[] = [
  { prop: "key", type: "string", description: "Unique key" },
  { prop: "label", type: "React.ReactNode", required: true, description: "Display label" },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable this item" },
  {
    prop: "divider",
    type: "boolean",
    default: "false",
    description: "Show a divider above this item",
  },
  { prop: "onClick", type: "() => void", description: "Click handler" },
];

const dropdownButtonProps: PropRow[] = [
  { prop: "label", type: "React.ReactNode", required: true, description: "Button label" },
  { prop: "items", type: "DropdownItem[]", required: true, description: "Menu items" },
  {
    prop: "align",
    type: `"left" | "right"`,
    default: `"left"`,
    description: "Menu alignment relative to button",
  },
  {
    prop: "intent",
    type: `"primary" | "secondary" | "danger" | "ghost" | "link"`,
    default: `"primary"`,
    description: "Button color intent",
  },
  { prop: "size", type: `"xs" | "sm" | "md" | "lg"`, default: `"md"`, description: "Button size" },
  { prop: "animated", type: "boolean", default: "true", description: "Menu open/close animation" },
  { prop: "chevron", type: "boolean", default: "true", description: "Show chevron icon" },
  {
    prop: "editable",
    type: "boolean",
    default: "false",
    description: "Allow adding new items inline",
  },
  {
    prop: "onAddItem",
    type: "(value: string) => void",
    description: "Called when a new item is added",
  },
  { prop: "multiple", type: "boolean", default: "false", description: "Multi-select mode" },
  { prop: "selected", type: "string[]", description: "Controlled selection" },
  {
    prop: "onSelectionChange",
    type: "(selected: string[]) => void",
    description: "Selection change callback",
  },
];

const dropdownUsageCode = `import { Dropdown } from "@jacshuo/onyx";

const options = [
  { value: "ts", label: "TypeScript" },
  { value: "js", label: "JavaScript" },
  { value: "rust", label: "Rust" },
];

export function Example() {
  return (
    <Dropdown
      options={options}
      defaultValue="ts"
      onChange={(val) => console.log(val)}
      placeholder="Pick a language"
    />
  );
}`;

const dropdownButtonUsageCode = `import { DropdownButton } from "@jacshuo/onyx";

const items = [
  { key: "edit", label: "Edit", onClick: () => {} },
  { key: "copy", label: "Copy", onClick: () => {} },
  { key: "delete", label: "Delete", divider: true, onClick: () => {} },
];

export function Example() {
  return (
    <DropdownButton label="Actions" items={items} intent="secondary" />
  );
}`;

export default function DropdownDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Dropdown &amp; DropdownButton</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Dropdown, type DropdownProps, type DropdownOption } from "@jacshuo/onyx";
import { DropdownButton, type DropdownItem } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="DropdownOption">
        <PropTable rows={dropdownOptionProps} title="DropdownOption" />
      </Section>

      <Section title="Dropdown — Single-select Props">
        <PropTable rows={dropdownSingleProps} title="Dropdown (single)" />
      </Section>

      <Section title="Dropdown — Multi-select Additional Props">
        <PropTable rows={dropdownMultiProps} title="Dropdown (multiple)" />
      </Section>

      <Section title="Dropdown Usage">
        <CodeExample code={dropdownUsageCode} />
      </Section>

      <Section title="DropdownItem">
        <PropTable rows={dropdownButtonItemProps} title="DropdownItem" />
      </Section>

      <Section title="DropdownButton Props">
        <PropTable rows={dropdownButtonProps} title="DropdownButton" />
      </Section>

      <Section title="DropdownButton Usage">
        <CodeExample code={dropdownButtonUsageCode} />
      </Section>
    </div>
  );
}
