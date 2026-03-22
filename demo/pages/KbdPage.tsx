import { Kbd, KbdGroup } from "../../src";
import { Section, PageTitle, CodeExample, PropTable, type PropRow } from "./helpers";

const variantsCode = `<Kbd variant="default">Ctrl</Kbd>
<Kbd variant="outline">Ctrl</Kbd>
<Kbd variant="ghost">Ctrl</Kbd>`;

const sizesCode = `<Kbd size="xs">Esc</Kbd>
<Kbd size="sm">Tab</Kbd>
<Kbd size="md">Enter</Kbd>
<Kbd size="lg">Space</Kbd>`;

const groupsCode = `<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>S</Kbd>
</KbdGroup>

<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>⇧</Kbd>
  <Kbd>P</Kbd>
</KbdGroup>

<KbdGroup separator="then">
  <Kbd>g</Kbd>
  <Kbd>g</Kbd>
</KbdGroup>`;

const symbolsCode = `<Kbd>⌘</Kbd>  {/* Command */}
<Kbd>⌥</Kbd>  {/* Option/Alt */}
<Kbd>⇧</Kbd>  {/* Shift */}
<Kbd>⌃</Kbd>  {/* Control */}
<Kbd>⏎</Kbd>  {/* Return */}
<Kbd>⌫</Kbd>  {/* Backspace */}
<Kbd>⎋</Kbd>  {/* Escape */}`;

const inlineCode = `<p className="text-sm">
  Press{" "}
  <KbdGroup>
    <Kbd size="xs">⌘</Kbd>
    <Kbd size="xs">K</Kbd>
  </KbdGroup>{" "}
  to open the command palette.
</p>`;

const kbdProps: PropRow[] = [
  { prop: "size", type: '"xs" | "sm" | "md" | "lg"', default: '"sm"', description: "Key size." },
  {
    prop: "variant",
    type: '"default" | "outline" | "ghost"',
    default: '"default"',
    description: "Visual style.",
  },
  { prop: "className", type: "string", description: "Extra class names." },
  { prop: "children", type: "ReactNode", required: true, description: "Key label or symbol." },
];

const kbdGroupProps: PropRow[] = [
  { prop: "separator", type: "ReactNode", default: '"+"', description: "Separator between keys." },
  { prop: "className", type: "string", description: "Extra class names." },
  { prop: "children", type: "ReactNode", required: true, description: "Kbd elements." },
];

export default function KbdPage() {
  return (
    <div className="space-y-8">
      <PageTitle>Kbd</PageTitle>

      <Section title="All variants">
        <div className="flex flex-wrap items-center gap-3">
          <Kbd variant="default">Ctrl</Kbd>
          <Kbd variant="outline">Ctrl</Kbd>
          <Kbd variant="ghost">Ctrl</Kbd>
        </div>
        <CodeExample code={variantsCode} />
      </Section>

      <Section title="All sizes">
        <div className="flex flex-wrap items-center gap-3">
          <Kbd size="xs">Esc</Kbd>
          <Kbd size="sm">Tab</Kbd>
          <Kbd size="md">Enter</Kbd>
          <Kbd size="lg">Space</Kbd>
        </div>
        <CodeExample code={sizesCode} />
      </Section>

      <Section title="Keyboard shortcuts via KbdGroup">
        <div className="flex flex-wrap items-center gap-4">
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>S</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>⇧</Kbd>
            <Kbd>P</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>Alt</Kbd>
            <Kbd>Del</Kbd>
          </KbdGroup>
          <KbdGroup separator="then">
            <Kbd>g</Kbd>
            <Kbd>g</Kbd>
          </KbdGroup>
        </div>
        <CodeExample code={groupsCode} />
      </Section>

      <Section title="Special symbols">
        <div className="flex flex-wrap items-center gap-2">
          {["⌘", "⌥", "⇧", "⌃", "⏎", "⌫", "⎋", "⇥"].map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <Kbd size="md">{s}</Kbd>
              <span className="text-[10px] text-secondary-400">{s}</span>
            </div>
          ))}
        </div>
        <CodeExample code={symbolsCode} />
      </Section>

      <Section title="Inline usage (shortcut hint)">
        <div className="rounded-lg border border-secondary-200 p-4 text-sm text-secondary-700 dark:border-secondary-700 dark:text-secondary-300">
          <p>
            Press{" "}
            <KbdGroup>
              <Kbd size="xs">⌘</Kbd>
              <Kbd size="xs">K</Kbd>
            </KbdGroup>{" "}
            to open the command palette. Or use{" "}
            <KbdGroup>
              <Kbd size="xs">⌘</Kbd>
              <Kbd size="xs">⇧</Kbd>
              <Kbd size="xs">P</Kbd>
            </KbdGroup>{" "}
            for quick actions.
          </p>
        </div>
        <CodeExample code={inlineCode} />
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
