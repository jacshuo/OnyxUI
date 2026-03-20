import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const treeProps: PropRow[] = [
  {
    prop: "showLines",
    type: "boolean",
    default: "false",
    description: "Show connecting guide lines",
  },
  { prop: "showRoot", type: "boolean", default: "false", description: "Show root node" },
  { prop: "expandedKeys", type: "Set<string>", description: "Controlled expanded node keys" },
  {
    prop: "defaultExpandedKeys",
    type: `Set<string> | "all"`,
    description: "Initial expanded keys (uncontrolled)",
  },
  {
    prop: "onExpandedKeysChange",
    type: "(keys: Set<string>) => void",
    description: "Expansion change callback",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Node size" },
];

const treeItemProps: PropRow[] = [
  { prop: "nodeKey", type: "string", description: "Unique key for controlled expansion" },
  { prop: "label", type: "React.ReactNode", required: true, description: "Node label content" },
  { prop: "icon", type: "React.ReactNode", description: "Leading icon" },
  { prop: "actions", type: "React.ReactNode", description: "Hover-revealed action buttons" },
  {
    prop: "defaultExpanded",
    type: "boolean",
    default: "false",
    description: "Initial expansion state (uncontrolled)",
  },
  { prop: "expanded", type: "boolean", description: "Controlled expansion state" },
  { prop: "onToggle", type: "(expanded: boolean) => void", description: "Toggle callback" },
];

const usageCode = `import { Tree, TreeItem } from "@jacshuo/onyx";
import { Folder, File } from "lucide-react";

export function Example() {
  return (
    <Tree showLines defaultExpandedKeys="all">
      <TreeItem label="src" icon={<Folder size={14} />}>
        <TreeItem label="components" icon={<Folder size={14} />}>
          <TreeItem label="Button.tsx" icon={<File size={14} />} />
          <TreeItem label="Badge.tsx"  icon={<File size={14} />} />
        </TreeItem>
        <TreeItem label="index.ts" icon={<File size={14} />} />
      </TreeItem>
    </Tree>
  );
}`;

export default function TreeDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Tree</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Tree, TreeItem } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Tree Props">
        <PropTable rows={treeProps} title="Tree" />
      </Section>

      <Section title="TreeItem Props">
        <PropTable rows={treeItemProps} title="TreeItem" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
