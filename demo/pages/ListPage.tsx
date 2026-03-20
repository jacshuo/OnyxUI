import { useState } from "react";
import { List, ListItem } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";
import { Circle, Disc, MousePointerClick, Pencil, Trash2 } from "lucide-react";

const intentsCode = `<List>{/* Default */}
  <ListItem><Circle /> Alpha</ListItem>
</List>
<List intent="bordered">
  <ListItem><Disc /> Item A</ListItem>
</List>
<List intent="hover">
  <ListItem><MousePointerClick /> Hoverable</ListItem>
</List>
// Available intents: "default" | "bordered" | "hover"`;

const actionsCode = `<List intent="hover" className="max-w-sm">
  {items.map((item) => (
    <ListItem
      key={item.id}
      actions={
        <>
          <button onClick={() => handleEdit(item)}><Pencil /></button>
          <button onClick={() => handleDelete(item)}><Trash2 /></button>
        </>
      }
    >
      {item.name}
    </ListItem>
  ))}
</List>`;

const sizesCode = `<List size="sm" intent="bordered">
  <ListItem>Alpha</ListItem>
</List>
<List size="md" intent="bordered">
  <ListItem>Alpha</ListItem>
</List>
<List size="lg" intent="bordered">
  <ListItem>Alpha</ListItem>
</List>`;

type Item = { id: number; name: string };

const actionBtnClass =
  "rounded p-0.5 text-primary-400 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors";

export default function ListPage() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Alpha" },
    { id: 2, name: "Bravo" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "Delta" },
  ]);

  const handleDelete = (item: Item) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleEdit = (item: Item) => {
    const newName = prompt("Rename item:", item.name);
    if (newName && newName.trim()) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, name: newName.trim() } : i)));
    }
  };

  return (
    <div className="space-y-8">
      <PageTitle>List</PageTitle>

      <div className="grid gap-8 sm:grid-cols-3">
        <Section title="Default">
          <List>
            <ListItem>
              <Circle className="text-primary-400" /> Alpha
            </ListItem>
            <ListItem>
              <Circle className="text-primary-400" /> Bravo
            </ListItem>
            <ListItem>
              <Circle className="text-primary-400" /> Charlie
            </ListItem>
          </List>
        </Section>

        <Section title="Bordered">
          <List intent="bordered">
            <ListItem>
              <Disc className="text-primary-400" /> Item A
            </ListItem>
            <ListItem>
              <Disc className="text-primary-400" /> Item B
            </ListItem>
            <ListItem>
              <Disc className="text-primary-400" /> Item C
            </ListItem>
          </List>
        </Section>

        <Section title="Hover">
          <List intent="hover">
            <ListItem>
              <MousePointerClick className="text-primary-400" /> Hoverable A
            </ListItem>
            <ListItem>
              <MousePointerClick className="text-primary-400" /> Hoverable B
            </ListItem>
            <ListItem>
              <MousePointerClick className="text-primary-400" /> Hoverable C
            </ListItem>
          </List>
        </Section>
      </div>
      <CodeExample code={intentsCode} />

      <Section title="Row actions (hover to reveal edit / delete)">
        <List intent="hover" className="max-w-sm">
          {items.map((item) => (
            <ListItem
              key={item.id}
              actions={
                <>
                  <button
                    type="button"
                    className={actionBtnClass}
                    onClick={() => handleEdit(item)}
                    aria-label={`Edit ${item.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className={actionBtnClass}
                    onClick={() => handleDelete(item)}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              }
            >
              <Circle className="text-primary-400" /> {item.name}
            </ListItem>
          ))}
          {items.length === 0 && (
            <li className="py-4 text-center text-sm text-primary-400">No items left</li>
          )}
        </List>
        <CodeExample code={actionsCode} />
      </Section>

      <Section title="Sizes">
        <div className="grid gap-6 sm:grid-cols-3">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-400">
                {size}
              </p>
              <List size={size} intent="bordered">
                <ListItem>
                  <Circle className="text-primary-400" /> Alpha
                </ListItem>
                <ListItem>
                  <Circle className="text-primary-400" /> Bravo
                </ListItem>
                <ListItem>
                  <Circle className="text-primary-400" /> Charlie
                </ListItem>
              </List>
            </div>
          ))}
        </div>
        <CodeExample code={sizesCode} />
      </Section>
    </div>
  );
}
