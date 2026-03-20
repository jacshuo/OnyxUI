import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const sortableTableProps: PropRow[] = [
  { prop: "columns", type: "ColumnDef<T>[]", required: true, description: "Column definitions" },
  { prop: "data", type: "T[]", required: true, description: "Row data array" },
  { prop: "onSort", type: "(sort: SortState) => void", description: "Sort change callback" },
  { prop: "defaultSort", type: "SortState", description: "Initial sort state" },
  {
    prop: "rowActions",
    type: "(row: T) => React.ReactNode",
    description: "Per-row action buttons",
  },
];

const dataTableProps: PropRow[] = [
  {
    prop: "selectionMode",
    type: `"none" | "single" | "multiple"`,
    default: `"none"`,
    description: "Row selection mode",
  },
  { prop: "selectedKeys", type: "Set<string>", description: "Controlled selection set" },
  {
    prop: "onSelectionChange",
    type: "(keys: Set<string>) => void",
    description: "Selection change callback",
  },
  {
    prop: "rowKey",
    type: "(row: T) => string",
    description: "Function to extract a unique key per row",
  },
];

const columnDefProps: PropRow[] = [
  { prop: "key", type: "string", required: true, description: "Column identifier" },
  { prop: "header", type: "React.ReactNode", required: true, description: "Column header content" },
  {
    prop: "cell",
    type: "(row: T) => React.ReactNode",
    required: true,
    description: "Cell renderer function",
  },
  { prop: "sortable", type: "boolean", description: "Enable sorting for this column" },
  { prop: "compareFn", type: "(a: T, b: T) => number", description: "Custom sort comparator" },
  { prop: "editable", type: "boolean", description: "Enable inline cell editing" },
  {
    prop: "hideBelow",
    type: `"sm" | "md" | "lg"`,
    description: "Hide column below this breakpoint",
  },
];

const usageCode = `import { DataTable, type ColumnDef } from "@jacshuo/onyx";

type User = { id: string; name: string; email: string };

const columns: ColumnDef<User>[] = [
  { key: "name",  header: "Name",  cell: (r) => r.name,  sortable: true },
  { key: "email", header: "Email", cell: (r) => r.email },
];

const data: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob",   email: "bob@example.com" },
];

export function Example() {
  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(r) => r.id}
      selectionMode="multiple"
    />
  );
}`;

export default function TableDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Table</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import {
  Table, SortableTable, DataTable, TableEmpty,
  type ColumnDef,
} from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Primitives">
        <p className="text-sm text-primary-600 dark:text-primary-400">
          Table, TableHeader, TableBody, TableRow, TableHead, TableCell — standard HTML table
          elements styled with Tailwind. Accept their respective native HTML element attributes.
        </p>
      </Section>

      <Section title="SortableTable Props">
        <PropTable rows={sortableTableProps} title="SortableTable" />
      </Section>

      <Section title="DataTable Additional Props">
        <p className="mb-2 text-sm text-primary-600 dark:text-primary-400">
          DataTable extends SortableTable and adds selection support.
        </p>
        <PropTable rows={dataTableProps} title="DataTable" />
      </Section>

      <Section title="ColumnDef">
        <PropTable rows={columnDefProps} title="ColumnDef<T>" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
