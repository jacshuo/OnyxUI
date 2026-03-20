import { useState, useMemo } from "react";
import { FileExplorer, type FileExplorerItem, type FileExplorerAction } from "../../src";
import { Download, Clipboard, Trash2, Share2 } from "lucide-react";
import { CodeExample } from "./helpers";

/* ── Sample file tree ──────────────────────────────────── */
const sampleFiles: FileExplorerItem[] = [
  { name: "src", path: "/project/src", type: "directory", modifiedAt: "2026-03-15T10:30:00" },
  {
    name: "node_modules",
    path: "/project/node_modules",
    type: "directory",
    hidden: true,
    modifiedAt: "2026-03-10T08:00:00",
  },
  { name: "dist", path: "/project/dist", type: "directory", modifiedAt: "2026-03-17T14:20:00" },
  { name: "public", path: "/project/public", type: "directory", modifiedAt: "2026-02-28T09:00:00" },
  {
    name: ".github",
    path: "/project/.github",
    type: "directory",
    modifiedAt: "2026-01-20T12:00:00",
  },
  {
    name: "package.json",
    path: "/project/package.json",
    type: "file",
    size: 1842,
    extension: ".json",
    modifiedAt: "2026-03-17T16:45:00",
    createdAt: "2025-11-01T08:00:00",
    mimeType: "application/json",
  },
  {
    name: "tsconfig.json",
    path: "/project/tsconfig.json",
    type: "file",
    size: 523,
    extension: ".json",
    modifiedAt: "2026-03-01T11:20:00",
    mimeType: "application/json",
  },
  {
    name: "README.md",
    path: "/project/README.md",
    type: "file",
    size: 4096,
    extension: ".md",
    modifiedAt: "2026-03-16T09:15:00",
    mimeType: "text/markdown",
  },
  {
    name: "LICENSE",
    path: "/project/LICENSE",
    type: "file",
    size: 1070,
    modifiedAt: "2025-11-01T08:00:00",
    mimeType: "text/plain",
  },
  {
    name: "vite.config.ts",
    path: "/project/vite.config.ts",
    type: "file",
    size: 890,
    extension: ".ts",
    modifiedAt: "2026-03-14T17:30:00",
    mimeType: "text/typescript",
  },
  {
    name: "index.html",
    path: "/project/index.html",
    type: "file",
    size: 456,
    extension: ".html",
    modifiedAt: "2026-03-12T10:00:00",
    mimeType: "text/html",
  },
  {
    name: "postcss.config.cjs",
    path: "/project/postcss.config.cjs",
    type: "file",
    size: 120,
    extension: ".cjs",
    modifiedAt: "2026-03-10T14:00:00",
    mimeType: "application/javascript",
  },
  {
    name: "hero-banner.png",
    path: "/project/public/hero-banner.png",
    type: "file",
    size: 245_760,
    extension: ".png",
    modifiedAt: "2026-03-08T11:30:00",
    mimeType: "image/png",
  },
  {
    name: "background.mp3",
    path: "/project/public/background.mp3",
    type: "file",
    size: 3_145_728,
    extension: ".mp3",
    modifiedAt: "2026-02-20T15:00:00",
    mimeType: "audio/mpeg",
  },
  {
    name: "demo.mp4",
    path: "/project/public/demo.mp4",
    type: "file",
    size: 15_728_640,
    extension: ".mp4",
    modifiedAt: "2026-03-05T16:45:00",
    mimeType: "video/mp4",
  },
  {
    name: "data-export.csv",
    path: "/project/data-export.csv",
    type: "file",
    size: 8_320,
    extension: ".csv",
    modifiedAt: "2026-03-18T08:00:00",
    mimeType: "text/csv",
  },
  {
    name: "archive.zip",
    path: "/project/archive.zip",
    type: "file",
    size: 52_428_800,
    extension: ".zip",
    modifiedAt: "2026-03-01T20:00:00",
    mimeType: "application/zip",
  },
  {
    name: "schema.sql",
    path: "/project/schema.sql",
    type: "file",
    size: 12_400,
    extension: ".sql",
    modifiedAt: "2026-02-15T13:30:00",
    mimeType: "application/sql",
  },
  {
    name: "deploy.sh",
    path: "/project/deploy.sh",
    type: "file",
    size: 780,
    extension: ".sh",
    modifiedAt: "2026-03-11T09:00:00",
    mimeType: "application/x-sh",
  },
  {
    name: ".env.local",
    path: "/project/.env.local",
    type: "file",
    size: 210,
    hidden: true,
    modifiedAt: "2026-03-17T10:00:00",
    mimeType: "text/plain",
  },
];

