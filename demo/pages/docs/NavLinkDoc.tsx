import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const navLinkProps: PropRow[] = [
  {
    prop: "intent",
    type: `"default" | "active"`,
    default: `"default"`,
    description: "Visual style — active highlights the link",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Link size" },
  {
    prop: "external",
    type: "boolean",
    default: "false",
    description: "Open link in new tab (target=_blank)",
  },
  {
    prop: "...rest",
    type: "AnchorHTMLAttributes<HTMLAnchorElement>",
    description: "All native anchor attributes",
  },
];

const usageCode = `import { NavLink } from "@jacshuo/onyx";

export function Example() {
  return (
    <nav className="flex gap-4">
      <NavLink href="/" intent="active">Home</NavLink>
      <NavLink href="/docs">Docs</NavLink>
      <NavLink href="https://github.com" external>GitHub</NavLink>
    </nav>
  );
}`;

export default function NavLinkDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>NavLink</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { NavLink } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={navLinkProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
