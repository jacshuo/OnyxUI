import React from "react";
import { PageTitle, CodeExample, PropTable, Section } from "../helpers";
import type { PropRow } from "../helpers";

const propRows: PropRow[] = [
  // ── Mode ──
  { prop: "mode", type: '"richtext" | "markdown"', description: "Controlled editor mode." },
  {
    prop: "defaultMode",
    type: '"richtext" | "markdown"',
    default: '"richtext"',
    description: "Uncontrolled initial mode.",
  },
  {
    prop: "onModeChange",
    type: "(mode: RichEditorMode) => void",
    description: "Called when mode changes.",
  },
  // ── Preview ──
  { prop: "showPreview", type: "boolean", description: "Controlled preview pane visibility." },
  {
    prop: "defaultShowPreview",
    type: "boolean",
    default: "false",
    description: "Uncontrolled initial preview visibility.",
  },
  {
    prop: "onPreviewChange",
    type: "(show: boolean) => void",
    description: "Called when preview toggled.",
  },
  // ── Content ──
  {
    prop: "defaultValue",
    type: "string",
    default: '""',
    description: "Initial HTML or Markdown content (uncontrolled).",
  },
  { prop: "value", type: "string", description: "Controlled content value." },
  {
    prop: "onChange",
    type: "(value: { html, markdown, json, text }) => void",
    description: "Called on every content change.",
  },
  {
    prop: "onSave",
    type: "(content: string, mode: RichEditorMode) => void",
    description:
      "Called on Cmd/Ctrl+S or the Save ribbon button. content is HTML for richtext mode or raw Markdown for markdown mode.",
  },
  // ── Display ──
  {
    prop: "placeholder",
    type: "string",
    default: '"Start typing…"',
    description: "Placeholder text inside the editor.",
  },
  {
    prop: "readOnly",
    type: "boolean",
    default: "false",
    description: "Prevents editing; disables all toolbar buttons.",
  },
  { prop: "height", type: "number | string", description: "Fixed height of the editor body." },
  {
    prop: "minHeight",
    type: "number | string",
    default: "300",
    description: "Minimum height of the editor body.",
  },
  { prop: "maxHeight", type: "number | string", description: "Maximum height of the editor body." },
  {
    prop: "showWordCount",
    type: "boolean",
    default: "true",
    description: "Show word count in the status bar.",
  },
  {
    prop: "showCharCount",
    type: "boolean",
    default: "true",
    description: "Show character count in the status bar.",
  },
  // ── Image ──
  {
    prop: "onImageUpload",
    type: "(file: File) => Promise<string>",
    description: "Custom image upload handler; return a public URL. Defaults to base64 inline.",
  },
  {
    prop: "allowedImageTypes",
    type: "string[]",
    description: "Allowed MIME types for pasted images (e.g. ['image/png', 'image/jpeg']).",
  },
  { prop: "maxImageSize", type: "number", description: "Max pasted image size in bytes." },
  // ── Behaviour ──
  {
    prop: "autoFocus",
    type: "boolean",
    default: "false",
    description: "Auto-focus the editor on mount.",
  },
  {
    prop: "spellCheck",
    type: "boolean",
    default: "true",
    description: "Enable/disable browser spellcheck.",
  },
  // ── Style ──
  { prop: "className", type: "string", description: "Additional CSS class for the root element." },
  { prop: "style", type: "React.CSSProperties", description: "Inline style for the root element." },
  // ── i18n / extensibility ──
  {
    prop: "labels",
    type: "Partial<RichTextEditorLabels>",
    description:
      "Override any or all ribbon / toolbar label strings for internationalisation. Unspecified keys fall back to English defaults.",
  },
  {
    prop: "extraRibbonGroups",
    type: 'Partial<Record<"home"|"insert"|"format", RibbonGroup[]>>',
    description: "Append extra ribbon groups to a built-in tab.",
  },
  {
    prop: "extraRibbonTabs",
    type: "RibbonTab[]",
    description: "Append entirely new ribbon tabs after the built-in ones.",
  },
];

