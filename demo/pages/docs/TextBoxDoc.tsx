import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const textBoxProps: PropRow[] = [
  {
    prop: "state",
    type: `"default" | "error"`,
    default: `"default"`,
    description: "Validation state",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "TextBox size" },
  {
    prop: "showWordCount",
    type: "boolean",
    default: "false",
    description: "Show word count below the textarea",
  },
  { prop: "maxWords", type: "number", description: "Maximum word limit (enables count display)" },
  {
    prop: "...rest",
    type: "TextareaHTMLAttributes<HTMLTextAreaElement>",
    description: "All native textarea attributes (omits size)",
  },
];

const usageCode = `import { TextBox } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex flex-col gap-3 max-w-sm">
      <TextBox placeholder="Write something…" rows={4} />
      <TextBox
        placeholder="Max 100 words"
        showWordCount
        maxWords={100}
        rows={4}
      />
      <TextBox state="error" defaultValue="invalid input" rows={3} />
    </div>
  );
}`;

export default function TextBoxDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>TextBox</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { TextBox, type TextBoxProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={textBoxProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
