import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const headerNavItemProps: PropRow[] = [
  { prop: "label", type: "React.ReactNode", required: true, description: "Link text / content" },
  { prop: "href", type: "string", description: "Navigation URL" },
  { prop: "active", type: "boolean", description: "Force active visual state" },
  { prop: "onClick", type: "(e: MouseEvent) => void", description: "Click handler" },
];

const headerActionProps: PropRow[] = [
  { prop: "key", type: "string", description: "Unique key for React reconciliation" },
  { prop: "icon", type: "React.ReactNode", required: true, description: "Action icon element" },
  { prop: "ariaLabel", type: "string", description: "Accessible label for the button" },
  { prop: "onClick", type: "(e: MouseEvent) => void", description: "Click handler" },
  { prop: "href", type: "string", description: "Link URL (renders as an anchor)" },
  { prop: "external", type: "boolean", description: "Open in a new tab (target=_blank)" },
];

const headerProps: PropRow[] = [
  { prop: "brand", type: "React.ReactNode", description: "Brand / logo content" },
  { prop: "onBrandClick", type: "(e: MouseEvent) => void", description: "Brand click handler" },
  { prop: "navItems", type: "HeaderNavItem[]", default: "[]", description: "Navigation links" },
  {
    prop: "actions",
    type: "HeaderAction[]",
    default: "[]",
    description: "Icon action buttons on the right",
  },
  {
    prop: "linkComponent",
    type: "ComponentType<{ href, className, onClick, children }>",
    description: "Custom link renderer (e.g. React Router NavLink)",
  },
  { prop: "height", type: "string", description: "Custom header height (CSS value)" },
  {
    prop: "mobileMenu",
    type: "boolean",
    default: "false",
    description: "Enable mobile hamburger menu",
  },
  { prop: "navMenuIcon", type: "React.ReactNode", description: "Custom nav menu icon" },
  { prop: "actionsMenuIcon", type: "React.ReactNode", description: "Custom actions menu icon" },
];

const usageCode = `import { Header, type HeaderNavItem } from "@jacshuo/onyx";
import { NavLink } from "react-router-dom";

function RouterLink({ href, className, onClick, children }) {
  return <NavLink to={href} className={className} onClick={onClick}>{children}</NavLink>;
}

const navItems: HeaderNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
];

export function Example() {
  return (
    <Header
      brand={<span>MyApp</span>}
      navItems={navItems}
      linkComponent={RouterLink}
      mobileMenu
    />
  );
}`;

export default function HeaderDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Header</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Header, type HeaderProps, type HeaderNavItem, type HeaderAction } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="HeaderNavItem">
        <PropTable rows={headerNavItemProps} title="HeaderNavItem" />
      </Section>

      <Section title="HeaderAction">
        <PropTable rows={headerActionProps} title="HeaderAction" />
      </Section>

      <Section title="Header Props">
        <PropTable rows={headerProps} title="Header" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
