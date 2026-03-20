import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const listProps: PropRow[] = [
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Item size / padding" },
  {
    prop: "intent",
    type: `"default" | "striped"`,
    default: `"default"`,
    description: "List visual style",
  },
  {
    prop: "...rest",
    type: "HTMLAttributes<HTMLUListElement>",
    description: "All native ul attributes",
  },
];

const listItemProps: PropRow[] = [
  { prop: "actions", type: "React.ReactNode", description: "Action buttons revealed on hover" },
  {
    prop: "...rest",
    type: "LiHTMLAttributes<HTMLLIElement>",
    description: "All native li attributes",
  },
];

const usageCode = `import { List, ListItem, Button } from "@jacshuo/onyx";
import { Trash2 } from "lucide-react";

const items = ["Apple", "Banana", "Cherry"];

export function Example() {
  return (
    <List intent="striped">
      {items.map((item) => (
        <ListItem
          key={item}
          actions={
            <Button size="xs" intent="ghost">
              <Trash2 size={14} />
            </Button>
          }
        >
          {item}
        </ListItem>
      ))}
    </List>
  );
}`;

export default function ListDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>List</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { List, ListItem, type ListItemProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="List Props">
        <PropTable rows={listProps} title="List" />
      </Section>

      <Section title="ListItem Props">
        <PropTable rows={listItemProps} title="ListItem" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
