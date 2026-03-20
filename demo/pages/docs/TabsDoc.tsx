import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const tabsProps: PropRow[] = [
  { prop: "defaultValue", type: "string", description: "Initially active tab (uncontrolled)" },
  { prop: "value", type: "string", description: "Controlled active tab" },
  { prop: "onValueChange", type: "(value: string) => void", description: "Change callback" },
  {
    prop: "intent",
    type: `"default" | "pills" | "underline"`,
    default: `"default"`,
    description: "Visual style of the tab list",
  },
];

const tabTriggerProps: PropRow[] = [
  {
    prop: "value",
    type: "string",
    required: true,
    description: "Tab value identifier matched against Tabs value",
  },
];

const tabContentProps: PropRow[] = [
  {
    prop: "value",
    type: "string",
    required: true,
    description: "Show this panel when the active tab matches value",
  },
];

const usageCode = `import { Tabs, TabList, TabTrigger, TabPanels, TabContent } from "@jacshuo/onyx";

export function Example() {
  return (
    <Tabs defaultValue="overview" intent="underline">
      <TabList>
        <TabTrigger value="overview">Overview</TabTrigger>
        <TabTrigger value="api">API</TabTrigger>
        <TabTrigger value="examples">Examples</TabTrigger>
      </TabList>
      <TabPanels>
        <TabContent value="overview"><p>Overview content</p></TabContent>
        <TabContent value="api"><p>API reference</p></TabContent>
        <TabContent value="examples"><p>Code examples</p></TabContent>
      </TabPanels>
    </Tabs>
  );
}`;

export default function TabsDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Tabs</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Tabs, TabList, TabTrigger, TabPanels, TabContent } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Tabs Props">
        <PropTable rows={tabsProps} title="Tabs" />
      </Section>

      <Section title="TabTrigger Props">
        <PropTable rows={tabTriggerProps} title="TabTrigger" />
      </Section>

      <Section title="TabContent Props">
        <PropTable rows={tabContentProps} title="TabContent" />
      </Section>

      <Section title="Notes">
        <p className="text-sm text-primary-600 dark:text-primary-400">
          TabList and TabPanels are layout wrappers that pass through
          HTMLAttributes&lt;HTMLDivElement&gt;.
        </p>
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
