import { Rating } from "../../../src";
import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const installCode = `import { Rating } from "@jacshuo/onyx";`;

const usageCode = `import { Rating } from "@jacshuo/onyx";
import { useState } from "react";

export function Example() {
  const [val, setVal] = useState(0);

  return (
    <Rating
      value={val}
      onChange={setVal}
      max={5}
      intent="warning"
      label="Product rating"
    />
  );
}`;

const halfStarCode = `// Half-star precision
<Rating
  value={3.5}
  precision={0.5}
  intent="warning"
  label="Half-star rating"
/>`;

const readOnlyCode = `// Read-only display
<Rating value={4.2} precision={0.5} readOnly label="4.2 stars" />`;

const ratingProps: PropRow[] = [
  { prop: "value", type: "number", description: "Controlled value (0–max)." },
  {
    prop: "defaultValue",
    type: "number",
    default: "0",
    description: "Uncontrolled initial value.",
  },
  { prop: "max", type: "number", default: "5", description: "Total number of stars." },
  {
    prop: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Star icon size.",
  },
  {
    prop: "intent",
    type: '"warning" | "danger" | "success" | "primary"',
    default: '"warning"',
    description: "Fill colour intent.",
  },
  {
    prop: "precision",
    type: "0.5 | 1",
    default: "1",
    description: "Half-star (0.5) or whole-star (1) steps.",
  },
  { prop: "readOnly", type: "boolean", default: "false", description: "Disable all interaction." },
  { prop: "disabled", type: "boolean", default: "false", description: "Dimmed + non-interactive." },
  {
    prop: "onChange",
    type: "(value: number) => void",
    description: "Fires when a star is clicked.",
  },
  { prop: "icon", type: "ReactNode", description: "Custom filled-star icon." },
  { prop: "emptyIcon", type: "ReactNode", description: "Custom empty-star icon." },
  {
    prop: "label",
    type: "string",
    default: '"Rating"',
    description: "aria-label for the radiogroup.",
  },
  { prop: "className", type: "string", description: "Additional class names." },
];

export default function RatingDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Rating</PageTitle>

      <Section title="Import">
        <CodeExample code={installCode} language="ts" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Half-star precision">
        <Rating value={3.5} precision={0.5} label="Half-star example" />
        <CodeExample code={halfStarCode} />
      </Section>

      <Section title="Read-only display">
        <Rating value={4.2} precision={0.5} readOnly label="Read-only example" />
        <CodeExample code={readOnlyCode} />
      </Section>

      <Section title="Props">
        <PropTable rows={ratingProps} />
      </Section>
    </div>
  );
}
