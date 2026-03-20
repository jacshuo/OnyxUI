import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const fileExplorerItemProps: PropRow[] = [
  { prop: "name", type: "string", required: true, description: "File or folder name" },
  { prop: "path", type: "string", required: true, description: "Full file path" },
  { prop: "type", type: `"file" | "directory"`, required: true, description: "Item type" },
  { prop: "size", type: "number", description: "File size in bytes" },
  { prop: "extension", type: "string", description: "File extension (e.g. 'tsx', 'json')" },
  { prop: "modifiedAt", type: "Date | string", description: "Last modified date" },
  { prop: "mimeType", type: "string", description: "MIME type" },
  { prop: "hidden", type: "boolean", description: "Whether the item is a hidden file" },
];

const fileExplorerProps: PropRow[] = [
  {
    prop: "files",
    type: "FileExplorerItem[]",
    required: true,
    description: "File items to display",
  },
  { prop: "title", type: "string", description: "Window title" },
  { prop: "accent", type: "string", description: "Accent color (CSS color value)" },
  {
    prop: "defaultView",
    type: `"list" | "grid"`,
    default: `"list"`,
    description: "Default view mode",
  },
  {
    prop: "dockable",
    type: "boolean",
    default: "false",
    description: "Enable docking to screen side",
  },
  {
    prop: "dockSide",
    type: `"left" | "right"`,
    default: `"right"`,
    description: "Preferred dock side",
  },
  { prop: "visible", type: "boolean", default: "true", description: "Controlled visibility" },
  { prop: "resizable", type: "boolean", default: "true", description: "Allow window resizing" },
  {
    prop: "onFileOpen",
    type: "(file: FileExplorerItem) => void",
    description: "File open callback",
  },
  {
    prop: "onSelectionChange",
    type: "(files: FileExplorerItem[]) => void",
    description: "Selection change callback",
  },
  {
    prop: "onNavigate",
    type: "(path: string) => void",
    description: "Directory navigation callback",
  },
  { prop: "onDelete", type: "(files: FileExplorerItem[]) => void", description: "Delete callback" },
  { prop: "onClose", type: "() => void", description: "Close callback" },
  { prop: "actions", type: "FileExplorerAction[]", description: "Custom context menu actions" },
];

const usageCode = `import { FileExplorer, type FileExplorerItem } from "@jacshuo/onyx";

const files: FileExplorerItem[] = [
  { name: "src",       path: "/src",           type: "directory" },
  { name: "index.ts",  path: "/src/index.ts",  type: "file", extension: "ts", size: 2048 },
  { name: "App.tsx",   path: "/src/App.tsx",   type: "file", extension: "tsx", size: 4096 },
  { name: "README.md", path: "/README.md",     type: "file", extension: "md",  size: 1024 },
];

export function Example() {
  return (
    <FileExplorer
      files={files}
      title="Project Explorer"
      defaultView="list"
      onFileOpen={(f) => console.log(f.path)}
    />
  );
}`;

export default function FileExplorerDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>FileExplorer</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { FileExplorer, type FileExplorerProps, type FileExplorerItem } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="FileExplorerItem">
        <PropTable rows={fileExplorerItemProps} title="FileExplorerItem" />
      </Section>

      <Section title="FileExplorer Props">
        <PropTable rows={fileExplorerProps} title="FileExplorer" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
