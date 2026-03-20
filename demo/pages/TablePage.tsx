import { useState, useCallback } from "react";
import {
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SortableTable,
  DataTable,
  type ColumnDef,
} from "../../src";
import { Pencil, Trash2 } from "lucide-react";
import { Section, PageTitle, CodeExample } from "./helpers";

const sortableCode = `const columns: ColumnDef<Person>[] = [
  { key: "name", header: "Name", cell: (r) => r.name },
  { key: "age",  header: "Age",  cell: (r) => r.age, compareFn: (a, b) => a.age - b.age },
  { key: "status", header: "Status", sortable: false, cell: (r) => <Badge>{r.status}</Badge> },
];

<SortableTable
  columns={columns}
  data={people}
  defaultSort={{ column: "name", direction: "asc" }}
  rowKey={(r) => r.id}
/>`;

const singleSelCode = `<DataTable
  columns={columns} data={people}
  rowKey={(r) => r.id}
  selectionMode="single"
  selected={selected} onSelectionChange={setSelected}
  defaultSort={{ column: "name", direction: "asc" }}
/>`;

const multiSelCode = `<DataTable
  columns={columns} data={people}
  rowKey={(r) => r.id}
  selectionMode="multiple"
  selected={selected} onSelectionChange={setSelected}
  toolbar
  onDelete={(keys) => console.log("delete", keys)}
/>`;

const editableCode = `<DataTable
  columns={columns} data={people}
  rowKey={(r) => r.id}
  selectionMode="multiple"
  selected={selected} onSelectionChange={setSelected}
  editable onCellEdit={handleCellEdit}
  toolbar onAdd={handleAdd} onDelete={handleDelete}
/>`;

const rowActionsCode = `<SortableTable
  columns={columns} data={people}
  rowKey={(r) => r.id}
  rowActions={(row) => (
    <>
      <button onClick={() => editRow(row)}><Pencil /></button>
      <button onClick={() => deleteRow(row)}><Trash2 /></button>
    </>
  )}
/>`;

const borderedCode = `<Table intent="bordered">
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Widget</TableCell>
      <TableCell>$9.99</TableCell>
    </TableRow>
  </TableBody>
</Table>`;

const densityCode = `{/* density: "compact" | "default" | "relaxed" */}
<SortableTable columns={columns} data={people} density="compact" rowKey={(r) => r.id} />`;

const hideColumnsCode = `const columns: ColumnDef<Person>[] = [
  { key: "name",   header: "Name",   cell: (r) => r.name },
  { key: "role",   header: "Role",   cell: (r) => r.role },
  { key: "age",    header: "Age",    cell: (r) => r.age,    hideBelow: "md" },
  { key: "status", header: "Status", sortable: false,       hideBelow: "sm",
    cell: (r) => <Badge>{r.status}</Badge> },
];`;

interface Person {
  id: number;
  name: string;
  role: string;
  age: number;
  status: "active" | "away" | "offline";
}

let nextId = 6;

const initialPeople: Person[] = [
  { id: 1, name: "Alice", role: "Engineer", age: 29, status: "active" },
  { id: 2, name: "Bob", role: "Designer", age: 34, status: "away" },
  { id: 3, name: "Carol", role: "PM", age: 27, status: "offline" },
  { id: 4, name: "Dave", role: "Engineer", age: 41, status: "active" },
  { id: 5, name: "Eve", role: "Designer", age: 23, status: "away" },
];

const statusColor: Record<string, "success" | "warning" | "error"> = {
  active: "success",
  away: "warning",
  offline: "error",
};

const sortableColumns: ColumnDef<Person>[] = [
  { key: "name", header: "Name", cell: (r) => r.name },
  { key: "role", header: "Role", cell: (r) => r.role },
  { key: "age", header: "Age", cell: (r) => r.age, compareFn: (a, b) => a.age - b.age },
  {
    key: "status",
    header: "Status",
    sortable: false,
    cell: (r) => <Badge intent={statusColor[r.status]}>{r.status}</Badge>,
  },
];

const dataColumns: ColumnDef<Person>[] = [
  { key: "name", header: "Name", cell: (r) => r.name, editValue: (r) => r.name },
  { key: "role", header: "Role", cell: (r) => r.role, editValue: (r) => r.role },
  {
    key: "age",
    header: "Age",
    cell: (r) => r.age,
    editValue: (r) => String(r.age),
    compareFn: (a, b) => a.age - b.age,
  },
  {
    key: "status",
    header: "Status",
    sortable: false,
    editable: false,
    cell: (r) => <Badge intent={statusColor[r.status]}>{r.status}</Badge>,
  },
];