const handleRows: PropRow[] = [
  {
    prop: "getContent()",
    type: "() => string",
    description:
      "Returns the content in the active mode — HTML for richtext, raw Markdown for markdown. Prefer this over getHTML()/getMarkdown() when mode is unknown.",
  },
  {
    prop: "getMode()",
    type: "() => RichEditorMode",
    description: "Returns the currently active editor mode ('richtext' | 'markdown').",
  },
  {
    prop: "getHTML()",
    type: "() => string",
    description: "Returns current content as HTML (empty string when in markdown mode).",
  },
  {
    prop: "getMarkdown()",
    type: "() => string",
    description: "Returns current content as Markdown (always works regardless of mode).",
  },
  {
    prop: "getJSON()",
    type: "() => object",
    description: "Returns current content as Tiptap JSON.",
  },
  {
    prop: "getText()",
    type: "() => string",
    description: "Returns current content as plain text.",
  },
  {
    prop: "setHTML(html)",
    type: "(html: string) => void",
    description: "Replaces editor content with HTML.",
  },
  {
    prop: "setMarkdown(md)",
    type: "(md: string) => void",
    description: "Replaces editor content with Markdown.",
  },
  {
    prop: "setJSON(json)",
    type: "(json: object) => void",
    description: "Replaces editor content with Tiptap JSON.",
  },
  { prop: "clear()", type: "() => void", description: "Clears all editor content." },
  { prop: "focus()", type: "() => void", description: "Focuses the editor." },
  { prop: "blur()", type: "() => void", description: "Blurs the editor." },
];

