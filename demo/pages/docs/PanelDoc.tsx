import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const panelProps: PropRow[] = [
  {
    prop: "intent",
    type: `"default" | "primary" | "elevated"`,
    default: `"default"`,
    description: "Visual style / elevation level",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Padding size" },
  {
    prop: "...rest",
    type: "HTMLAttributes<HTMLDivElement>",
    description: "All native div attributes",
  },
];

const usageCode = `import { Panel, PanelHeader, PanelContent } from "@jacshuo/onyx";

export function Example() {
  return (
    <Panel intent="primary" size="md">
      <PanelHeader>Panel title</PanelHeader>
      <PanelContent>
        <p>Panel body content goes here.</p>
      </PanelContent>
    </Panel>
  );
}`;

export default function PanelDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Panel</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Panel, PanelHeader, PanelContent } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Panel Props">
        <PropTable rows={panelProps} title="Panel" />
      </Section>

      <Section title="Sub-components">
        <p className="text-sm text-primary-600 dark:text-primary-400">
          PanelHeader, PanelContent — pass through HTMLAttributes&lt;HTMLDivElement&gt;.
        </p>
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
