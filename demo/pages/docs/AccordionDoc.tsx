import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const accordionProps: PropRow[] = [
  {
    prop: "type",
    type: `"single" | "multiple"`,
    default: `"single"`,
    description: "Allow one or many items open at once",
  },
  {
    prop: "defaultValue",
    type: "string[]",
    default: "[]",
    description: "Initially open items (uncontrolled)",
  },
  { prop: "value", type: "string[]", description: "Controlled open items" },
  { prop: "onValueChange", type: "(value: string[]) => void", description: "Change callback" },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Item padding size" },
  {
    prop: "intent",
    type: `"default" | "bordered"`,
    default: `"default"`,
    description: "Visual style",
  },
];

const accordionItemProps: PropRow[] = [
  { prop: "value", type: "string", required: true, description: "Unique identifier for this item" },
];

const usageCode = `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@jacshuo/onyx";

export function Example() {
  return (
    <Accordion type="single" defaultValue={["item-1"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is OnyxUI?</AccordionTrigger>
        <AccordionContent>
          A cross-platform React UI component library for web and Electron.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I install it?</AccordionTrigger>
        <AccordionContent>
          Run <code>npm install @jacshuo/onyx</code> and import the CSS.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`;

export default function AccordionDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Accordion</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Accordion Props">
        <PropTable rows={accordionProps} title="Accordion" />
      </Section>

      <Section title="AccordionItem Props">
        <PropTable rows={accordionItemProps} title="AccordionItem" />
      </Section>

      <Section title="Notes">
        <p className="text-sm text-primary-600 dark:text-primary-400">
          AccordionTrigger and AccordionContent pass through their native button / div attributes.
        </p>
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
