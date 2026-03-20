import { useState } from "react";
import { SideNav, Button, type SideNavItem, type SideNavCollapseMode } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";
import { Home, Settings, User, FileText, Mail, FolderOpen, Database, Menu, X } from "lucide-react";
import { cn } from "../../src/lib/utils";

const withIconsCode = `<SideNav
  items={[
    { key: "dashboard", label: "Dashboard", path: "#", icon: <Home /> },
    { key: "profile",   label: "Profile",   path: "#", icon: <User /> },
    {
      label: "Documents", icon: <FileText />,
      children: [
        { key: "invoices", label: "Invoices", path: "#" },
        { key: "reports",  label: "Reports",  path: "#" },
      ],
    },
  ]}
  title="App Navigation"
/>`;

const collapsibleCode = `{/* collapseMode: "expanded" | "icons" | "mini" */}
<SideNav
  items={items}
  title="App Navigation"
  collapsible
  collapseMode={mode}
  onCollapseModeChange={setMode}
/>`;

const noLinesCode = `<SideNav items={items} title="App Navigation" showLines={false} />`;

const programmaticCode = `const [expanded, setExpanded] = useState(new Set(["Documents"]));

<SideNav
  items={items}
  expandedKeys={expanded}
  onExpandedKeysChange={setExpanded}
/>`;

const responsiveCode = `{/* Renders inline above mobileBreakpoint, slide-in drawer below */}
<SideNav items={items} mobileBreakpoint={768} />`;

const items: SideNavItem[] = [
  { key: "dashboard", label: "Dashboard", path: "#", icon: <Home className="h-4 w-4" /> },
  { key: "profile", label: "Profile", path: "#", icon: <User className="h-4 w-4" /> },
  {
    label: "Documents",
    icon: <FileText className="h-4 w-4" />,
    children: [
      { key: "invoices", label: "Invoices", path: "#" },
      { key: "reports", label: "Reports", path: "#" },
      {
        label: "Archives",
        icon: <FolderOpen className="h-4 w-4" />,
        children: [
          { key: "2024", label: "2024", path: "#" },
          { key: "2025", label: "2025", path: "#" },
        ],
      },
    ],
  },
  {
    label: "Data",
    icon: <Database className="h-4 w-4" />,
    children: [
      { key: "import", label: "Import", path: "#" },
      { key: "export", label: "Export", path: "#" },
    ],
  },
  { key: "messages", label: "Messages", path: "#", icon: <Mail className="h-4 w-4" /> },
  { key: "settings", label: "Settings", path: "#", icon: <Settings className="h-4 w-4" /> },
];

const allGroupKeys = new Set(["Documents", "Archives", "Data"]);

