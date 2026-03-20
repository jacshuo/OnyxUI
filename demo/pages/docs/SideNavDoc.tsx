import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const sideNavItemProps: PropRow[] = [
  { prop: "key", type: "string", description: "Unique key" },
  { prop: "label", type: "string", required: true, description: "Item label" },
  { prop: "path", type: "string", description: "Navigation path for leaf items" },
  { prop: "icon", type: "React.ReactNode", description: "Category / item icon" },
  { prop: "children", type: "SideNavItem[]", description: "Nested child items" },
  { prop: "defaultOpen", type: "boolean", description: "Initially expanded" },
];

const sideNavProps: PropRow[] = [
  { prop: "items", type: "SideNavItem[]", required: true, description: "Navigation items tree" },
  { prop: "title", type: "string", description: "Sidebar heading" },
  {
    prop: "basePath",
    type: "string",
    default: `"/"`,
    description: "Base path prefix prepended to item paths",
  },
  {
    prop: "onItemClick",
    type: "(item: SideNavItem, fullPath: string) => void",
    description: "Item click callback",
  },
  {
    prop: "LinkComponent",
    type: "ComponentType<SideNavLinkComponentProps>",
    description: "Custom link renderer",
  },
  {
    prop: "collapsible",
    type: "boolean",
    default: "false",
    description: "Enable collapse control button",
  },
  {
    prop: "collapseMode",
    type: `"expanded" | "icons" | "mini"`,
    default: `"expanded"`,
    description: "Controlled collapse state",
  },
  {
    prop: "defaultCollapseMode",
    type: `"expanded" | "icons" | "mini"`,
    default: `"expanded"`,
    description: "Uncontrolled initial collapse state",
  },
  {
    prop: "onCollapseModeChange",
    type: "(mode: SideNavCollapseMode) => void",
    description: "Collapse change callback",
  },
  { prop: "showLines", type: "boolean", default: "true", description: "Show tree guide lines" },
  { prop: "expandedKeys", type: "Set<string>", description: "Controlled expanded group keys" },
  {
    prop: "defaultExpandedKeys",
    type: `Set<string> | "all"`,
    description: "Initial expanded groups (uncontrolled)",
  },
  {
    prop: "onExpandedKeysChange",
    type: "(keys: Set<string>) => void",
    description: "Expansion change callback",
  },
  {
    prop: "responsive",
    type: "boolean",
    default: "true",
    description: "Responsive mobile overlay",
  },
  {
    prop: "mobileBreakpoint",
    type: "number",
    default: "768",
    description: "Breakpoint (px) for mobile mode",
  },
];

const usageCode = `import { SideNav, type SideNavItem, type SideNavLinkComponentProps } from "@jacshuo/onyx";
import { NavLink } from "react-router-dom";

function RouterLink({ to, className, style, children }: SideNavLinkComponentProps) {
  return (
    <NavLink to={to} className={({ isActive }) =>
      typeof className === "function" ? className({ isActive }) : className
    } style={style}>
      {children}
    </NavLink>
  );
}

const items: SideNavItem[] = [
  {
    label: "Components",
    children: [
      { label: "Button", path: "button" },
      { label: "Badge",  path: "badge" },
    ],
  },
];

export function Example() {
  return (
    <SideNav
      items={items}
      basePath="/"
      LinkComponent={RouterLink}
      collapsible
    />
  );
}`;

export default function SideNavDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>SideNav</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { SideNav, type SideNavProps, type SideNavItem } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="SideNavItem">
        <PropTable rows={sideNavItemProps} title="SideNavItem" />
      </Section>

      <Section title="SideNav Props">
        <PropTable rows={sideNavProps} title="SideNav" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
