import { Kbd, KbdGroup } from "../../../src";
import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const installCode = `import { Kbd, KbdGroup } from "@jacshuo/onyx";`;

const usageCode = `import { Kbd, KbdGroup } from "@jacshuo/onyx";

export function Example() {
  return (
    <p>
      Save with{" "}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>S</Kbd>
      </KbdGroup>
    </p>
  );
}`;

const variantsCode = `<Kbd variant="default">Ctrl</Kbd>
<Kbd variant="outline">Ctrl</Kbd>
<Kbd variant="ghost">Ctrl</Kbd>`;

const sizesCode = `<Kbd size="xs">Esc</Kbd>
<Kbd size="sm">Tab</Kbd>
<Kbd size="md">Enter</Kbd>
<Kbd size="lg">Space</Kbd>`;

const kbdProps: PropRow[] = [
  {
    prop: "size",
    type: '"xs" | "sm" | "md" | "lg"',
    default: '"sm"',
    description: "Key display size.",
  },
  {
    prop: "variant",
    type: '"default" | "outline" | "ghost"',
    default: '"default"',
    description: "Visual style — 3D pressed / outline border / minimal.",
  },
  { prop: "className", type: "string", description: "Additional class names." },
  { prop: "children", type: "ReactNode", required: true, description: "Key label or symbol." },
];

const kbdGroupProps: PropRow[] = [
  {
    prop: "separator",
    type: "ReactNode",
    default: '"+"',
    description: "Separator rendered between each Kbd child.",
  },
  { prop: "className", type: "string", description: "Additional class names on the wrapper span." },
  { prop: "children", type: "ReactNode", required: true, description: "One or more Kbd elements." },
];

export default function KbdDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Kbd</PageTitle>

      <Section title="Import">
        <CodeExample code={installCode} language="ts" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Variants">
        <div className="flex flex-wrap gap-3">
          <Kbd variant="default">Ctrl</Kbd>
          <Kbd variant="outline">Ctrl</Kbd>
          <Kbd variant="ghost">Ctrl</Kbd>
        </div>
        <CodeExample code={variantsCode} />
      </Section>

      <Section title="Sizes">
        <div className="flex flex-wrap items-center gap-3">
          <Kbd size="xs">Esc</Kbd>
          <Kbd size="sm">Tab</Kbd>
          <Kbd size="md">Enter</Kbd>
          <Kbd size="lg">Space</Kbd>
        </div>
        <CodeExample code={sizesCode} />
      </Section>

      <Section title="Kbd Props">
        <PropTable rows={kbdProps} />
      </Section>

      <Section title="KbdGroup Props">
        <PropTable rows={kbdGroupProps} />
      </Section>
    </div>
  );
}
