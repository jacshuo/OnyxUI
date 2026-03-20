import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../Overlay/Dialog";
import { Button } from "../../Primitives/Button";
import {
  File,
  Folder,
  FolderOpen,
  Image,
  Music,
  Video,
  FileText,
  FileCode,
  FileArchive,
  FileSpreadsheet,
  Database,
  Terminal as TerminalIcon,
  X,
  Minus,
  Maximize2,
  Minimize2,
  LayoutGrid,
  LayoutList,
  ChevronRight,
  ArrowUp,
  Info,
  Search,
  FolderUp,
  HardDrive,
  CornerRightDown,
  Trash2,
  AlertTriangle,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */

export interface FileExplorerItem {
  /** File or directory name (including extension). */
  name: string;
  /** Absolute or virtual path. */
  path: string;
  /** Item type. */
  type: "file" | "directory";
  /** Size in bytes (files only). */
  size?: number;
  /** File extension (e.g. '.tsx'). Auto-derived from name if omitted. */
  extension?: string;
  /** Last modified date. */
  modifiedAt?: Date | string;
  /** Creation date. */
  createdAt?: Date | string;
  /** MIME type string. */
  mimeType?: string;
  /** Whether this item is hidden. */
  hidden?: boolean;
}

export type FileExplorerViewMode = "list" | "grid";

export type FileExplorerDockSide = "left" | "right";

/** Toolbar input mode: filter current list or navigate to a path. */
export type FileExplorerInputMode = "search" | "navigate";

/** A custom action shown in the properties panel. */
export interface FileExplorerAction {
  /** Unique key for the action. */
  key: string;
  /** Label displayed on the button. */
  label: string;
  /** Optional lucide icon component. */
  icon?: React.ComponentType<{ className?: string }>;
  /** Called when the action is clicked. */
  onClick: (file: FileExplorerItem) => void;
}

export interface FileExplorerProps {
  /** Files / directories to display. */
  files: FileExplorerItem[];
  /** Window title. @default 'File Explorer' */
  title?: string;
  /** Accent color (any CSS color). @default '#8b5cf6' */
  accent?: string;
  /** Default view mode. @default 'list' */
  defaultView?: FileExplorerViewMode;
  /** Initial window position {x, y}. */
  initialPosition?: { x: number; y: number };
  /** Initial window dimensions (px). */
  initialSize?: { width: number; height: number };
  /** Enable dock-to-edge behaviour. @default false */
  dockable?: boolean;
  /** Which edge to dock to. @default 'right' */
  dockSide?: FileExplorerDockSide;
  /** Whether the explorer starts visible. @default true */
  visible?: boolean;
  /** Called on double-click of a file. */
  onFileOpen?: (file: FileExplorerItem) => void;
  /** Called when selection changes. */
  onSelectionChange?: (files: FileExplorerItem[]) => void;
  /** Called when navigating into a directory. */
  onNavigate?: (path: string) => void;
  /** Called when the user confirms deletion of selected files via the Delete key. */
  onDelete?: (files: FileExplorerItem[]) => void;
  /** Called on close button. */
  onClose?: () => void;
  /** Called on minimize/dock. */
  onMinimize?: () => void;
  /** Called when user presses Enter in navigate mode. Receives the typed path. */
  onPathSubmit?: (path: string) => void;
  /** Default input mode. @default 'search' */
  defaultInputMode?: FileExplorerInputMode;
  /** Custom actions shown in the properties panel. Each receives the inspected file. */
  actions?: FileExplorerAction[];
  /** Whether the window is resizable. @default true */
  resizable?: boolean;
  /** Minimum window size when resizing. @default { width: 400, height: 300 } */
  minSize?: { width: number; height: number };
  /** Extra class on outermost wrapper. */
  className?: string;
}

/* ═══════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════ */

function getExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(i).toLowerCase() : "";
}