export default function SideNavPage() {
  const [mode, setMode] = useState<SideNavCollapseMode>("expanded");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(allGroupKeys));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="space-y-8">
      <PageTitle>SideNav</PageTitle>

      {/* ── With icons and nested groups ─────────────────── */}
      <Section title="With icons and nested groups">
        <div className="w-56 rounded-lg border border-primary-200 p-3 dark:border-primary-700">
          <SideNav items={items} title="App Navigation" responsive={false} />
        </div>
        <CodeExample code={withIconsCode} />
      </Section>

      {/* ── Collapsible ───────────────────────────────────── */}
      <Section title="Collapsible — click ‹‹ to cycle: expanded → icons → mini">
        <div
          className={`rounded-lg border border-primary-200 dark:border-primary-700 transition-all duration-200 ${
            mode === "expanded" ? "w-56 p-3" : mode === "icons" ? "w-16 p-2" : "w-12 p-1"
          }`}
        >
          <SideNav
            items={items}
            title="App Navigation"
            collapsible
            collapseMode={mode}
            onCollapseModeChange={setMode}
            responsive={false}
          />
        </div>
        <CodeExample code={collapsibleCode} />
      </Section>

      {/* ── Without indent lines ──────────────────────────── */}
      <Section title="Without indent lines">
        <div className="w-56 rounded-lg border border-primary-200 p-3 dark:border-primary-700">
          <SideNav items={items} title="App Navigation" showLines={false} responsive={false} />
        </div>
        <CodeExample code={noLinesCode} />
      </Section>

      {/* ── Programmatic expand / collapse ────────────────── */}
      <Section title="Programmatic expand / collapse">
        <div className="mb-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setExpanded(new Set(allGroupKeys))}>
            Expand All
          </Button>
          <Button size="sm" onClick={() => setExpanded(new Set())}>
            Collapse All
          </Button>
          {[...allGroupKeys].map((key) => (
            <Button
              key={key}
              size="sm"
              intent={expanded.has(key) ? "primary" : "outline"}
              onClick={() => {
                const next = new Set(expanded);
                if (next.has(key)) next.delete(key);
                else next.add(key);
                setExpanded(next);
              }}
            >
              {expanded.has(key) ? `Collapse "${key}"` : `Expand "${key}"`}
            </Button>
          ))}
        </div>
        <div className="w-56 rounded-lg border border-primary-200 p-3 dark:border-primary-700">
          <SideNav
            items={items}
            title="App Navigation"
            expandedKeys={expanded}
            onExpandedKeysChange={setExpanded}
            responsive={false}
          />
        </div>
        <CodeExample code={programmaticCode} />
      </Section>

      {/* ── Responsive behavior ───────────────────────────── */}
      <Section title="Responsive behavior">
        <p className="max-w-prose text-sm text-primary-500 dark:text-primary-400">
          On viewports wider than the{" "}
          <code className="text-primary-700 dark:text-primary-300">mobileBreakpoint</code> (default{" "}
          <code className="text-primary-700 dark:text-primary-300">768px</code>), SideNav renders
          inline. Below it, the nav collapses off-screen and a FAB toggles a slide-in drawer.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {/* Desktop frame */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-primary-400 dark:text-primary-500">
              ≥768 px — inline sidebar
            </p>
            <div className="relative flex h-80 w-72 overflow-hidden rounded-lg border border-primary-200 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/50">
              {/* Simulated sidebar */}
              <div className="w-44 shrink-0 border-r border-primary-200 bg-white p-3 dark:border-primary-700 dark:bg-primary-900">
                <SideNav items={items} title="App Navigation" responsive={false} />
              </div>
              {/* Simulated content */}
              <div className="flex flex-1 items-center justify-center text-xs text-primary-400 dark:text-primary-600">
                content area
              </div>
            </div>
          </div>

          {/* Mobile frame */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-primary-400 dark:text-primary-500">
              &lt;768 px — FAB + slide-in drawer
            </p>
            <div className="relative h-80 w-56 overflow-hidden rounded-lg border border-primary-200 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/50">
              {/* Simulated app content */}
              <div className="flex h-full items-center justify-center text-xs text-primary-400 dark:text-primary-600">
                content area
              </div>

              {/* Backdrop */}
              {mobileOpen && (
                <div
                  className="absolute inset-0 z-40 bg-black/50"
                  onClick={() => setMobileOpen(false)}
                />
              )}

              {/* Slide-in drawer */}
              <aside
                className={cn(
                  "absolute bottom-0 left-0 top-0 z-50 w-44 overflow-y-auto border-r border-primary-200 bg-white p-3 shadow-xl transition-transform duration-200 dark:border-primary-700 dark:bg-primary-900",
                  mobileOpen ? "translate-x-0" : "-translate-x-full",
                )}
              >
                <SideNav items={items} title="App Navigation" responsive={false} />
              </aside>

              {/* FAB */}
              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                className="absolute bottom-4 left-3 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-primary-800 text-white shadow-lg hover:bg-primary-700 dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-primary-200"
                aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        <CodeExample code={responsiveCode} />
      </Section>
    </div>
  );
}