const labelRows: PropRow[] = [
  // Tabs
  { prop: "tab_home", type: "string", default: '"Home"', description: "Home tab label." },
  { prop: "tab_insert", type: "string", default: '"Insert"', description: "Insert tab label." },
  { prop: "tab_format", type: "string", default: '"Format"', description: "Format tab label." },
  // Home — Clipboard group
  {
    prop: "group_clipboard",
    type: "string",
    default: '"Clipboard"',
    description: "Clipboard group header.",
  },
  { prop: "undo", type: "string", default: '"Undo"', description: "Undo button." },
  { prop: "redo", type: "string", default: '"Redo"', description: "Redo button." },
  {
    prop: "save",
    type: "string",
    default: '"Save"',
    description: "Save button (visible when onSave is provided).",
  },
  // Home — Text group
  { prop: "group_text", type: "string", default: '"Text"', description: "Text group header." },
  { prop: "bold", type: "string", default: '"Bold"', description: "Bold button." },
  { prop: "italic", type: "string", default: '"Italic"', description: "Italic button." },
  { prop: "underline", type: "string", default: '"Underline"', description: "Underline button." },
  {
    prop: "strikethrough",
    type: "string",
    default: '"Strikethrough"',
    description: "Strikethrough button.",
  },
  // Home — Headings group
  {
    prop: "group_headings",
    type: "string",
    default: '"Headings"',
    description: "Headings group header.",
  },
  { prop: "h1", type: "string", default: '"H1"', description: "Heading 1 button." },
  { prop: "h2", type: "string", default: '"H2"', description: "Heading 2 button." },
  { prop: "h3", type: "string", default: '"H3"', description: "Heading 3 button." },
  {
    prop: "paragraph",
    type: "string",
    default: '"Normal"',
    description: "Normal paragraph button.",
  },
  // Home — Alignment group
  {
    prop: "group_alignment",
    type: "string",
    default: '"Alignment"',
    description: "Alignment group header.",
  },
  { prop: "alignLeft", type: "string", default: '"Left"', description: "Align left button." },
  { prop: "alignCenter", type: "string", default: '"Center"', description: "Align center button." },
  { prop: "alignRight", type: "string", default: '"Right"', description: "Align right button." },
  { prop: "alignJustify", type: "string", default: '"Justify"', description: "Justify button." },
  // Home — Lists group
  { prop: "group_lists", type: "string", default: '"Lists"', description: "Lists group header." },
  { prop: "bulletList", type: "string", default: '"Bullet"', description: "Bullet list button." },
  {
    prop: "orderedList",
    type: "string",
    default: '"Ordered"',
    description: "Ordered list button.",
  },
  // Insert — Media group
  { prop: "group_media", type: "string", default: '"Media"', description: "Media group header." },
  { prop: "image", type: "string", default: '"Image"', description: "Insert image button." },
  {
    prop: "video",
    type: "string",
    default: '"Video"',
    description:
      "Insert video / embed button (YouTube, Vimeo, Bilibili, Dailymotion, Twitch clips, and direct .mp4/.webm/.mov URLs).",
  },
  // Insert — Content group
  {
    prop: "group_content",
    type: "string",
    default: '"Content"',
    description: "Content group header.",
  },
  { prop: "link", type: "string", default: '"Link"', description: "Insert / edit link button." },
  { prop: "table", type: "string", default: '"Table"', description: "Insert table button." },
  {
    prop: "codeBlock",
    type: "string",
    default: '"Code Block"',
    description: "Insert code block button.",
  },
  {
    prop: "blockquote",
    type: "string",
    default: '"Quote"',
    description: "Insert blockquote button.",
  },
  {
    prop: "divider",
    type: "string",
    default: '"Divider"',
    description: "Insert horizontal rule button.",
  },
  // Format — Style group
  { prop: "group_style", type: "string", default: '"Style"', description: "Style group header." },
  { prop: "color", type: "string", default: '"Color"', description: "Text color button." },
  { prop: "highlight", type: "string", default: '"Highlight"', description: "Highlight button." },
  { prop: "subscript", type: "string", default: '"Sub"', description: "Subscript button." },
  { prop: "superscript", type: "string", default: '"Sup"', description: "Superscript button." },
  // Format — Reset group
  { prop: "group_reset", type: "string", default: '"Reset"', description: "Reset group header." },
  { prop: "clear", type: "string", default: '"Clear"', description: "Clear formatting button." },
  // Table context toolbar
  {
    prop: "group_table_rows",
    type: "string",
    default: '"Rows"',
    description: "Table toolbar — Rows group header.",
  },
  {
    prop: "addRowBefore",
    type: "string",
    default: '"Add Above"',
    description: "Add row above button.",
  },
  {
    prop: "addRowAfter",
    type: "string",
    default: '"Add Below"',
    description: "Add row below button.",
  },
  { prop: "deleteRow", type: "string", default: '"Del Row"', description: "Delete row button." },
  {
    prop: "group_table_cols",
    type: "string",
    default: '"Columns"',
    description: "Table toolbar — Columns group header.",
  },
  {
    prop: "addColBefore",
    type: "string",
    default: '"Add Left"',
    description: "Add column to the left button.",
  },
  {
    prop: "addColAfter",
    type: "string",
    default: '"Add Right"',
    description: "Add column to the right button.",
  },
  {
    prop: "deleteColumn",
    type: "string",
    default: '"Del Col"',
    description: "Delete column button.",
  },
  {
    prop: "group_table_cells",
    type: "string",
    default: '"Cells"',
    description: "Table toolbar — Cells group header.",
  },
  {
    prop: "mergeCells",
    type: "string",
    default: '"Merge"',
    description: "Merge selected cells button.",
  },
  { prop: "splitCell", type: "string", default: '"Split"', description: "Split cell button." },
  {
    prop: "deleteTable",
    type: "string",
    default: '"Del Table"',
    description: "Delete entire table button.",
  },
];