export default function TablePage() {
  /* ── Single-select state ─────────────────────────────── */
  const [singleSel, setSingleSel] = useState<React.Key[]>([]);

  /* ── Multi-select state ──────────────────────────────── */
  const [multiSel, setMultiSel] = useState<React.Key[]>([]);

  /* ── Editable DataTable state ────────────────────────── */
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [editSel, setEditSel] = useState<React.Key[]>([]);

  const handleCellEdit = useCallback((rowKey: React.Key, colKey: string, value: string) => {
    setPeople((prev) =>
      prev.map((p) => {
        if (p.id !== rowKey) return p;
        if (colKey === "name") return { ...p, name: value };
        if (colKey === "role") return { ...p, role: value };
        if (colKey === "age") return { ...p, age: parseInt(value, 10) || 0 };
        return p;
      }),
    );
  }, []);

  const handleAdd = useCallback(() => {
    const id = nextId++;
    setPeople((prev) => [
      ...prev,
      { id, name: `New Person ${id}`, role: "TBD", age: 0, status: "offline" },
    ]);
  }, []);

  const handleDelete = useCallback((keys: React.Key[]) => {
    setPeople((prev) => prev.filter((p) => !keys.includes(p.id)));
    setEditSel([]);
  }, []);

  return (
    <div className="space-y-8">
      <PageTitle>Table</PageTitle>

      <Section title="SortableTable — click column headers to sort">
        <SortableTable
          columns={sortableColumns}
          data={initialPeople}
          defaultSort={{ column: "name", direction: "asc" }}
          rowKey={(r) => r.id}
        />
        <CodeExample code={sortableCode} />
      </Section>

      <Section title="Single selection (radio)">
        <DataTable
          columns={sortableColumns}
          data={initialPeople}
          rowKey={(r) => r.id}
          selectionMode="single"
          selected={singleSel}
          onSelectionChange={setSingleSel}
          defaultSort={{ column: "name", direction: "asc" }}
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Selected: {singleSel.length ? String(singleSel[0]) : <em>none</em>}
        </p>
        <CodeExample code={singleSelCode} />
      </Section>

      <Section title="Multi selection (checkboxes)">
        <DataTable
          columns={sortableColumns}
          data={initialPeople}
          rowKey={(r) => r.id}
          selectionMode="multiple"
          selected={multiSel}
          onSelectionChange={setMultiSel}
          toolbar
          onDelete={(keys) => {
            setMultiSel([]);
            alert(`Delete: ${keys.join(", ")}`);
          }}
          defaultSort={{ column: "name", direction: "asc" }}
        />
        <CodeExample code={multiSelCode} />
      </Section>

      <Section title="Editable DataTable — double-click a cell to edit">
        <DataTable
          columns={dataColumns}
          data={people}
          rowKey={(r) => r.id}
          selectionMode="multiple"
          selected={editSel}
          onSelectionChange={setEditSel}
          editable
          onCellEdit={handleCellEdit}
          toolbar
          onAdd={handleAdd}
          onDelete={handleDelete}
          defaultSort={{ column: "name", direction: "asc" }}
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Double-click a cell to edit inline. Status column is not editable. Use toolbar to
          add/delete rows.
        </p>
        <CodeExample code={editableCode} />
      </Section>

      <Section title="Row actions (edit / delete per row)">
        <SortableTable
          columns={sortableColumns}
          data={people}
          defaultSort={{ column: "name", direction: "asc" }}
          rowKey={(r) => r.id}
          rowActions={(row) => (
            <>
              <button
                type="button"
                className="rounded p-1 text-primary-400 hover:text-primary-700 hover:bg-primary-100 dark:text-primary-500 dark:hover:text-primary-300 dark:hover:bg-primary-800 transition-colors"
                onClick={() => {
                  const newName = prompt("Rename:", row.name);
                  if (newName?.trim()) {
                    setPeople((prev) =>
                      prev.map((p) => (p.id === row.id ? { ...p, name: newName.trim() } : p)),
                    );
                  }
                }}
                aria-label={`Edit ${row.name}`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="rounded p-1 text-danger-400 hover:text-danger-600 hover:bg-danger-50 dark:text-danger-500 dark:hover:text-danger-400 dark:hover:bg-danger-900/30 transition-colors"
                onClick={() => {
                  setPeople((prev) => prev.filter((p) => p.id !== row.id));
                }}
                aria-label={`Delete ${row.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        />
        <CodeExample code={rowActionsCode} />
      </Section>

      <Section title="Empty state (no data)">
        <SortableTable columns={sortableColumns} data={[]} rowKey={(r) => r.id} />
        <CodeExample code={`<SortableTable columns={columns} data={[]} rowKey={(r) => r.id} />`} />
      </Section>

      <Section title="Bordered variant (manual primitives)">
        <Table intent="bordered">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Widget</TableCell>
              <TableCell>$9.99</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Gadget</TableCell>
              <TableCell>$19.99</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <CodeExample code={borderedCode} />
      </Section>

      <Section title="Density variants">
        <div className="space-y-6">
          {(["compact", "default", "relaxed"] as const).map((density) => (
            <div key={density}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-400">
                {density}
              </p>
              <SortableTable
                columns={sortableColumns}
                data={initialPeople.slice(0, 3)}
                rowKey={(r) => r.id}
                density={density}
              />
            </div>
          ))}
        </div>
        <CodeExample code={densityCode} />
      </Section>

      <Section title="Hide columns below breakpoint">
        <p className="mb-3 text-sm text-primary-500 dark:text-primary-400">
          &ldquo;Age&rdquo; hides below <code>md</code> and &ldquo;Status&rdquo; hides below{" "}
          <code>sm</code>. Narrow the window to see columns disappear.
        </p>
        <SortableTable
          columns={[
            { key: "name", header: "Name", cell: (r) => r.name },
            { key: "role", header: "Role", cell: (r) => r.role },
            { key: "age", header: "Age", cell: (r) => r.age, hideBelow: "md" },
            {
              key: "status",
              header: "Status",
              sortable: false,
              hideBelow: "sm",
              cell: (r) => <Badge intent={statusColor[r.status]}>{r.status}</Badge>,
            },
          ]}
          data={initialPeople}
          rowKey={(r) => r.id}
        />
        <CodeExample code={hideColumnsCode} />
      </Section>
    </div>
  );
}