function formatSize(bytes?: number): string {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(d?: Date | string): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  // Images
  ".png": Image,
  ".jpg": Image,
  ".jpeg": Image,
  ".gif": Image,
  ".svg": Image,
  ".webp": Image,
  ".ico": Image,
  ".bmp": Image,
  // Audio
  ".mp3": Music,
  ".wav": Music,
  ".flac": Music,
  ".ogg": Music,
  ".aac": Music,
  ".m4a": Music,
  // Video
  ".mp4": Video,
  ".mkv": Video,
  ".avi": Video,
  ".mov": Video,
  ".wmv": Video,
  ".webm": Video,
  // Code
  ".ts": FileCode,
  ".tsx": FileCode,
  ".js": FileCode,
  ".jsx": FileCode,
  ".json": FileCode,
  ".html": FileCode,
  ".css": FileCode,
  ".scss": FileCode,
  ".py": FileCode,
  ".rs": FileCode,
  ".go": FileCode,
  ".java": FileCode,
  ".c": FileCode,
  ".cpp": FileCode,
  ".h": FileCode,
  ".sh": TerminalIcon,
  ".bat": TerminalIcon,
  ".ps1": TerminalIcon,
  // Documents
  ".md": FileText,
  ".txt": FileText,
  ".pdf": FileText,
  ".doc": FileText,
  ".docx": FileText,
  ".rtf": FileText,
  // Data
  ".csv": FileSpreadsheet,
  ".xls": FileSpreadsheet,
  ".xlsx": FileSpreadsheet,
  ".db": Database,
  ".sqlite": Database,
  ".sql": Database,
  // Archives
  ".zip": FileArchive,
  ".tar": FileArchive,
  ".gz": FileArchive,
  ".rar": FileArchive,
  ".7z": FileArchive,
};