export default function RichTextEditorDoc() {
  return (
    <div className="space-y-10 pb-20">
      <PageTitle>RichTextEditor</PageTitle>

      {/* Import */}
      <Section title="Import">
        <CodeExample
          code={`import { RichTextEditor } from "@jacshuo/onyx";
import type {
  RichTextEditorHandle,
  RichTextEditorLabels,
  RichEditorMode,
  RichEditorBuiltInTabKey,
} from "@jacshuo/onyx";`}
        />
      </Section>

      {/* Type reference */}
      <Section title="Type Reference">
        <CodeExample
          language="typescript"
          code={`type RichEditorMode = "richtext" | "markdown";
type RichEditorBuiltInTabKey = "home" | "insert" | "format";`}
        />
      </Section>

      {/* Basic usage */}
      <Section title="Basic Usage">
        <CodeExample
          code={`// WYSIWYG richtext (default)
<RichTextEditor
  placeholder="Start typing…"
  onChange={({ html, markdown, json, text }) => console.log(html)}
/>

// Markdown mode with live preview open by default
<RichTextEditor
  defaultMode="markdown"
  defaultShowPreview={true}
/>`}
        />
      </Section>

      {/* onSave */}
      <Section title="Save Callback (Cmd/Ctrl+S)">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
          Pass <code>onSave</code> to respond to <kbd>Cmd+S</kbd> / <kbd>Ctrl+S</kbd> and the Save
          ribbon button. The <code>content</code> argument is always in the{" "}
          <strong>current mode</strong> — HTML for richtext, raw Markdown for markdown — so you
          never need to poll both formats.
        </p>
        <CodeExample
          code={`<RichTextEditor
  onSave={(content, mode) => {
    if (mode === "richtext") await saveHTML(content);
    else await saveMarkdown(content);
  }}
/>`}
        />
      </Section>

      {/* Ref API */}
      <Section title="Ref (Imperative API)">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
          Use <code>getContent()</code> + <code>getMode()</code> when you don&apos;t know which mode
          the user has active — they always return the right format. The legacy{" "}
          <code>getHTML()</code> returns an empty string in markdown mode.
        </p>
        <CodeExample
          code={`import { useRef } from "react";
import { RichTextEditor, type RichTextEditorHandle } from "@jacshuo/onyx";

const ref = useRef<RichTextEditorHandle>(null);

<RichTextEditor ref={ref} />

// Mode-safe read (recommended)
const content = ref.current?.getContent(); // HTML or Markdown depending on mode
const mode    = ref.current?.getMode();    // "richtext" | "markdown"

// Explicit format reads
ref.current?.getHTML();        // HTML (empty string if in markdown mode)
ref.current?.getMarkdown();    // Markdown (always works regardless of mode)
ref.current?.getJSON();        // Tiptap JSON
ref.current?.getText();        // Plain text

// Mutations
ref.current?.setHTML("<p>Hello</p>");
ref.current?.setMarkdown("**Hello**");
ref.current?.clear();
ref.current?.focus();
ref.current?.blur();`}
        />
      </Section>

      {/* Video / Embed */}
      <Section title="Video & Embed Support">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
          The <em>Insert → Video</em> button accepts URLs from multiple platforms. Paste any of the
          following into the dialog:
        </p>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary-50 dark:bg-primary-900 text-left">
                <th className="px-3 py-2 border border-primary-200 dark:border-primary-700 font-semibold">
                  Platform
                </th>
                <th className="px-3 py-2 border border-primary-200 dark:border-primary-700 font-semibold">
                  Example URL
                </th>
                <th className="px-3 py-2 border border-primary-200 dark:border-primary-700 font-semibold">
                  Method
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {[
                ["YouTube / YouTube Music", "youtube.com/watch?v=…, youtu.be/…", "iframe embed"],
                ["Vimeo", "vimeo.com/123456789", "iframe embed"],
                ["Bilibili", "bilibili.com/video/BVxxx", "iframe embed"],
                ["Dailymotion", "dailymotion.com/video/…", "iframe embed"],
                ["Twitch clips", "twitch.tv/…/clip/ClipName", "iframe embed"],
                [
                  "Direct media",
                  "https://example.com/video.mp4 (.webm .ogg .mov .m4v…)",
                  "<video controls>",
                ],
              ].map(([platform, url, method]) => (
                <tr key={platform} className="even:bg-primary-50/50 dark:even:bg-primary-900/30">
                  <td className="px-3 py-1.5 border border-primary-200 dark:border-primary-700 font-sans font-medium">
                    {platform}
                  </td>
                  <td className="px-3 py-1.5 border border-primary-200 dark:border-primary-700">
                    {url}
                  </td>
                  <td className="px-3 py-1.5 border border-primary-200 dark:border-primary-700 font-sans">
                    {method}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Both iframe embeds and native video nodes support drag-to-resize via the right-edge
          handle. Iframe embeds maintain a 16:9 aspect ratio during resizing.
        </p>
      </Section>

      {/* Table editing */}
      <Section title="Table Editing">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
          When the cursor is inside a table a context toolbar appears automatically with shortcuts
          for all table operations. Column widths can be dragged to resize.
        </p>
        <CodeExample
          code={`// Insert tab → Table inserts a 3×3 table.
// Table toolbar operations (appear when cursor is inside a table):
//   Rows:    Add Above · Add Below · Delete Row
//   Columns: Add Left  · Add Right · Delete Column
//   Cells:   Merge (shift-click to multi-select first) · Split
//            Delete Table`}
        />
      </Section>

      {/* Custom image upload */}
      <Section title="Custom Image Upload">
        <CodeExample
          code={`<RichTextEditor
  onImageUpload={async (file) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const { url } = await res.json();
    return url;           // shown as <img src="url" />
  }}
  allowedImageTypes={["image/png", "image/jpeg", "image/webp"]}
  maxImageSize={5 * 1024 * 1024}  // 5 MB
/>`}
        />
      </Section>

      {/* i18n */}
      <Section title="Internationalisation (labels)">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
          Pass a <code>Partial&lt;RichTextEditorLabels&gt;</code> to <code>labels</code> to override
          any button or group string. Unspecified keys fall back to the English defaults.
        </p>
        <CodeExample
          language="typescript"
          code={`import type { RichTextEditorLabels } from "@jacshuo/onyx";

const zhLabels: Partial<RichTextEditorLabels> = {
  // Tabs
  tab_home:   "主页",
  tab_insert: "插入",
  tab_format: "格式",

  // Clipboard (Home tab)
  group_clipboard: "剪贴板",
  undo:  "撤销",
  redo:  "重做",
  save:  "保存",

  // Text (Home tab)
  group_text:    "文本",
  bold:          "加粗",
  italic:        "斜体",
  underline:     "下划线",
  strikethrough: "删除线",

  // Headings (Home tab)
  group_headings: "标题",
  h1: "H1", h2: "H2", h3: "H3",
  paragraph: "正文",

  // Alignment (Home tab)
  group_alignment: "对齐",
  alignLeft: "左对齐", alignCenter: "居中",
  alignRight: "右对齐", alignJustify: "两端",

  // Lists (Home tab)
  group_lists:  "列表",
  bulletList:   "无序",
  orderedList:  "有序",

  // Media (Insert tab)
  group_media: "媒体",
  image: "图片",
  video: "视频",        // covers all video/embed sources

  // Content (Insert tab)
  group_content: "内容",
  link:       "链接",
  table:      "表格",
  codeBlock:  "代码块",
  blockquote: "引用",
  divider:    "分隔线",

  // Style (Format tab)
  group_style:  "样式",
  color:        "颜色",
  highlight:    "高亮",
  subscript:    "下标",
  superscript:  "上标",

  // Reset (Format tab)
  group_reset: "重置",
  clear:       "清除格式",

  // Table context toolbar
  group_table_rows: "行",
  addRowBefore: "上方插行", addRowAfter: "下方插行", deleteRow: "删除行",

  group_table_cols: "列",
  addColBefore: "左侧插列", addColAfter: "右侧插列", deleteColumn: "删除列",

  group_table_cells: "单元格",
  mergeCells:  "合并",
  splitCell:   "拆分",
  deleteTable: "删除表格",
};

<RichTextEditor labels={zhLabels} />`}
        />
        <PropTable rows={labelRows} title="RichTextEditorLabels" />
      </Section>

      {/* Ribbon extensibility */}
      <Section title="Ribbon Extensibility">
        <CodeExample
          language="typescript"
          code={`import type { RibbonGroup, RibbonTab } from "@jacshuo/onyx";

// Add extra items to an existing tab
const extraHomeGroups: Partial<Record<RichEditorBuiltInTabKey, RibbonGroup[]>> = {
  home: [
    {
      key: "custom",
      label: "My Tools",
      items: [
        {
          key:   "my-action",
          label: "Custom",
          icon:  <StarIcon />,
          onClick: () => alert("custom!"),
        },
      ],
    },
  ],
};

// Add an entirely new tab
const extraTabs: RibbonTab[] = [
  {
    key: "review",
    label: "Review",
    groups: [
      { key: "spell", label: "Spell", items: [{ key: "check", label: "Check", icon: <SpellCheck />, onClick: () => {} }] },
    ],
  },
];

<RichTextEditor
  extraRibbonGroups={extraHomeGroups}
  extraRibbonTabs={extraTabs}
/>`}
        />
      </Section>

      {/* Props */}
      <Section title="RichTextEditorProps">
        <PropTable rows={propRows} title="RichTextEditorProps" />
      </Section>

      {/* Handle */}
      <Section title="RichTextEditorHandle">
        <PropTable rows={handleRows} title="RichTextEditorHandle" />
      </Section>
    </div>
  );
}
