import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const formProps: PropRow[] = [
  {
    prop: "layout",
    type: `"stacked" | "inline"`,
    default: `"stacked"`,
    description: "Form layout direction",
  },
  {
    prop: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Size applied to all form items",
  },
  { prop: "title", type: "React.ReactNode", description: "Form title displayed at the top" },
  { prop: "description", type: "React.ReactNode", description: "Form description below the title" },
  { prop: "footer", type: "React.ReactNode", description: "Footer content (e.g. submit button)" },
  {
    prop: "onValues",
    type: "(values: Record<string, unknown>, event: React.FormEvent) => BulkValidationResult | void",
    description: "Submit callback with all field values",
  },
];

const formItemProps: PropRow[] = [
  { prop: "label", type: "React.ReactNode", description: "Field label" },
  {
    prop: "layout",
    type: `"stacked" | "inline"`,
    description: "Override layout for this individual item",
  },
  {
    prop: "required",
    type: "boolean",
    default: "false",
    description: "Show required indicator (*)",
  },
  { prop: "hint", type: "React.ReactNode", description: "Hint text displayed below the field" },
  {
    prop: "validation",
    type: "{ status: string; message: React.ReactNode }",
    description: "Validation feedback message",
  },
  { prop: "name", type: "string", description: "HTML name attribute for the field" },
  { prop: "onValidate", type: "ValidateCallback", description: "Per-field validation function" },
];

const formSectionProps: PropRow[] = [
  { prop: "title", type: "React.ReactNode", description: "Section title" },
  { prop: "description", type: "React.ReactNode", description: "Section description" },
];

const usageCode = `import { Form, FormItem, Input, Button } from "@jacshuo/onyx";

export function Example() {
  return (
    <Form
      title="Sign up"
      layout="stacked"
      footer={<Button type="submit">Create account</Button>}
      onValues={(values) => console.log(values)}
    >
      <FormItem label="Email" required name="email">
        <Input placeholder="you@example.com" />
      </FormItem>
      <FormItem label="Password" required name="password" hint="Min 8 characters">
        <Input type="password" placeholder="••••••••" />
      </FormItem>
    </Form>
  );
}`;

export default function FormDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Form</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Form, FormItem, FormSection, type FormProps, type FormItemProps } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Form Props">
        <PropTable rows={formProps} title="Form" />
      </Section>

      <Section title="FormItem Props">
        <PropTable rows={formItemProps} title="FormItem" />
      </Section>

      <Section title="FormSection Props">
        <PropTable rows={formSectionProps} title="FormSection" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
