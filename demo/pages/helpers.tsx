import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CodeBlock,
  NavLink,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  type CodeBlockLanguage,
} from "../../src";

/* ── Cross-navigation helpers ─────────────────────────── */

/** Demo slugs that differ from their doc slug counterparts */
const DEMO_TO_DOC: Record<string, string> = {
  linechart: "line-chart",
  barchart: "bar-chart",
  piechart: "pie-chart",
  scatterchart: "scatter-chart",
};

/** Doc slugs that differ from their demo slug counterparts */
const DOC_TO_DEMO: Record<string, string> = {
  "line-chart": "linechart",
  "bar-chart": "barchart",
  "pie-chart": "piechart",
  "scatter-chart": "scatterchart",
};

const KNOWN_DOC_SLUGS = new Set([
  "accordion",
  "alert",
  "avatar",
  "badge",
  "bar-chart",
  "breadcrumb",
  "button",
  "card",
  "chat",
  "checkbox",
  "cine-player",
  "code-block",
  "command-palette",
  "context-menu",
  "date-time-picker",
  "dialog",
  "drawer",
  "dropdown",
  "file-explorer",
  "film-reel",
  "form",
  "header",
  "image-card",
  "indicator",
  "input",
  "label",
  "line-chart",
  "list",
  "masonry",
  "metric-card",
  "mini-player",
  "nav-link",
  "pagination",
  "panel",
  "pie-chart",
  "progress-bar",
  "radio",
  "ribbon-bar",
  "scatter-chart",
  "sidenav",
  "skeleton",
  "slider",
  "spin",
  "split-panel",
  "virtual-list",
  "stat",
  "switch",
  "table",
  "tabs",
  "tag",
  "textbox",
  "timeline",
  "toast",
  "tooltip",
  "tree",
  "typewriter-text",
  "rating",
  "kbd",
  "otp-input",
  "login-panel",
  "rich-text-editor",
]);

const KNOWN_DEMO_SLUGS = new Set([
  "accordion",
  "alert",
  "avatar",
  "badge",
  "barchart",
  "breadcrumb",
  "button",
  "card",
  "chat",
  "checkbox",
  "cine-player",
  "code-block",
  "command-palette",
  "context-menu",
  "date-time-picker",
  "dialog",
  "drawer",
  "dropdown",
  "file-explorer",
  "film-reel",
  "form",
  "header",
  "image-card",
  "indicator",
  "input",
  "label",
  "linechart",
  "list",
  "masonry",
  "metric-card",
  "mini-player",
  "nav-link",
  "pagination",
  "panel",
  "piechart",
  "progress-bar",
  "radio",
  "ribbon-bar",
  "scatterchart",
  "sidenav",
  "skeleton",
  "slider",
  "spin",
  "split-panel",
  "virtual-list",
  "stat",
  "switch",
  "table",
  "tabs",
  "tag",
  "textbox",
  "timeline",
  "toast",
  "tooltip",
  "tree",
  "typewriter-text",
  "rating",
  "kbd",
  "otp-input",
  "login-panel",
  "rich-text-editor",
]);

function useCrossLink(): { href: string; label: string } | null {
  const { pathname } = useLocation();

  if (pathname.startsWith("/docs/")) {
    const docSlug = pathname.replace(/^\/docs\//, "").split("/")[0];
    const demoSlug = DOC_TO_DEMO[docSlug] ?? docSlug;
    if (KNOWN_DEMO_SLUGS.has(demoSlug)) return { href: `/${demoSlug}`, label: "← Demo" };
  } else {
    const demoSlug = pathname.replace(/^\//, "").split("/")[0];
    const docSlug = DEMO_TO_DOC[demoSlug] ?? demoSlug;
    if (KNOWN_DOC_SLUGS.has(docSlug)) return { href: `/docs/${docSlug}`, label: "Docs →" };
  }

  return null;
}

/* ── Exported helpers ─────────────────────────────────── */

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 space-y-3">
      <h3 className="text-sm font-semibold text-primary-500 dark:text-primary-400">{title}</h3>
      {children}
    </section>
  );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  const cross = useCrossLink();
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <h1 className="text-2xl font-bold text-primary-800 dark:text-primary-100">{children}</h1>
      {cross && (
        <NavLink
          href={cross.href}
          size="sm"
          underline="hover"
          external={false}
          className="mt-1.5 shrink-0 rounded-md border border-primary-200 px-2.5 py-1 text-xs font-medium hover:border-primary-400 dark:border-primary-700 dark:hover:border-primary-500"
          onClick={(e) => {
            e.preventDefault();
            navigate(cross.href);
          }}
        >
          {cross.label}
        </NavLink>
      )}
    </div>
  );
}

export function CodeExample({
  code,
  language = "tsx",
}: {
  code: string;
  language?: CodeBlockLanguage;
}) {
  return (
    <div className="mt-3">
      <CodeBlock code={code} language={language} size="sm" />
    </div>
  );
}

/* ── PropTable ────────────────────────────────────────── */

export interface PropRow {
  prop: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export function PropTable({ rows, title }: { rows: PropRow[]; title?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-primary-200 dark:border-primary-700">
      {title && (
        <div className="border-b border-primary-200 bg-primary-50 px-4 py-2 dark:border-primary-700 dark:bg-primary-800">
          <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
            {title}
          </span>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prop</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.prop}>
              <TableCell>
                <code className="rounded bg-primary-100 px-1 py-0.5 font-mono text-xs text-primary-700 dark:bg-primary-800 dark:text-primary-300">
                  {row.prop}
                </code>
              </TableCell>
              <TableCell style={{ maxWidth: "240px" }}>
                <code className="break-words rounded bg-secondary-100 px-1 py-0.5 font-mono text-xs text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300">
                  {row.type}
                </code>
              </TableCell>
              <TableCell className="text-sm text-primary-600 dark:text-primary-400">
                {row.default ?? "—"}
              </TableCell>
              <TableCell className="text-sm">
                {row.required ? (
                  <span className="font-medium text-danger-600 dark:text-danger-400">Yes</span>
                ) : (
                  <span className="text-secondary-500">No</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-primary-700 dark:text-primary-300">
                {row.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
