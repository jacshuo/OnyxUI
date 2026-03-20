import React from "react";
import {
  CodeBlock,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  type CodeBlockLanguage,
} from "../../src";

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 space-y-3">
      <h3 className="text-sm font-semibold text-primary-500 dark:text-primary-400">{title}</h3>
      {children}
    </section>
  );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mb-6 text-2xl font-bold text-primary-800 dark:text-primary-100">{children}</h1>
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
