import type React from "react";
import type { RibbonTab, RibbonGroup, RibbonItem } from "../../Navigation/RibbonBar";

// Re-export ribbon types so consumers don't need a separate import path.
export type { RibbonTab, RibbonGroup, RibbonItem };

export type RichEditorMode = "richtext" | "markdown";

/**
 * All user-visible strings in the RichTextEditor ribbon bar.
 * Pass a partial record to override only the strings you need.
 *
 * Keys follow the pattern:
 *   - tab_<tabKey>         → tab header label
 *   - group_<groupKey>     → group header label
 *   - <buttonKey>          → button label
 */
export interface RichTextEditorLabels {
  // ── Tab labels ──────────────────────────────────────
  tab_home: string;
  tab_insert: string;
  tab_format: string;

  // ── Home tab ────────────────────────────────────────
  group_clipboard: string;
  undo: string;
  redo: string;

  group_text: string;
  bold: string;
  italic: string;
  underline: string;
  strikethrough: string;

  group_headings: string;
  h1: string;
  h2: string;
  h3: string;
  paragraph: string;

  group_alignment: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  alignJustify: string;

  group_lists: string;
  bulletList: string;
  orderedList: string;

  save: string;

  // ── Insert tab ──────────────────────────────────────
  group_media: string;
  image: string;
  /** Label for the generic video/embed insert button (YouTube, Vimeo, Bilibili, mp4…). */
  video: string;
  /** @deprecated renamed to `video`; kept for backward compatibility */
  youtube: string;

  group_content: string;
  link: string;
  table: string;
  codeBlock: string;
  blockquote: string;
  divider: string;

  // ── Format tab ──────────────────────────────────────
  group_style: string;
  color: string;
  highlight: string;
  subscript: string;
  superscript: string;

  group_reset: string;
  clear: string;

  // ── Table toolbar ──────────────────────────────────
  group_table_rows: string;
  addRowBefore: string;
  addRowAfter: string;
  deleteRow: string;

  group_table_cols: string;
  addColBefore: string;
  addColAfter: string;
  deleteColumn: string;

  group_table_cells: string;
  mergeCells: string;
  splitCell: string;
  deleteTable: string;
}

/** Built-in tab keys for use with extraRibbonGroups. */
export type RichEditorBuiltInTabKey = "home" | "insert" | "format";

/**
 * Inject extra groups into built-in ribbon tabs or supply entirely new tabs.
 */
export interface RichTextEditorRibbonProps {
  /**
   * Extra `RibbonGroup[]` to append to built-in ribbon tabs.
   * Key is the built-in tab key ("home" | "insert" | "format").
   */
  extraRibbonGroups?: Partial<Record<RichEditorBuiltInTabKey, RibbonGroup[]>>;
  /**
   * Additional ribbon tabs appended after the built-in tabs.
   */
  extraRibbonTabs?: RibbonTab[];
}

export interface RichTextEditorHandle {
  /** Returns HTML when in richtext mode, raw Markdown when in markdown mode. */
  getContent: () => string;
  /** The currently active editor mode. */
  getMode: () => RichEditorMode;
  getHTML: () => string;
  getMarkdown: () => string;
  getJSON: () => object;
  getText: () => string;
  setHTML: (html: string) => void;
  setMarkdown: (md: string) => void;
  setJSON: (json: object) => void;
  clear: () => void;
  focus: () => void;
  blur: () => void;
}

export interface RichTextEditorProps extends RichTextEditorRibbonProps {
  /** Editor mode: richtext (WYSIWYG) or markdown (plain text source) */
  mode?: RichEditorMode;
  defaultMode?: RichEditorMode;
  onModeChange?: (mode: RichEditorMode) => void;
  /** Whether live preview pane is visible. Default: false (OFF) */
  showPreview?: boolean;
  /** Uncontrolled default preview visibility. Default: false */
  defaultShowPreview?: boolean;
  /** Called when preview toggle changes */
  onPreviewChange?: (show: boolean) => void;
  /** Initial HTML or Markdown content */
  defaultValue?: string;
  /** Controlled content value */
  value?: string;
  /** Called on every content change */
  onChange?: (value: { html: string; markdown: string; json: object; text: string }) => void;
  /**
   * Called when the user presses Cmd/Ctrl+S or clicks the Save ribbon button.
   * `content` is the current editor content in the active `mode`:
   * HTML string for "richtext", raw Markdown string for "markdown".
   */
  onSave?: (content: string, mode: RichEditorMode) => void;
  placeholder?: string;
  readOnly?: boolean;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  showWordCount?: boolean;
  showCharCount?: boolean;
  /** If provided, called on image paste/upload; return public URL. Default: base64 inline */
  onImageUpload?: (file: File) => Promise<string>;
  allowedImageTypes?: string[];
  maxImageSize?: number;
  autoFocus?: boolean;
  spellCheck?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Override any ribbon button / group / tab label for internationalisation.
   * Unspecified keys fall back to the built-in English defaults.
   */
  labels?: Partial<RichTextEditorLabels>;
}
