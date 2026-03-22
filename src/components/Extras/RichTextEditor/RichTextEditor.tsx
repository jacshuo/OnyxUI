import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Video as VideoIcon,
  Table as TableIcon,
  Code,
  Quote,
  Minus,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Eraser,
  Eye,
  EyeOff,
  Type,
  FileText,
  Undo2,
  Redo2,
  Palette,
  Search,
  Replace,
  X,
  ChevronUp,
  ChevronDown,
  Sun,
  Moon,
  Save,
  BetweenHorizontalStart,
  BetweenHorizontalEnd,
  BetweenVerticalStart,
  BetweenVerticalEnd,
  TableCellsMerge,
  TableCellsSplit,
  Trash2,
} from "lucide-react";
import { RibbonBar } from "../../Navigation/RibbonBar";
import type { RibbonTab } from "../../Navigation/RibbonBar";
import { Switch } from "../../Primitives/Switch";
import { cn } from "../../../lib/utils";
import { useRichEditor } from "./RichTextEditor.hooks";
import { searchPluginKey } from "./RichTextEditor.hooks";
import {
  parseMarkdown,
  htmlToMarkdown,
  countWords,
  findMatchesInText,
} from "./RichTextEditor.utils";
import type {
  RichTextEditorProps,
  RichTextEditorHandle,
  RichEditorMode,
  RichTextEditorLabels,
} from "./types";
import "./RichTextEditor.css";

/* ── Default i18n labels (English) ───────────── */
const DEFAULT_LABELS: RichTextEditorLabels = {
  tab_home: "Home",
  tab_insert: "Insert",
  tab_format: "Format",

  group_clipboard: "Clipboard",
  undo: "Undo",
  redo: "Redo",
  save: "Save",

  group_text: "Text",
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  strikethrough: "Strikethrough",

  group_headings: "Headings",
  h1: "H1",
  h2: "H2",
  h3: "H3",
  paragraph: "Normal",

  group_alignment: "Alignment",
  alignLeft: "Left",
  alignCenter: "Center",
  alignRight: "Right",
  alignJustify: "Justify",

  group_lists: "Lists",
  bulletList: "Bullet",
  orderedList: "Ordered",

  group_media: "Media",
  image: "Image",
  video: "Video",
  youtube: "Video", // backward-compat alias

  group_content: "Content",
  link: "Link",
  table: "Table",
  codeBlock: "Code Block",
  blockquote: "Quote",
  divider: "Divider",

  group_style: "Style",
  color: "Color",
  highlight: "Highlight",
  subscript: "Sub",
  superscript: "Sup",

  group_reset: "Reset",
  clear: "Clear",

  group_table_rows: "Rows",
  addRowBefore: "Add Above",
  addRowAfter: "Add Below",
  deleteRow: "Del Row",

  group_table_cols: "Columns",
  addColBefore: "Add Left",
  addColAfter: "Add Right",
  deleteColumn: "Del Col",

  group_table_cells: "Cells",
  mergeCells: "Merge",
  splitCell: "Split",
  deleteTable: "Del Table",
};

/* ── Table toolbar ───────────────────────────── */
interface TableBarProps {
  editor: Editor | null;
  L: RichTextEditorLabels;
  readOnly: boolean;
}

function TableBarBtn({
  icon,
  label,
  onClick,
  disabled = false,
  title,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      className={cn("rte-tbar-btn", disabled && "rte-tbar-btn--disabled")}
      onClick={onClick}
      disabled={disabled}
      title={title ?? label}
    >
      {icon}
      <span className="rte-tbar-label">{label}</span>
    </button>
  );
}