const ACCENTS = [
  ["#8b5cf6", "Violet"],
  ["#3b82f6", "Blue"],
  ["#10b981", "Emerald"],
  ["#f43f5e", "Rose"],
  ["#f59e0b", "Amber"],
  ["#06b6d4", "Cyan"],
] as const;

export default function FileExplorerPage() {
  const [log, setLog] = useState<string[]>([]);
  const [accent, setAccent] = useState("#8b5cf6");
  const [visible, setVisible] = useState(true);

  const addLog = (msg: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-100">FileExplorer</h1>
        <p className="mt-1 text-sm text-primary-500 dark:text-primary-400">
          A sci-fi themed file explorer with drag, dock-to-edge, maximize, list/grid view,
          multi-select, and file properties.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-mono">
          {[
            ["Click", "Select"],
            ["Ctrl+Click", "Multi-select"],
            ["Double-click", "Open / Navigate"],
            ["Ctrl+A", "Select all"],
            ["Esc", "Clear selection"],
            ["Delete", "Delete selected"],
            ["Drag title", "Move window"],
            ["Drag edges", "Resize window"],
            ["Mode toggle", "Search ↔ Navigate"],
          ].map(([key, desc]) => (
            <span
              key={key}
              className="rounded bg-primary-200 px-2 py-0.5 text-primary-600 dark:bg-primary-700 dark:text-primary-300"
            >
              <span className="font-semibold">{key}</span> {desc}
            </span>
          ))}
        </div>

        {/* Accent + controls */}
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
              Accent:
            </span>
            {ACCENTS.map(([color, name]) => (
              <button
                key={color}
                className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${accent === color ? "border-white scale-110 ring-2 ring-primary-400" : "border-transparent"}`}
                style={{ backgroundColor: color }}
                onClick={() => setAccent(color)}
                title={name}
              />
            ))}
          </div>

          {!visible && (
            <button
              className="rounded-lg bg-primary-200 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-300 dark:bg-primary-700 dark:text-primary-300 dark:hover:bg-primary-600"
              onClick={() => setVisible(true)}
            >
              Show Explorer
            </button>
          )}
        </div>
      </div>

      {/* ── Explorer instance ────────────── */}
      <FileExplorer
        files={sampleFiles}
        title="Project Files"
        accent={accent}
        defaultView="list"
        dockable
        visible={visible}
        onFileOpen={(f) => addLog(`📂 Open: "${f.name}" (${f.path})`)}
        onSelectionChange={(items) => {
          if (items.length > 0) addLog(`✓ Selected: ${items.map((f) => f.name).join(", ")}`);
        }}
        onNavigate={(path) => addLog(`→ Navigate: ${path}`)}
        onPathSubmit={(path) => addLog(`⏎ Path submitted: ${path}`)}
        onClose={() => {
          setVisible(false);
          addLog("✕ Closed");
        }}
        onMinimize={() => addLog("⊟ Docked to edge")}
        onDelete={(items) => addLog(`🗑 Deleted: ${items.map((f) => f.name).join(", ")}`)}
        actions={[
          {
            key: "copy-path",
            label: "Copy Path",
            icon: Clipboard,
            onClick: (f) => addLog(`📋 Copy path: ${f.path}`),
          },
          {
            key: "download",
            label: "Download",
            icon: Download,
            onClick: (f) => addLog(`⬇ Download: ${f.name}`),
          },
          {
            key: "share",
            label: "Share",
            icon: Share2,
            onClick: (f) => addLog(`🔗 Share: ${f.name}`),
          },
          {
            key: "delete",
            label: "Delete",
            icon: Trash2,
            onClick: (f) => addLog(`🗑 Delete: ${f.name}`),
          },
        ]}
      />

      {/* ── Usage example ───────────────────────────── */}
      <CodeExample
        code={`<FileExplorer
  files={files}
  title="Project Files"
  accent="#8b5cf6"
  defaultView="list"
  dockable
  visible={visible}
  onFileOpen={(f) => console.log("open", f.path)}
  onSelectionChange={(items) => console.log("selected", items)}
  onClose={() => setVisible(false)}
  onDelete={(items) => console.log("delete", items)}
  actions={[
    { key: "download", label: "Download", icon: Download, onClick: (f) => download(f) },
  ]}
/>`}
      />

      {/* ── Event log ───────────────────── */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-primary-700 dark:text-primary-300">
          Event Log
        </h3>
        <div className="h-40 overflow-y-auto rounded-lg border border-primary-200 bg-primary-50 p-3 font-mono text-xs text-primary-600 dark:border-primary-700 dark:bg-primary-900/50 dark:text-primary-400">
          {log.length === 0 ? (
            <span className="italic opacity-50">Interact with the explorer to see events…</span>
          ) : (
            log.map((l, i) => <div key={i}>{l}</div>)
          )}
        </div>
      </div>
    </div>
  );
}