function getFileIcon(item: FileExplorerItem): React.ComponentType<{ className?: string }> {
  if (item.type === "directory") return Folder;
  const ext = item.extension || getExtension(item.name);
  return ICON_MAP[ext] || File;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

/* ═══════════════════════════════════════════════════════════
   FileExplorer
   ═══════════════════════════════════════════════════════════ */

export function FileExplorer({
  files,
  title = "File Explorer",
  accent = "#8b5cf6",
  defaultView = "list",
  initialPosition,
  initialSize,
  dockable = false,
  dockSide = "right",
  visible: visibleProp = true,
  onFileOpen,
  onSelectionChange,
  onNavigate,
  onDelete,
  onClose,
  onMinimize,
  onPathSubmit,
  defaultInputMode = "search",
  actions,
  resizable = true,
  minSize = { width: 400, height: 300 },
  className,
}: FileExplorerProps) {
  /* ── State ────────────────────────────── */
  const [viewMode, setViewMode] = useState<FileExplorerViewMode>(defaultView);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [inspectedIndex, setInspectedIndex] = useState<number | null>(null);
  const [maximized, setMaximized] = useState(false);
  const [docked, setDocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputMode, setInputMode] = useState<FileExplorerInputMode>(defaultInputMode);
  const [internalVisible, setInternalVisible] = useState(visibleProp);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Position & size – default to viewport center (mobile-aware)
  const isMobileViewport = window.innerWidth < 640;
  const defaultSize =
    initialSize ??
    (isMobileViewport
      ? { width: window.innerWidth - 16, height: window.innerHeight - 48 }
      : { width: 720, height: 520 });
  const [pos, setPos] = useState(
    initialPosition ??
      (isMobileViewport
        ? { x: 8, y: 24 }
        : {
            x: Math.max(0, Math.round((window.innerWidth - defaultSize.width) / 2)),
            y: Math.max(0, Math.round((window.innerHeight - defaultSize.height) / 2)),
          }),
  );
  const [size, setSize] = useState(defaultSize);
  const [preMaxState, setPreMaxState] = useState<{
    pos: { x: number; y: number };
    size: { width: number; height: number };
  } | null>(null);

  // Dragging
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Resizing
  const resizing = useRef<string | false>(false);
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0, px: 0, py: 0 });

  const visible = visibleProp !== undefined ? visibleProp : internalVisible;

  /* ── Derived data ─────────────────────── */
  const sortedFiles = useMemo(() => {
    const dirs = files.filter((f) => f.type === "directory");
    const fls = files.filter((f) => f.type === "file");
    dirs.sort((a, b) => a.name.localeCompare(b.name));
    fls.sort((a, b) => a.name.localeCompare(b.name));
    return [...dirs, ...fls];
  }, [files]);

  const filteredFiles = useMemo(() => {
    if (inputMode !== "search" || !searchQuery.trim()) return sortedFiles;
    const q = searchQuery.toLowerCase();
    return sortedFiles.filter((f) => f.name.toLowerCase().includes(q));
  }, [sortedFiles, searchQuery, inputMode]);

  const inspectedFile = inspectedIndex != null ? filteredFiles[inspectedIndex] : null;

  /* ── Selection ────────────────────────── */
  const handleSelect = useCallback((index: number, e: React.MouseEvent) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (e.ctrlKey || e.metaKey) {
        if (next.has(index)) next.delete(index);
        else next.add(index);
      } else {
        next.clear();
        next.add(index);
      }
      return next;
    });
    setInspectedIndex(index);
  }, []);

  // Fire selection callback
  useEffect(() => {
    if (!onSelectionChange) return;
    const items = Array.from(selected)
      .map((i) => filteredFiles[i])
      .filter(Boolean);
    onSelectionChange(items);
  }, [selected]);

  const handleDoubleClick = useCallback(
    (index: number) => {
      const item = filteredFiles[index];
      if (!item) return;
      if (item.type === "directory") {
        onNavigate?.(item.path);
      } else {
        onFileOpen?.(item);
      }
    },
    [filteredFiles, onFileOpen, onNavigate],
  );

  /* ── Dragging ─────────────────────────── */
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (maximized) return;
      // Don't drag on button clicks
      if ((e.target as HTMLElement).closest("button")) return;
      dragging.current = true;
      dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      e.preventDefault();
    },
    [pos, maximized],
  );

  const handleTouchDragStart = useCallback(
    (e: React.TouchEvent) => {
      if (maximized) return;
      if ((e.target as HTMLElement).closest("button")) return;
      const touch = e.touches[0];
      dragging.current = true;
      dragOffset.current = { x: touch.clientX - pos.x, y: touch.clientY - pos.y };
    },
    [pos, maximized],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 40;
      setPos({
        x: clamp(e.clientX - dragOffset.current.x, 0, maxX),
        y: clamp(e.clientY - dragOffset.current.y, 0, maxY),
      });
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 40;
      setPos({
        x: clamp(touch.clientX - dragOffset.current.x, 0, maxX),
        y: clamp(touch.clientY - dragOffset.current.y, 0, maxY),
      });
    };
    const onUp = () => {
      dragging.current = false;
      resizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  /* ── Resizing ──────────────────────────── */
  const handleResizeStart = useCallback(
    (edge: string, e: React.MouseEvent) => {
      if (maximized) return;
      e.preventDefault();
      e.stopPropagation();
      resizing.current = edge;
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        w: size.width,
        h: size.height,
        px: pos.x,
        py: pos.y,
      };
      document.body.style.cursor =
        edge === "e" || edge === "w"
          ? "ew-resize"
          : edge === "n" || edge === "s"
            ? "ns-resize"
            : edge === "nw" || edge === "se"
              ? "nwse-resize"
              : "nesw-resize";
      document.body.style.userSelect = "none";
    },
    [maximized, size, pos],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!resizing.current) return;
      const edge = resizing.current;
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      let { w, h, px, py } = resizeStart.current;

      if (edge.includes("e")) w = Math.max(minSize.width, w + dx);
      if (edge.includes("w")) {
        const nw = Math.max(minSize.width, w - dx);
        px = px + (w - nw);
        w = nw;
      }
      if (edge.includes("s")) h = Math.max(minSize.height, h + dy);
      if (edge.includes("n")) {
        const nh = Math.max(minSize.height, h - dy);
        py = py + (h - nh);
        h = nh;
      }
      setSize({ width: w, height: h });
      setPos({ x: px, y: py });
    };
    const onUp = () => {
      resizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [minSize]);

  /* ── Maximize / Restore ───────────────── */
  const toggleMaximize = useCallback(() => {
    if (maximized) {
      if (preMaxState) {
        setPos(preMaxState.pos);
        setSize(preMaxState.size);
      }
      setMaximized(false);
    } else {
      setPreMaxState({ pos, size });
      setMaximized(true);
    }
  }, [maximized, pos, size, preMaxState]);

  /* ── Dock / Undock ────────────────────── */
  const toggleDock = useCallback(() => {
    if (docked) {
      setDocked(false);
    } else {
      if (maximized) {
        setMaximized(false);
        if (preMaxState) {
          setPos(preMaxState.pos);
          setSize(preMaxState.size);
        }
      }
      setDocked(true);
      onMinimize?.();
    }
  }, [docked, maximized, preMaxState, onMinimize]);

  /* ── Keyboard ─────────────────────────── */
  useEffect(() => {
    if (!visible || docked) return;
    const onKey = (e: KeyboardEvent) => {
      // Only handle when explorer is focused
      if (
        !windowRef.current?.contains(document.activeElement) &&
        document.activeElement !== windowRef.current
      )
        return;
      if (e.key === "Escape") {
        setInspectedIndex(null);
        setSelected(new Set());
      }
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        const all = new Set(filteredFiles.map((_, i) => i));
        setSelected(all);
      }
      if (e.key === "Delete" && selected.size > 0 && onDelete) {
        e.preventDefault();
        setDeleteConfirmOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, docked, filteredFiles, selected, onDelete]);

  /* ── Style vars ───────────────────────── */
  const cssVars = { "--fe-accent": accent } as React.CSSProperties;

  /* ═══════════════════════════════════════
     Dock strip
     ═══════════════════════════════════════ */
  if (docked) {
    return (
      <div
        className={cn(
          "fixed z-100 cursor-pointer transition-all duration-300",
          dockSide === "right"
            ? "right-0 top-1/2 -translate-y-1/2"
            : "left-0 top-1/2 -translate-y-1/2",
        )}
        style={cssVars}
        onClick={() => setDocked(false)}
        title={`Restore ${title}`}
      >
        <div
          className="fe-dock flex items-center gap-1.5 rounded-l-lg px-2 py-3 backdrop-blur-md"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          <HardDrive className="h-3.5 w-3.5 text-(--fe-accent)" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-(--fe-text)">
            {title}
          </span>
        </div>
      </div>
    );
  }

  if (!visible) return null;

  /* narrow: properties panel overlays content instead of shrinking file list */
  const panelNarrow = size.width < 500;

  /* ═══════════════════════════════════════
     Main window
     ═══════════════════════════════════════ */
  return (
    <div
      ref={windowRef}
      className={cn(
        "fe-window fixed z-100 flex flex-col overflow-hidden",
        "rounded-xl border border-(--fe-border)",
        "animate-[fe-window-in_0.35s_cubic-bezier(0.16,1,0.3,1)_both]",
        maximized && "rounded-none",
        className,
      )}
      style={{
        ...cssVars,
        left: maximized ? 0 : pos.x,
        top: maximized ? 0 : pos.y,
        width: maximized ? "100vw" : size.width,
        height: maximized ? "100vh" : size.height,
        transition: maximized ? "left 0.3s, top 0.3s, width 0.3s, height 0.3s" : undefined,
      }}
      tabIndex={0}
    >
      {/* ── Title bar ──────────────────── */}
      <div
        className="fe-titlebar group/titlebar flex h-10 shrink-0 cursor-grab items-center justify-between px-3 select-none active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onTouchStart={handleTouchDragStart}
        onDoubleClick={toggleMaximize}
      >
        {/* Left: icon + title */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-5 w-5 items-center justify-center rounded"
            style={{ background: `color-mix(in srgb, var(--fe-accent) 25%, transparent)` }}
          >
            <HardDrive className="h-3 w-3 text-(--fe-accent)" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-(--fe-text)">
            {title}
          </span>
          {/* Decorative scan line */}
          <div
            className="ml-2 hidden h-px w-20 md:block"
            style={{
              background: `linear-gradient(90deg, var(--fe-accent), transparent)`,
              opacity: 0.3,
            }}
          />
        </div>

        {/* Right: window buttons */}
        <div className="flex items-center gap-0.5">
          {/* View toggle */}
          <button
            className="fe-btn mr-1"
            onClick={() => setViewMode((v) => (v === "list" ? "grid" : "list"))}
            title={viewMode === "list" ? "Grid view" : "List view"}
          >
            {viewMode === "list" ? (
              <LayoutGrid className="h-3.5 w-3.5" />
            ) : (
              <LayoutList className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Minimize / dock */}
          {dockable && (
            <button className="fe-btn" onClick={toggleDock} title="Dock to edge">
              <Minus className="h-3.5 w-3.5" />
            </button>
          )}
          {/* Maximize */}
          <button
            className="fe-btn"
            onClick={toggleMaximize}
            title={maximized ? "Restore" : "Maximize"}
          >
            {maximized ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
          {/* Close */}
          <button
            className="fe-btn hover:bg-red-500/40! hover:text-red-300!"
            onClick={() => {
              onClose?.();
              setInternalVisible(false);
            }}
            title="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Toolbar / address bar ──────── */}
      <div className="fe-toolbar flex h-9 shrink-0 items-center gap-2 px-3">
        <button className="fe-btn p-1" onClick={() => onNavigate?.("..")} title="Go up">
          <FolderUp className="h-3.5 w-3.5" />
        </button>

        {/* Mode toggle */}
        <button
          className="fe-btn shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={
            inputMode === "navigate"
              ? {
                  color: "var(--fe-accent)",
                  background: "color-mix(in srgb, var(--fe-accent) 15%, transparent)",
                }
              : undefined
          }
          onClick={() => setInputMode((m) => (m === "search" ? "navigate" : "search"))}
          title={inputMode === "search" ? "Switch to path navigation" : "Switch to file search"}
        >
          {inputMode === "search" ? (
            <Search className="h-3 w-3" />
          ) : (
            <CornerRightDown className="h-3 w-3" />
          )}
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                if (inputMode === "navigate") {
                  if (onPathSubmit) {
                    onPathSubmit(searchQuery.trim());
                  } else {
                    onNavigate?.(searchQuery.trim());
                  }
                }
                // In search mode, filtering is already live — Enter is a no-op
              }
            }}
            placeholder={inputMode === "search" ? "Search files…" : "Enter path and press Enter…"}
            className="h-6 w-full rounded border border-(--fe-input-border) bg-(--fe-input-bg) px-2 text-[11px] text-(--fe-text-strong) placeholder:text-(--fe-text-muted) outline-none transition-colors focus:border-(--fe-accent)/40 focus:bg-(--fe-input-bg)"
          />
        </div>
        <span className="shrink-0 font-mono text-[10px] text-(--fe-text-muted)">
          {filteredFiles.length} item{filteredFiles.length !== 1 ? "s" : ""}
          {selected.size > 0 && ` · ${selected.size} selected`}
        </span>
      </div>

      {/* ── Content area ───────────────── */}
      <div className="relative flex flex-1 min-h-0">
        {/* File list/grid */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden p-1.5"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelected(new Set());
              setInspectedIndex(null);
            }
          }}
        >
          {filteredFiles.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-(--fe-text-muted)">
              <Folder className="mb-2 h-10 w-10" />
              <span className="text-xs">No files found</span>
            </div>
          ) : viewMode === "list" ? (
            /* ── List view ─────────────── */
            <div className="space-y-px">
              {filteredFiles.map((item, i) => {
                const Icon = getFileIcon(item);
                const isSelected = selected.has(i);
                const ext = item.extension || getExtension(item.name);
                return (
                  <div
                    key={item.path + i}
                    className={cn(
                      "fe-item group/item flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-(--fe-text) transition-all duration-150 cursor-pointer",
                      isSelected
                        ? "bg-(--fe-accent)/15 text-(--fe-text-strong)"
                        : "hover:bg-(--fe-surface-hover) hover:text-(--fe-text-strong)",
                    )}
                    style={isSelected ? { boxShadow: `inset 2px 0 0 var(--fe-accent)` } : undefined}
                    onClick={(e) => handleSelect(i, e)}
                    onDoubleClick={() => handleDoubleClick(i)}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        item.type === "directory" ? "text-(--fe-accent)" : "text-(--fe-text-muted)",
                      )}
                    />
                    <span className="flex-1 truncate text-xs font-medium">{item.name}</span>
                    {ext && item.type === "file" && (
                      <span className="shrink-0 rounded bg-(--fe-badge-bg) px-1.5 py-0.5 font-mono text-[9px] uppercase text-(--fe-text-muted)">
                        {ext}
                      </span>
                    )}
                    {item.size != null && (
                      <span className="shrink-0 font-mono text-[10px] text-(--fe-text-muted)">
                        {formatSize(item.size)}
                      </span>
                    )}
                    {item.modifiedAt && (
                      <span className="hidden shrink-0 font-mono text-[10px] text-(--fe-text-muted) lg:inline">
                        {formatDate(item.modifiedAt)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Grid view ─────────────── */
            <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-1.5 p-1">
              {filteredFiles.map((item, i) => {
                const Icon = getFileIcon(item);
                const isSelected = selected.has(i);
                const ext = item.extension || getExtension(item.name);
                return (
                  <div
                    key={item.path + i}
                    className={cn(
                      "fe-item group/item flex cursor-pointer flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-center transition-all duration-150",
                      isSelected
                        ? "bg-(--fe-accent)/15 text-(--fe-text-strong) ring-1 ring-(--fe-accent)/30"
                        : "text-(--fe-text) hover:bg-(--fe-surface-hover) hover:text-(--fe-text-strong)",
                    )}
                    onClick={(e) => handleSelect(i, e)}
                    onDoubleClick={() => handleDoubleClick(i)}
                  >
                    <Icon
                      className={cn(
                        "h-7 w-7",
                        item.type === "directory" ? "text-(--fe-accent)" : "text-(--fe-text-muted)",
                      )}
                    />
                    <span className="w-full truncate text-[10px] font-medium leading-tight">
                      {item.name}
                    </span>
                    {ext && item.type === "file" && (
                      <span className="font-mono text-[8px] uppercase text-(--fe-text-muted)">
                        {ext}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Properties panel ──────────── */}
        <div
          className={cn(
            "overflow-hidden transition-[width,opacity] duration-300 ease-out",
            panelNarrow
              ? cn(
                  "absolute right-0 top-0 bottom-0 z-10",
                  inspectedFile ? "w-44 opacity-100" : "w-0 opacity-0 pointer-events-none",
                )
              : cn("shrink-0", inspectedFile ? "w-56" : "w-0"),
          )}
        >
          {inspectedFile && (
            <div
              className={cn(
                "fe-panel flex h-full flex-col border-l border-(--fe-border) p-4",
                panelNarrow ? "w-44" : "w-56",
              )}
            >
              {panelNarrow && (
                <button
                  className="fe-btn mb-2 self-end"
                  onClick={() => {
                    setInspectedIndex(null);
                    setSelected(new Set());
                  }}
                  title="Close panel"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              {/* File icon large */}
              <div className="mb-3 flex flex-col items-center">
                {React.createElement(getFileIcon(inspectedFile), {
                  className: cn(
                    "h-10 w-10 mb-2",
                    inspectedFile.type === "directory"
                      ? "text-(--fe-accent)"
                      : "text-(--fe-text-muted)",
                  ),
                })}
                <span className="w-full text-center text-xs font-semibold text-(--fe-text-strong) break-all leading-tight">
                  {inspectedFile.name}
                </span>
              </div>

              {/* Info grid */}
              <div className="space-y-2.5 text-[10px]">
                <InfoRow
                  label="Type"
                  value={
                    inspectedFile.type === "directory"
                      ? "Directory"
                      : inspectedFile.mimeType ||
                        inspectedFile.extension ||
                        getExtension(inspectedFile.name) ||
                        "File"
                  }
                />
                {inspectedFile.size != null && (
                  <InfoRow label="Size" value={formatSize(inspectedFile.size)} />
                )}
                <InfoRow label="Path" value={inspectedFile.path} mono />
                {inspectedFile.extension && (
                  <InfoRow label="Extension" value={inspectedFile.extension} />
                )}
                {inspectedFile.modifiedAt && (
                  <InfoRow label="Modified" value={formatDate(inspectedFile.modifiedAt)} />
                )}
                {inspectedFile.createdAt && (
                  <InfoRow label="Created" value={formatDate(inspectedFile.createdAt)} />
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-auto flex flex-col gap-1.5">
                {inspectedFile.type === "file" && onFileOpen && (
                  <button
                    className="flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[10px] font-semibold uppercase tracking-wider text-(--fe-text-strong) transition-colors"
                    style={{
                      background: `color-mix(in srgb, var(--fe-accent) 20%, transparent)`,
                      border: `1px solid color-mix(in srgb, var(--fe-accent) 30%, transparent)`,
                    }}
                    onClick={() => onFileOpen(inspectedFile)}
                  >
                    <ArrowUp className="h-3 w-3 rotate-45" />
                    Open
                  </button>
                )}
                {actions?.map((action) => (
                  <button
                    key={action.key}
                    className="fe-action flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[10px] font-semibold uppercase tracking-wider text-(--fe-text) transition-colors hover:text-(--fe-text-strong)"
                    onClick={() => action.onClick(inspectedFile)}
                  >
                    {action.icon && React.createElement(action.icon, { className: "h-3 w-3" })}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Status bar ─────────────────── */}
      <div className="fe-statusbar flex h-6 shrink-0 items-center justify-between px-3 text-[9px] font-mono text-(--fe-text-muted)">
        <span>{filteredFiles.length} items</span>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <span className="text-(--fe-accent)/70">{selected.size} selected</span>
          )}
          <span className="opacity-50">Ctrl+Click multi-select · Esc clear</span>
        </div>
      </div>

      {/* ── Resize handles ─────────────── */}
      {resizable && !maximized && (
        <>
          {/* edges */}
          <div
            className="absolute top-0 left-2 right-2 h-1.5 cursor-ns-resize"
            onMouseDown={(e) => handleResizeStart("n", e)}
          />
          <div
            className="absolute bottom-0 left-2 right-2 h-1.5 cursor-ns-resize"
            onMouseDown={(e) => handleResizeStart("s", e)}
          />
          <div
            className="absolute top-2 left-0 bottom-2 w-1.5 cursor-ew-resize"
            onMouseDown={(e) => handleResizeStart("w", e)}
          />
          <div
            className="absolute top-2 right-0 bottom-2 w-1.5 cursor-ew-resize"
            onMouseDown={(e) => handleResizeStart("e", e)}
          />
          {/* corners */}
          <div
            className="absolute top-0 left-0 h-3 w-3 cursor-nwse-resize"
            onMouseDown={(e) => handleResizeStart("nw", e)}
          />
          <div
            className="absolute top-0 right-0 h-3 w-3 cursor-nesw-resize"
            onMouseDown={(e) => handleResizeStart("ne", e)}
          />
          <div
            className="absolute bottom-0 left-0 h-3 w-3 cursor-nesw-resize"
            onMouseDown={(e) => handleResizeStart("sw", e)}
          />
          <div
            className="absolute bottom-0 right-0 h-3 w-3 cursor-nwse-resize"
            onMouseDown={(e) => handleResizeStart("se", e)}
          />
        </>
      )}

      {/* ── Scoped styles ──────────────── */}
      <style>{`
        .fe-window {
          background: var(--fe-bg);
          box-shadow: var(--fe-shadow);
        }
        .fe-titlebar {
          background: linear-gradient(90deg, color-mix(in srgb, var(--fe-accent) 6%, transparent), transparent 60%);
          border-bottom: 1px solid var(--fe-border);
        }
        .fe-toolbar {
          border-bottom: 1px solid var(--fe-border);
          background: var(--fe-surface);
        }
        .fe-panel {
          background: var(--fe-surface);
        }
        .fe-statusbar {
          border-top: 1px solid var(--fe-border);
          background: var(--fe-surface);
        }
        .fe-dock {
          background: var(--fe-dock-bg);
          border-left: 2px solid var(--fe-accent);
          box-shadow: var(--fe-dock-shadow);
        }
        .fe-action {
          background: var(--fe-surface-hover);
          border: 1px solid var(--fe-border);
        }
        .fe-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          border-radius: 6px;
          color: var(--fe-btn-color);
          transition: color 0.15s, background 0.15s, transform 0.1s;
        }
        .fe-btn:hover {
          color: var(--fe-btn-hover);
          background: var(--fe-btn-hover-bg);
        }
        .fe-btn:active { transform: scale(0.9); }
        .fe-item {
          animation: fe-item-in 0.25s ease-out both;
        }
        @keyframes fe-window-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fe-item-in {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* ── Delete confirmation dialog ── */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>
              <AlertTriangle className="text-danger-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              {selected.size === 1
                ? `Are you sure you want to delete "${filteredFiles[Array.from(selected)[0]]?.name}"?`
                : `Are you sure you want to delete ${selected.size} selected items?`}{" "}
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button intent="ghost" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              intent="danger"
              onClick={() => {
                const items = Array.from(selected)
                  .map((i) => filteredFiles[i])
                  .filter(Boolean);
                onDelete?.(items);
                setSelected(new Set());
                setInspectedIndex(null);
                setDeleteConfirmOpen(false);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ── Small helper component ─────────────── */

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="mb-0.5 font-semibold uppercase tracking-wider text-(--fe-text-muted)">
        {label}
      </div>
      <div
        className={cn("text-(--fe-text) break-all leading-snug", mono && "font-mono text-[9px]")}
      >
        {value}
      </div>
    </div>
  );
}