function TableBar({ editor, L, readOnly }: TableBarProps) {
  // Re-render on every selection/transaction change so can() reflects current state.
  const [, tick] = useState(0);
  // Split picker: null = closed, "col" | "row" = open
  const [splitPick, setSplitPick] = useState<null | "col" | "row">(null);
  const splitPickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;
    const update = () => tick((n) => n + 1);
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  // Close split picker on outside click
  useEffect(() => {
    if (!splitPick) return;
    function handler(e: MouseEvent) {
      if (splitPickRef.current && !splitPickRef.current.contains(e.target as Node)) {
        setSplitPick(null);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [splitPick]);

  if (!editor || readOnly || !editor.isActive("table")) return null;

  const canMerge = editor.can().mergeCells();
  const canSplit = editor.can().splitCell();

  function handleSplitClick() {
    if (canSplit) {
      editor!.chain().focus().splitCell().run();
    } else {
      setSplitPick((p) => (p ? null : "col"));
    }
  }

  return (
    <div className="rte-tablebar" role="toolbar" aria-label="Table editing">
      <span className="rte-tbar-group-label">{L.group_table_rows}</span>
      <TableBarBtn
        icon={<BetweenHorizontalStart size={13} />}
        label={L.addRowBefore}
        onClick={() => editor.chain().focus().addRowBefore().run()}
      />
      <TableBarBtn
        icon={<BetweenHorizontalEnd size={13} />}
        label={L.addRowAfter}
        onClick={() => editor.chain().focus().addRowAfter().run()}
      />
      <TableBarBtn
        icon={<Trash2 size={13} />}
        label={L.deleteRow}
        onClick={() => editor.chain().focus().deleteRow().run()}
      />

      <div className="rte-tbar-sep" />

      <span className="rte-tbar-group-label">{L.group_table_cols}</span>
      <TableBarBtn
        icon={<BetweenVerticalStart size={13} />}
        label={L.addColBefore}
        onClick={() => editor.chain().focus().addColumnBefore().run()}
      />
      <TableBarBtn
        icon={<BetweenVerticalEnd size={13} />}
        label={L.addColAfter}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      />
      <TableBarBtn
        icon={<Trash2 size={13} />}
        label={L.deleteColumn}
        onClick={() => editor.chain().focus().deleteColumn().run()}
      />

      <div className="rte-tbar-sep" />

      {/* ── Cells ─────────────────────────────── */}
      <span className="rte-tbar-group-label">{L.group_table_cells}</span>

      {/* Merge — enabled only with a multi-cell selection; hint on hover */}
      <TableBarBtn
        icon={<TableCellsMerge size={13} />}
        label={L.mergeCells}
        onClick={() => editor.chain().focus().mergeCells().run()}
        disabled={!canMerge}
        title={canMerge ? L.mergeCells : `${L.mergeCells} (Shift+click to select cells)`}
      />

      {/* Split — always clickable: native split for merged cells, picker for normal cells */}
      <div className="rte-tbar-split-wrap" ref={splitPickRef}>
        <TableBarBtn
          icon={<TableCellsSplit size={13} />}
          label={canSplit ? L.splitCell : `${L.splitCell}…`}
          onClick={handleSplitClick}
          title={canSplit ? L.splitCell : "Split by adding a column or row"}
        />
        {splitPick && !canSplit && (
          <div className="rte-tbar-split-picker">
            <button
              className="rte-tbar-split-pick-btn"
              onClick={() => {
                editor.chain().focus().addColumnAfter().run();
                setSplitPick(null);
              }}
            >
              <BetweenVerticalEnd size={13} />
              Split column
            </button>
            <button
              className="rte-tbar-split-pick-btn"
              onClick={() => {
                editor.chain().focus().addRowAfter().run();
                setSplitPick(null);
              }}
            >
              <BetweenHorizontalEnd size={13} />
              Split row
            </button>
          </div>
        )}
      </div>

      <div className="rte-tbar-sep" />

      <TableBarBtn
        icon={<Trash2 size={13} />}
        label={L.deleteTable}
        onClick={() => editor.chain().focus().deleteTable().run()}
      />
    </div>
  );
}

/* ── Inline dialog component ─────────────────── */
interface InlineDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function InlineDialog({ open, onClose, children }: InlineDialogProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div ref={ref} className="rte-inline-dialog">
      {children}
    </div>
  );
}

/* ── Find / Replace Bar ───────────────────────── */
interface FindBarProps {
  mode: "find" | "replace";
  onClose: () => void;
  onFind: (query: string, caseSensitive: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  onReplace: (replacement: string) => void;
  onReplaceAll: (replacement: string) => void;
  matchCount: number;
  currentIndex: number;
}

function FindBar({
  mode,
  onClose,
  onFind,
  onPrev,
  onNext,
  onReplace,
  onReplaceAll,
  matchCount,
  currentIndex,
}: FindBarProps) {
  const [query, setQuery] = React.useState("");
  const [replacement, setReplacement] = React.useState("");
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const findInputRef = React.useRef<HTMLInputElement>(null);

  // Focus the find input on mount
  useEffect(() => {
    findInputRef.current?.focus();
  }, []);

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    onFind(q, caseSensitive);
  }

  function handleCaseToggle() {
    const next = !caseSensitive;
    setCaseSensitive(next);
    onFind(query, next);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "Enter") {
      if (e.shiftKey) {
        onPrev();
      } else {
        onNext();
      }
    }
  }

  const hasMatches = matchCount > 0;
  const countLabel = query
    ? hasMatches
      ? `${currentIndex + 1} / ${matchCount}`
      : "No results"
    : "";

  return (
    <div className="rte-findbar" role="search" aria-label="Find and replace">
      <div className="rte-findbar-row">
        <Search size={14} className="rte-findbar-icon" />
        <input
          ref={findInputRef}
          className="rte-findbar-input"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          placeholder="Find…"
          aria-label="Find"
          spellCheck={false}
        />
        <button
          className={cn("rte-findbar-btn", caseSensitive && "rte-findbar-btn--active")}
          onClick={handleCaseToggle}
          title="Match case"
          aria-pressed={caseSensitive}
        >
          Aa
        </button>
        <span className="rte-findbar-count">{countLabel}</span>
        <button
          className="rte-findbar-btn"
          onClick={onPrev}
          disabled={!hasMatches}
          title="Previous match (Shift+Enter)"
          aria-label="Previous match"
        >
          <ChevronUp size={14} />
        </button>
        <button
          className="rte-findbar-btn"
          onClick={onNext}
          disabled={!hasMatches}
          title="Next match (Enter)"
          aria-label="Next match"
        >
          <ChevronDown size={14} />
        </button>
        <button
          className="rte-findbar-btn rte-findbar-btn--close"
          onClick={onClose}
          title="Close (Esc)"
          aria-label="Close find bar"
        >
          <X size={14} />
        </button>
      </div>

      {mode === "replace" && (
        <div className="rte-findbar-row">
          <Replace size={14} className="rte-findbar-icon" />
          <input
            className="rte-findbar-input"
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            placeholder="Replace with…"
            aria-label="Replace with"
            spellCheck={false}
          />
          <button
            className="rte-findbar-btn rte-findbar-btn--action"
            onClick={() => onReplace(replacement)}
            disabled={!hasMatches}
            title="Replace current"
          >
            Replace
          </button>
          <button
            className="rte-findbar-btn rte-findbar-btn--action"
            onClick={() => onReplaceAll(replacement)}
            disabled={!hasMatches}
            title="Replace all"
          >
            All
          </button>
        </div>
      )}
    </div>
  );
}

/* ── RichTextEditor ───────────────────────────── */
export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  function RichTextEditor(props, ref) {
    const {
      mode: controlledMode,
      defaultMode = "richtext",
      onModeChange,
      showPreview: controlledShowPreview,
      defaultShowPreview = false,
      onPreviewChange,
      defaultValue = "",
      value,
      onChange,
      placeholder = "Start typing…",
      readOnly = false,
      height = 400,
      minHeight,
      maxHeight,
      showWordCount = true,
      showCharCount = true,
      onImageUpload,
      allowedImageTypes,
      maxImageSize,
      autoFocus = false,
      spellCheck = true,
      className,
      style,
      labels: userLabels,
      extraRibbonGroups,
      extraRibbonTabs,
      onSave,
    } = props;

    /* ── i18n label resolver ── */
    const L: RichTextEditorLabels = { ...DEFAULT_LABELS, ...userLabels };

    /* ── Mode state ── */
    const [internalMode, setInternalMode] = useState<RichEditorMode>(defaultMode);
    const activeMode: RichEditorMode = controlledMode ?? internalMode;

    function handleModeChange(m: RichEditorMode) {
      if (m === activeMode) return;
      // ── Preserve content across mode boundaries ──
      if (m === "markdown") {
        // richtext → markdown: convert current editor HTML to markdown source
        const html = editor?.getHTML() ?? rtHtml;
        setMarkdownSource(htmlToMarkdown(html));
      } else {
        // markdown → richtext: convert markdown source to HTML and load into editor
        const html = parseMarkdown(markdownSource);
        setRtHtml(html);
        editor?.commands.setContent(html);
      }
      if (controlledMode === undefined) setInternalMode(m);
      onModeChange?.(m);
    }

    /* ── Dark / Light theme toggle ── */
    const [isDark, setIsDark] = useState<boolean>(() => {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      return false;
    });

    function handleThemeToggle(dark: boolean) {
      setIsDark(dark);
      if (dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    // Sync initial theme with system on mount; track system preference changes
    useEffect(() => {
      handleThemeToggle(isDark);
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      function onSystemChange(e: MediaQueryListEvent) {
        setIsDark(e.matches);
        handleThemeToggle(e.matches);
      }
      mq.addEventListener("change", onSystemChange);
      return () => mq.removeEventListener("change", onSystemChange);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Preview state ── */
    const [internalShowPreview, setInternalShowPreview] = useState(defaultShowPreview);
    const showPreview: boolean = controlledShowPreview ?? internalShowPreview;

    function handlePreviewToggle(next?: boolean) {
      const value = next ?? !showPreview;
      if (controlledShowPreview === undefined) setInternalShowPreview(value);
      onPreviewChange?.(value);
    }

    /* ── Markdown source ── */
    const [markdownSource, setMarkdownSource] = useState(
      activeMode === "markdown" ? (value ?? defaultValue) : "",
    );

    /* ── Rich-text HTML mirror (for live preview) ── */
    const [rtHtml, setRtHtml] = useState<string>(
      activeMode === "richtext" ? (value ?? defaultValue ?? "") : "",
    );

    /* ── Dialog state ── */
    const [imageDialog, setImageDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [linkDialog, setLinkDialog] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [videoDialog, setVideoDialog] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [videoUrlError, setVideoUrlError] = useState<string | null>(null);

    /* ── Find / Replace state ── */
    const [findMode, setFindMode] = useState<"find" | "replace" | null>(null);
    // Plain-text match count (markdown mode)
    const [mdMatchCount, setMdMatchCount] = useState(0);
    const [mdCurrentIndex, setMdCurrentIndex] = useState(0);
    const [mdQuery, setMdQuery] = useState("");

    const ribbonRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const mdTextareaRef = useRef<HTMLTextAreaElement>(null);

    /* ── Keyboard shortcut: Cmd/Ctrl+F and Cmd/Ctrl+Shift+F ── */
    useEffect(() => {
      function onKeyDown(e: KeyboardEvent) {
        const isMod = e.metaKey || e.ctrlKey;
        if (!isMod || e.key.toLowerCase() !== "f") return;
        // Make sure the event is inside this editor
        if (!rootRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        if (e.shiftKey) {
          setFindMode((m) => (m === "replace" ? null : "replace"));
        } else {
          setFindMode((m) => (m !== null ? null : "find"));
        }
      }
      document.addEventListener("keydown", onKeyDown, true);
      return () => document.removeEventListener("keydown", onKeyDown, true);
    }, []);

    /* ── Video URL resolver ── */
    function resolveVideoUrl(
      raw: string,
    ): { kind: "youtube" } | { kind: "iframe"; embedUrl: string } | { kind: "video" } | null {
      const trimmed = raw.trim();
      // Direct media file
      if (/\.(mp4|webm|ogg|ogv|mov|m4v|flv|mkv)(\?[^#]*)?$/i.test(trimmed)) {
        return { kind: "video" };
      }
      // YouTube / YouTube Music
      if (/(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/.test(trimmed)) {
        return { kind: "youtube" };
      }
      // Vimeo
      const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (vimeo) {
        return { kind: "iframe", embedUrl: `https://player.vimeo.com/video/${vimeo[1]}` };
      }
      // Bilibili (BV or av)
      const bili = trimmed.match(/bilibili\.com\/video\/(BV[\w]+|av\d+)/i);
      if (bili) {
        return {
          kind: "iframe",
          embedUrl: `https://player.bilibili.com/player.html?bvid=${bili[1]}&high_quality=1&danmaku=0`,
        };
      }
      // Dailymotion
      const dm = trimmed.match(/dailymotion\.com\/(?:video\/|embed\/video\/)([a-z0-9]+)/i);
      if (dm) {
        return { kind: "iframe", embedUrl: `https://www.dailymotion.com/embed/video/${dm[1]}` };
      }
      // Twitch clips
      const twitch = trimmed.match(/twitch\.tv\/\w+\/clip\/([\w-]+)/);
      if (twitch) {
        const parent = typeof window !== "undefined" ? window.location.hostname : "localhost";
        return {
          kind: "iframe",
          embedUrl: `https://clips.twitch.tv/embed?clip=${twitch[1]}&parent=${parent}`,
        };
      }
      return null;
    }

    function handleVideoEmbed() {
      const url = videoUrl.trim();
      if (!url) return;
      const resolved = resolveVideoUrl(url);
      if (!resolved) {
        setVideoUrlError(
          "Unsupported URL. Paste a YouTube, Vimeo, Bilibili, Dailymotion, or direct .mp4/.webm link.",
        );
        return;
      }
      if (resolved.kind === "youtube") {
        editor?.chain().focus().setYoutubeVideo({ src: url }).run();
      } else if (resolved.kind === "iframe") {
        editor
          ?.chain()
          .focus()
          .insertContent({ type: "embedFrame", attrs: { src: resolved.embedUrl } })
          .run();
      } else {
        editor
          ?.chain()
          .focus()
          .insertContent({ type: "resizableVideo", attrs: { src: url } })
          .run();
      }
      setVideoUrl("");
      setVideoUrlError(null);
      setVideoDialog(false);
    }

    /* ── Search helpers (richtext mode via ProseMirror plugin) ── */
    function pmSearch(query: string, caseSensitive: boolean) {
      if (!editor) return;
      editor.view.dispatch(
        editor.view.state.tr.setMeta(searchPluginKey, { query, caseSensitive, currentIndex: 0 }),
      );
    }

    function pmNavigate(delta: 1 | -1) {
      if (!editor) return;
      const s = searchPluginKey.getState(editor.view.state);
      if (!s || !s.matches.length) return;
      const count = s.matches.length;
      const next = (((s.currentIndex + delta) % count) + count) % count;
      editor.view.dispatch(editor.view.state.tr.setMeta(searchPluginKey, { currentIndex: next }));
      // Scroll the current match into view
      const match = s.matches[next];
      if (match) {
        editor.commands.setTextSelection({ from: match.from, to: match.to });
        editor.commands.scrollIntoView();
      }
    }

    function pmReplace(replacement: string) {
      if (!editor) return;
      const s = searchPluginKey.getState(editor.view.state);
      if (!s || !s.matches.length) return;
      const match = s.matches[s.currentIndex];
      if (!match) return;
      editor
        .chain()
        .setTextSelection({ from: match.from, to: match.to })
        .insertContent(replacement)
        .run();
      // Re-run search after replacement
      pmSearch(s.query, s.caseSensitive);
    }

    function pmReplaceAll(replacement: string) {
      if (!editor) return;
      const s = searchPluginKey.getState(editor.view.state);
      if (!s || !s.matches.length) return;
      // Replace all from end to start to preserve positions
      const chain = editor.chain();
      [...s.matches].reverse().forEach((m) => {
        chain.setTextSelection({ from: m.from, to: m.to }).insertContent(replacement);
      });
      chain.run();
      pmSearch(s.query, s.caseSensitive);
    }

    /* ── Search helpers (markdown mode via plain string) ── */
    function mdSearch(query: string, caseSensitive: boolean) {
      setMdQuery(query);
      const hits = findMatchesInText(markdownSource, query, caseSensitive);
      setMdMatchCount(hits.length);
      setMdCurrentIndex(0);
    }

    function mdNavigate(delta: 1 | -1, query: string, caseSensitive: boolean) {
      const hits = findMatchesInText(markdownSource, query, caseSensitive);
      if (!hits.length) return;
      const count = hits.length;
      const next = (((mdCurrentIndex + delta) % count) + count) % count;
      setMdCurrentIndex(next);
      const ta = mdTextareaRef.current;
      if (ta) {
        ta.focus();
        ta.setSelectionRange(hits[next][0], hits[next][1]);
      }
    }

    function mdReplace(query: string, replacement: string, caseSensitive: boolean) {
      const hits = findMatchesInText(markdownSource, query, caseSensitive);
      if (!hits.length) return;
      const [start, end] = hits[mdCurrentIndex] ?? hits[0];
      const next = markdownSource.slice(0, start) + replacement + markdownSource.slice(end);
      setMarkdownSource(next);
    }

    function mdReplaceAll(query: string, replacement: string, caseSensitive: boolean) {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(escaped, caseSensitive ? "g" : "gi");
      setMarkdownSource((s) => s.replace(re, replacement));
      setMdMatchCount(0);
      setMdCurrentIndex(0);
    }

    const editor = useRichEditor({
      defaultValue: activeMode === "richtext" ? (value ?? defaultValue) : "",
      placeholder,
      readOnly,
      autoFocus: activeMode === "richtext" && autoFocus,
      onChange: (v) => {
        setRtHtml(v.html);
        onChange?.({
          ...v,
          markdown: htmlToMarkdown(v.html),
        });
      },
    });

    /* ── Sync controlled value ── */
    useEffect(() => {
      if (value !== undefined && editor && activeMode === "richtext") {
        const current = editor.getHTML();
        if (current !== value) {
          editor.commands.setContent(value);
          setRtHtml(value);
        }
      }
    }, [value, editor, activeMode]);

    /* ── Derived search stats from ProseMirror plugin ── */
    const pmState = editor ? searchPluginKey.getState(editor.view.state) : null;
    const searchMatchCount =
      activeMode === "richtext" ? (pmState?.matches.length ?? 0) : mdMatchCount;
    const searchCurrentIndex =
      activeMode === "richtext" ? (pmState?.currentIndex ?? 0) : mdCurrentIndex;

    /* ── Save helper + Cmd/Ctrl+S shortcut (after editor is in scope) ── */
    function triggerSave() {
      if (!onSave) return;
      const content = activeMode === "markdown" ? markdownSource : (editor?.getHTML() ?? "");
      onSave(content, activeMode);
    }

    useEffect(() => {
      if (!onSave) return;
      function onKeyDown(e: KeyboardEvent) {
        const isMod = e.metaKey || e.ctrlKey;
        if (!isMod || e.key.toLowerCase() !== "s") return;
        if (!rootRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        triggerSave();
      }
      document.addEventListener("keydown", onKeyDown, true);
      return () => document.removeEventListener("keydown", onKeyDown, true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onSave, activeMode, markdownSource, editor]);

    /* ── Markdown source change ── */
    function handleMarkdownChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
      const md = e.target.value;
      setMarkdownSource(md);
      onChange?.({
        html: parseMarkdown(md),
        markdown: md,
        json: {},
        text: md,
      });
    }

    /* ── Image paste from clipboard ── */
    const handlePaste = useCallback(
      async (e: React.ClipboardEvent<HTMLDivElement>) => {
        const items = Array.from(e.clipboardData?.items ?? []);
        const imageItem = items.find((i) => i.type.startsWith("image/"));
        if (!imageItem) return;

        e.preventDefault();

        const file = imageItem.getAsFile();
        if (!file) return;

        if (allowedImageTypes && !allowedImageTypes.includes(file.type)) return;
        if (maxImageSize && file.size > maxImageSize) return;

        let url: string;
        if (onImageUpload) {
          url = await onImageUpload(file);
        } else {
          url = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        }

        if (activeMode === "richtext" && editor) {
          editor.chain().focus().setImage({ src: url }).run();
        } else {
          const ta = e.currentTarget.querySelector<HTMLTextAreaElement>(".rte-markdown-source");
          if (ta) {
            const pos = ta.selectionStart;
            const mdImg = `![pasted image](${url})`;
            const before = markdownSource.slice(0, pos);
            const after = markdownSource.slice(pos);
            setMarkdownSource(before + mdImg + after);
          }
        }
      },
      [activeMode, editor, markdownSource, onImageUpload, allowedImageTypes, maxImageSize],
    );

    /* ── Imperative handle ── */
    useImperativeHandle(ref, () => ({
      getContent: () => (activeMode === "markdown" ? markdownSource : (editor?.getHTML() ?? "")),
      getMode: () => activeMode,
      getHTML: () => editor?.getHTML() ?? "",
      getMarkdown: () =>
        activeMode === "markdown" ? markdownSource : htmlToMarkdown(editor?.getHTML() ?? ""),
      getJSON: () => (editor?.getJSON() ?? {}) as object,
      getText: () => editor?.getText() ?? "",
      setHTML: (html) => editor?.commands.setContent(html),
      setMarkdown: (md) => {
        setMarkdownSource(md);
        editor?.commands.setContent(parseMarkdown(md));
      },
      setJSON: (json) => editor?.commands.setContent(json as never),
      clear: () => {
        editor?.commands.clearContent();
        setMarkdownSource("");
      },
      focus: () => editor?.commands.focus(),
      blur: () => (editor?.view.dom as HTMLElement).blur(),
    }));

    /* ── Character / word count ── */
    const charCount = editor?.storage?.characterCount?.characters?.() ?? markdownSource.length;
    const wordCount =
      activeMode === "richtext" ? countWords(editor?.getText() ?? "") : countWords(markdownSource);

    /* ── Build RibbonBar tabs ── */
    const builtInTabs: RibbonTab[] = [
      {
        key: "home",
        label: L.tab_home,
        groups: [
          {
            key: "clipboard",
            label: L.group_clipboard,
            items: [
              {
                key: "undo",
                label: L.undo,
                icon: <Undo2 />,
                disabled: readOnly || !editor?.can().undo() || activeMode === "markdown",
                onClick: () => editor?.chain().focus().undo().run(),
              },
              {
                key: "redo",
                label: L.redo,
                icon: <Redo2 />,
                disabled: readOnly || !editor?.can().redo() || activeMode === "markdown",
                onClick: () => editor?.chain().focus().redo().run(),
              },
              {
                key: "save",
                label: L.save,
                icon: <Save />,
                disabled: readOnly || !onSave,
                onClick: triggerSave,
              },
            ],
          },
          {
            key: "text",
            label: L.group_text,
            items: [
              {
                key: "bold",
                label: L.bold,
                icon: <Bold />,
                active: editor?.isActive("bold"),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleBold().run(),
              },
              {
                key: "italic",
                label: L.italic,
                icon: <Italic />,
                active: editor?.isActive("italic"),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleItalic().run(),
              },
              {
                key: "underline",
                label: L.underline,
                icon: <UnderlineIcon />,
                active: editor?.isActive("underline"),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleUnderline().run(),
              },
              {
                key: "strike",
                label: L.strikethrough,
                icon: <Strikethrough />,
                active: editor?.isActive("strike"),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleStrike().run(),
              },
            ],
          },
          {
            key: "headings",
            label: L.group_headings,
            items: [
              {
                key: "h1",
                label: L.h1,
                icon: <Heading1 />,
                active: editor?.isActive("heading", { level: 1 }),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
              },
              {
                key: "h2",
                label: L.h2,
                icon: <Heading2 />,
                active: editor?.isActive("heading", { level: 2 }),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
              },
              {
                key: "h3",
                label: L.h3,
                icon: <Heading3 />,
                active: editor?.isActive("heading", { level: 3 }),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
              },
              {
                key: "paragraph",
                label: L.paragraph,
                icon: <Type />,
                active: editor?.isActive("paragraph"),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().setParagraph().run(),
              },
            ],
          },
          {
            key: "alignment",
            label: L.group_alignment,
            items: [
              {
                key: "align-left",
                label: L.alignLeft,
                icon: <AlignLeft />,
                active: editor?.isActive({ textAlign: "left" }),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().setTextAlign("left").run(),
              },
              {
                key: "align-center",
                label: L.alignCenter,
                icon: <AlignCenter />,
                active: editor?.isActive({ textAlign: "center" }),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().setTextAlign("center").run(),
              },
              {
                key: "align-right",
                label: L.alignRight,
                icon: <AlignRight />,
                active: editor?.isActive({ textAlign: "right" }),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().setTextAlign("right").run(),
              },
              {
                key: "align-justify",
                label: L.alignJustify,
                icon: <AlignJustify />,
                active: editor?.isActive({ textAlign: "justify" }),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().setTextAlign("justify").run(),
              },
            ],
          },
          {
            key: "lists",
            label: L.group_lists,
            items: [
              {
                key: "bullet-list",
                label: L.bulletList,
                icon: <List />,
                active: editor?.isActive("bulletList"),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleBulletList().run(),
              },
              {
                key: "ordered-list",
                label: L.orderedList,
                icon: <ListOrdered />,
                active: editor?.isActive("orderedList"),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleOrderedList().run(),
              },
            ],
          },
          ...(extraRibbonGroups?.home ?? []),
        ],
      },
      {
        key: "insert",
        label: L.tab_insert,
        groups: [
          {
            key: "media",
            label: L.group_media,
            items: [
              {
                key: "image",
                label: L.image,
                icon: <ImageIcon />,
                disabled: readOnly || activeMode === "markdown",
                onClick: () => setImageDialog(true),
              },
              {
                key: "video",
                label: L.video ?? L.youtube,
                icon: <VideoIcon />,
                disabled: readOnly || activeMode === "markdown",
                onClick: () => {
                  setVideoUrl("");
                  setVideoUrlError(null);
                  setVideoDialog(true);
                },
              },
            ],
          },
          {
            key: "content",
            label: L.group_content,
            items: [
              {
                key: "link",
                label: L.link,
                icon: <LinkIcon />,
                active: editor?.isActive("link"),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => {
                  const href = editor?.getAttributes("link").href ?? "";
                  setLinkUrl(href);
                  setLinkDialog(true);
                },
              },
              {
                key: "table",
                label: L.table,
                icon: <TableIcon />,
                disabled: readOnly || activeMode === "markdown",
                onClick: () =>
                  editor
                    ?.chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run(),
              },
              {
                key: "code-block",
                label: L.codeBlock,
                icon: <Code />,
                active: editor?.isActive("codeBlock"),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
              },
              {
                key: "blockquote",
                label: L.blockquote,
                icon: <Quote />,
                active: editor?.isActive("blockquote"),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleBlockquote().run(),
              },
              {
                key: "hr",
                label: L.divider,
                icon: <Minus />,
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().setHorizontalRule().run(),
              },
            ],
          },
          ...(extraRibbonGroups?.insert ?? []),
        ],
      },
      {
        key: "format",
        label: L.tab_format,
        groups: [
          {
            key: "style",
            label: L.group_style,
            items: [
              {
                key: "color",
                label: L.color,
                icon: <Palette />,
                disabled: readOnly || activeMode === "markdown",
                onClick: () => {
                  // handled via a native color input triggered inline
                  const input = document.getElementById("rte-color-input") as HTMLInputElement;
                  input?.click();
                },
              },
              {
                key: "highlight",
                label: L.highlight,
                icon: <Highlighter />,
                active: editor?.isActive("highlight"),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleHighlight().run(),
              },
              {
                key: "subscript",
                label: L.subscript,
                icon: <SubscriptIcon />,
                active: editor?.isActive("subscript"),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleSubscript().run(),
              },
              {
                key: "superscript",
                label: L.superscript,
                icon: <SuperscriptIcon />,
                active: editor?.isActive("superscript"),
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().toggleSuperscript().run(),
              },
            ],
          },
          {
            key: "reset",
            label: L.group_reset,
            items: [
              {
                key: "clear",
                label: L.clear,
                icon: <Eraser />,
                disabled: readOnly || activeMode === "markdown",
                onClick: () => editor?.chain().focus().unsetAllMarks().clearNodes().run(),
              },
            ],
          },
          ...(extraRibbonGroups?.format ?? []),
        ],
      },
    ];
    const tabs: RibbonTab[] = [...builtInTabs, ...(extraRibbonTabs ?? [])];

    /* ── Computed root size (bounds the editor so inner panes can scroll) ── */
    const sizeStyle: React.CSSProperties = {};
    if (height) sizeStyle.height = typeof height === "number" ? `${height}px` : height;
    if (minHeight)
      sizeStyle.minHeight = typeof minHeight === "number" ? `${minHeight}px` : minHeight;
    if (maxHeight)
      sizeStyle.maxHeight = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

    /* ── Preview content ── */
    const previewHTML = activeMode === "richtext" ? rtHtml : parseMarkdown(markdownSource);

    return (
      <div
        ref={rootRef}
        className={cn("rte-root", className)}
        style={{ ...sizeStyle, ...style }}
        data-testid="rte-root"
        onPaste={handlePaste}
      >
        {/* Hidden native color picker */}
        <input
          id="rte-color-input"
          type="color"
          className="sr-only"
          aria-hidden
          onChange={(e) => {
            editor?.chain().focus().setColor(e.target.value).run();
          }}
        />

        {/* Ribbon */}
        <div ref={ribbonRef} className="rte-ribbon relative">
          <RibbonBar tabs={tabs} />

          {/* Image dialog */}
          <InlineDialog open={imageDialog} onClose={() => setImageDialog(false)}>
            <input
              type="url"
              placeholder="Image URL…"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (imageUrl) editor?.chain().focus().setImage({ src: imageUrl }).run();
                  setImageUrl("");
                  setImageDialog(false);
                }
              }}
              autoFocus
            />
            <button
              onClick={() => {
                if (imageUrl) editor?.chain().focus().setImage({ src: imageUrl }).run();
                setImageUrl("");
                setImageDialog(false);
              }}
            >
              Insert
            </button>
            <button className="rte-cancel-btn" onClick={() => setImageDialog(false)}>
              Cancel
            </button>
          </InlineDialog>

          {/* Link dialog */}
          <InlineDialog open={linkDialog} onClose={() => setLinkDialog(false)}>
            <input
              type="url"
              placeholder="https://…"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editor?.chain().focus().setLink({ href: linkUrl }).run();
                  setLinkUrl("");
                  setLinkDialog(false);
                }
              }}
              autoFocus
            />
            <button
              onClick={() => {
                editor?.chain().focus().setLink({ href: linkUrl }).run();
                setLinkUrl("");
                setLinkDialog(false);
              }}
            >
              Apply
            </button>
            <button className="rte-cancel-btn" onClick={() => setLinkDialog(false)}>
              Cancel
            </button>
          </InlineDialog>

          {/* Video / Embed dialog */}
          <InlineDialog open={videoDialog} onClose={() => setVideoDialog(false)}>
            <input
              type="url"
              placeholder="YouTube, Vimeo, Bilibili, or .mp4 URL…"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setVideoUrlError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVideoEmbed();
              }}
              autoFocus
              style={{ minWidth: 280 }}
            />
            {videoUrlError && (
              <span
                style={{ fontSize: "0.72rem", color: "var(--color-danger-500)", flex: "0 0 100%" }}
              >
                {videoUrlError}
              </span>
            )}
            <button onClick={handleVideoEmbed}>Embed</button>
            <button className="rte-cancel-btn" onClick={() => setVideoDialog(false)}>
              Cancel
            </button>
          </InlineDialog>
        </div>

        {/* Table toolbar — visible only when cursor is inside a table */}
        {activeMode === "richtext" && (
          <TableBar editor={editor} L={L} readOnly={readOnly ?? false} />
        )}

        {/* Find / Replace bar */}
        {findMode !== null && (
          <FindBar
            mode={findMode}
            onClose={() => {
              setFindMode(null);
              // Clear highlights
              if (editor) {
                editor.view.dispatch(
                  editor.view.state.tr.setMeta(searchPluginKey, {
                    query: "",
                    currentIndex: 0,
                    matches: [],
                  }),
                );
              }
              setMdMatchCount(0);
              setMdCurrentIndex(0);
              setMdQuery("");
            }}
            onFind={(q, cs) => {
              if (activeMode === "richtext") pmSearch(q, cs);
              else mdSearch(q, cs);
            }}
            onPrev={() => {
              if (activeMode === "richtext") pmNavigate(-1);
              else mdNavigate(-1, mdQuery, false);
            }}
            onNext={() => {
              if (activeMode === "richtext") pmNavigate(1);
              else mdNavigate(1, mdQuery, false);
            }}
            onReplace={(replacement) => {
              if (activeMode === "richtext") {
                const s = editor ? searchPluginKey.getState(editor.view.state) : null;
                pmReplace(replacement);
                if (s) mdSearch(s.query, s.caseSensitive);
              } else mdReplace(mdQuery, replacement, false);
            }}
            onReplaceAll={(replacement) => {
              if (activeMode === "richtext") pmReplaceAll(replacement);
              else mdReplaceAll(mdQuery, replacement, false);
            }}
            matchCount={searchMatchCount}
            currentIndex={searchCurrentIndex}
          />
        )}

        {/* Body */}
        <div className="rte-body">
          <div className="rte-editor-pane">
            {activeMode === "richtext" ? (
              <EditorContent editor={editor} spellCheck={spellCheck} readOnly={readOnly} />
            ) : (
              <textarea
                ref={mdTextareaRef}
                className="rte-markdown-source"
                value={markdownSource}
                onChange={handleMarkdownChange}
                placeholder={placeholder}
                readOnly={readOnly}
                spellCheck={spellCheck}
                data-testid="rte-markdown-source"
              />
            )}
          </div>

          {showPreview && (
            <div className="rte-preview-pane" data-testid="rte-preview-pane">
              <div className="prose" dangerouslySetInnerHTML={{ __html: previewHTML }} />
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="rte-statusbar">
          {/* Left cluster: theme + mode switches */}
          <div className="rte-statusbar-left">
            {/* Dark / Light theme */}
            <Switch
              size="sm"
              checked={isDark}
              onCheckedChange={handleThemeToggle}
              checkedContent={<Moon size={10} />}
              uncheckedContent={<Sun size={10} />}
              aria-label="Toggle dark mode"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            />
            <span className="rte-statusbar-divider" />
            {/* Mode: Rich Text ↔ Markdown */}
            <Switch
              size="sm"
              checked={activeMode === "markdown"}
              onCheckedChange={(checked) => handleModeChange(checked ? "markdown" : "richtext")}
              disabled={controlledMode !== undefined}
              checkedContent={<Code size={10} />}
              uncheckedContent={<FileText size={10} />}
              aria-label="Toggle editor mode"
              title={
                controlledMode !== undefined
                  ? `Mode locked: ${activeMode}`
                  : activeMode === "markdown"
                    ? "Markdown mode (click for Rich Text)"
                    : "Rich Text mode (click for Markdown)"
              }
            />
            <span className="rte-statusbar-label">
              {activeMode === "markdown" ? "Markdown" : "Rich Text"}
            </span>
          </div>

          {/* Right cluster: preview switch + word / char counts */}
          <div className="rte-statusbar-right">
            {/* Preview toggle */}
            <Switch
              size="sm"
              checked={showPreview}
              onCheckedChange={handlePreviewToggle}
              checkedContent={<Eye size={10} />}
              uncheckedContent={<EyeOff size={10} />}
              aria-label="Toggle live preview"
              title={showPreview ? "Hide preview" : "Show live preview"}
            />
            <span className="rte-statusbar-label">Preview</span>
            {(showWordCount || showCharCount) && <span className="rte-statusbar-divider" />}
            {showWordCount && <span>{wordCount} words</span>}
            {showCharCount && <span>{charCount} chars</span>}
          </div>
        </div>
      </div>
    );
  },
);

RichTextEditor.displayName = "RichTextEditor";
