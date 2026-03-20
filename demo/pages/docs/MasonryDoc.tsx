import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const masonryProps: PropRow[] = [
  { prop: "items", type: "MasonryItemData[]", description: "Items to display in the masonry grid" },
  { prop: "columns", type: "number", default: "3", description: "Number of columns" },
  {
    prop: "columnWidth",
    type: "number",
    default: "300",
    description: "Minimum column width in pixels",
  },
  { prop: "gap", type: "number", default: "16", description: "Gap between items in pixels" },
  {
    prop: "onItemClick",
    type: "(item: MasonryItemData, index: number) => void",
    description: "Click handler for each item",
  },
];

const masonryItemProps: PropRow[] = [
  { prop: "key", type: "React.Key", description: "Unique key for React reconciliation" },
  { prop: "content", type: "React.ReactNode", required: true, description: "Item content" },
  { prop: "title", type: "string", description: "Item title" },
  { prop: "description", type: "string", description: "Item description" },
  { prop: "actions", type: "React.ReactNode", description: "Action elements shown on the item" },
];

const usageCode = `import { Masonry, type MasonryItemData } from "@jacshuo/onyx";

const items: MasonryItemData[] = [
  { key: "1", title: "Photo A", description: "Landscape", content: <img src="https://picsum.photos/300/200" alt="A" /> },
  { key: "2", title: "Photo B", description: "Portrait",  content: <img src="https://picsum.photos/300/400" alt="B" /> },
  { key: "3", title: "Photo C", description: "Square",   content: <img src="https://picsum.photos/300/300" alt="C" /> },
];

export function Example() {
  return (
    <Masonry
      items={items}
      columns={3}
      gap={16}
      onItemClick={(item) => console.log(item.title)}
    />
  );
}`;

export default function MasonryDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Masonry</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Masonry, type MasonryProps, type MasonryItemData } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Masonry Props">
        <PropTable rows={masonryProps} title="Masonry" />
      </Section>

      <Section title="MasonryItemData">
        <PropTable rows={masonryItemProps} title="MasonryItemData" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
