import React, { useState, useRef } from "react";
import { RichTextEditor } from "../../src";
import type { RichTextEditorHandle, RichEditorMode } from "../../src";
import { Section, PageTitle, CodeExample, PropTable } from "./helpers";
import type { PropRow } from "./helpers";

const propRows: PropRow[] = [
  {
    prop: "mode",
    type: '"richtext" | "markdown"',
    default: "—",
    description: "Controlled editor mode.",
  },
  {
    prop: "defaultMode",
    type: '"richtext" | "markdown"',
    default: '"richtext"',
    description: "Uncontrolled initial mode.",
  },
  {
    prop: "onSave",
    type: "(content: string, mode: RichEditorMode) => void",
    description:
      "Called on Cmd/Ctrl+S or Save ribbon click. content is HTML (richtext) or Markdown (markdown).",
  },
  { prop: "onModeChange", type: "(mode) => void", description: "Called when mode changes." },
  {
    prop: "showPreview",
    type: "boolean",
    default: "—",
    description: "Controlled preview pane visibility.",
  },
  {
    prop: "defaultShowPreview",
    type: "boolean",
    default: "false",
    description: "Uncontrolled initial preview visibility.",
  },
  { prop: "onPreviewChange", type: "(show) => void", description: "Called when preview toggled." },
  {
    prop: "defaultValue",
    type: "string",
    default: '""',
    description: "Initial HTML or Markdown content (uncontrolled).",
  },
  { prop: "value", type: "string", description: "Controlled content value." },
  {
    prop: "onChange",
    type: "(value) => void",
    description: "Called on every content change; receives { html, markdown, json, text }.",
  },
  {
    prop: "placeholder",
    type: "string",
    default: '"Start typing…"',
    description: "Placeholder text.",
  },
  { prop: "readOnly", type: "boolean", default: "false", description: "Disables editing." },
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
  {
    prop: "onImageUpload",
    type: "(file: File) => Promise<string>",
    description: "Called when an image is pasted; return a public URL.",
  },
  {
    prop: "allowedImageTypes",
    type: "string[]",
    description: "Allowed MIME types for pasted images.",
  },
  { prop: "maxImageSize", type: "number", description: "Max pasted image size in bytes." },
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
    description: "Enable/disable spellcheck.",
  },
  { prop: "className", type: "string", description: "Additional CSS class for the root element." },
  { prop: "style", type: "React.CSSProperties", description: "Inline style for the root element." },
  {
    prop: "labels",
    type: "Partial<RichTextEditorLabels>",
    description:
      "Override ribbon / toolbar label strings for i18n. Unspecified keys use English defaults.",
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
      "Returns the content in the active mode — HTML for richtext, raw Markdown for markdown. Prefer this over getHTML()/getMarkdown() when you don't know the current mode.",
  },
  {
    prop: "getMode()",
    type: "() => RichEditorMode",
    description: "Returns the currently active editor mode.",
  },
  { prop: "getHTML()", type: "() => string", description: "Returns current HTML content." },
  { prop: "getMarkdown()", type: "() => string", description: "Returns Markdown representation." },
  { prop: "getJSON()", type: "() => object", description: "Returns Tiptap JSON document." },
  { prop: "getText()", type: "() => string", description: "Returns plain text." },
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

export default function RichTextEditorPage() {
  /* ── Controlled mode demo ── */
  const [controlledMode, setControlledMode] = useState<RichEditorMode>("richtext");

  /* ── Save demo ── */
  const [saveLog, setSaveLog] = useState<{ content: string; mode: RichEditorMode }[]>([]);

  /* ── Controlled preview demo ── */
  const [controlledPreview, setControlledPreview] = useState(false);

  /* ── Ref API demo ── */
  const editorRef = useRef<RichTextEditorHandle>(null);
  const [refOutput, setRefOutput] = useState("");

  /* ── Output formats demo ── */
  const [liveOutput, setLiveOutput] = useState<{
    html: string;
    markdown: string;
    json: object;
    text: string;
  } | null>(null);

  return (
    <div className="space-y-10 pb-20">
      <PageTitle>RichTextEditor</PageTitle>

      {/* 1. Basic WYSIWYG */}
      <Section title="1 · Basic WYSIWYG">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
          Default richtext mode, preview is <strong>off</strong> by default. Use the{" "}
          <em>View → Live Preview</em> ribbon button to toggle it on.
        </p>
        <RichTextEditor placeholder="Start typing rich text here…" minHeight={260} />
        <CodeExample
          code={`<RichTextEditor placeholder="Start typing rich text here…" minHeight={260} />`}
        />
      </Section>

      {/* 2. With Live Preview */}
      <Section title="2 · With Live Preview (default ON)">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
          <code>defaultShowPreview={`{true}`}</code> opens the preview pane immediately. Try typing
          to see it update in real time.
        </p>
        <RichTextEditor
          defaultShowPreview={true}
          defaultValue="<h2>Hello World</h2><p>This is a <strong>live</strong> preview example.</p><ul><li>Item one</li><li>Item two</li></ul>"
          minHeight={260}
        />
        <CodeExample
          code={`<RichTextEditor
  defaultShowPreview={true}
  defaultValue="<h2>Hello World</h2><p>This is a <strong>live</strong> preview.</p>"
  minHeight={260}
/>`}
        />
      </Section>

      {/* 3. Markdown Mode */}
      <Section title="3 · Markdown Mode">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
          Set <code>defaultMode=&quot;markdown&quot;</code> to start in raw Markdown source mode.
          Toggle <em>View → Live Preview</em> to see the rendered output side-by-side.
        </p>
        <RichTextEditor
          defaultMode="markdown"
          defaultValue={`# Markdown Mode\n\nWrite **bold**, *italic*, and \`code\` here.\n\n- List item one\n- List item two\n\n> Blockquote example`}
          minHeight={260}
        />
        <CodeExample
          code={`<RichTextEditor
  defaultMode="markdown"
  defaultValue={\`# Markdown Mode\\n\\nWrite **bold**, *italic*, and \\\`code\\\` here.\`}
  minHeight={260}
/>`}
        />
      </Section>

      {/* 4. Controlled mode */}
      <Section title="4 · Controlled Mode">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
          Control the editor mode externally with the <code>mode</code> prop.
        </p>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setControlledMode("richtext")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              controlledMode === "richtext"
                ? "bg-primary-600 text-white border-primary-600"
                : "border-primary-300 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-800"
            }`}
          >
            Rich Text
          </button>
          <button
            onClick={() => setControlledMode("markdown")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              controlledMode === "markdown"
                ? "bg-primary-600 text-white border-primary-600"
                : "border-primary-300 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-800"
            }`}
          >
            Markdown
          </button>
        </div>
        <RichTextEditor
          mode={controlledMode}
          onModeChange={setControlledMode}
          defaultValue="<p>Switch modes using the buttons above or the View tab.</p>"
          minHeight={200}
        />
        <CodeExample
          code={`const [mode, setMode] = useState<RichEditorMode>("richtext");

<RichTextEditor
  mode={mode}
  onModeChange={setMode}
  defaultValue="<p>Switch modes using the buttons above.</p>"
  minHeight={200}
/>`}
        />
      </Section>

      {/* 5. Controlled Preview */}
      <Section title="5 · Controlled Preview">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
          Control the preview pane externally with <code>showPreview</code>.
        </p>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setControlledPreview((p) => !p)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-primary-300 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-800 transition-colors"
          >
            {controlledPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
        <RichTextEditor
          showPreview={controlledPreview}
          onPreviewChange={setControlledPreview}
          defaultValue="<p>Use the button above to toggle the preview pane externally.</p>"
          minHeight={200}
        />
        <CodeExample
          code={`const [showPreview, setShowPreview] = useState(false);

<RichTextEditor
  showPreview={showPreview}
  onPreviewChange={setShowPreview}
  minHeight={200}
/>`}
        />
      </Section>

      {/* 6. Read-only */}
      <Section title="6 · Read-Only Mode">
        <RichTextEditor
          readOnly={true}
          defaultValue="<h3>Read-Only Content</h3><p>This editor is in <strong>read-only</strong> mode. The toolbar is disabled and the content cannot be edited.</p><blockquote>All toolbar buttons are disabled in read-only mode.</blockquote>"
          minHeight={180}
        />
        <CodeExample
          code={`<RichTextEditor
  readOnly={true}
  defaultValue="<h3>Read-Only Content</h3><p>Cannot be edited.</p>"
  minHeight={180}
/>`}
        />
      </Section>

      {/* 7. Ref API */}
      <Section title="7 · Ref API">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
          Use a ref to programmatically control the editor via <code>RichTextEditorHandle</code>.
        </p>
        <RichTextEditor
          ref={editorRef}
          minHeight={200}
          defaultValue="<p>Edit me, then use the buttons below.</p>"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { label: "getHTML()", action: () => setRefOutput(editorRef.current?.getHTML() ?? "") },
            {
              label: "getMarkdown()",
              action: () => setRefOutput(editorRef.current?.getMarkdown() ?? ""),
            },
            { label: "getText()", action: () => setRefOutput(editorRef.current?.getText() ?? "") },
            {
              label: "setHTML()",
              action: () =>
                editorRef.current?.setHTML("<p>Content set via <strong>setHTML()</strong>.</p>"),
            },
            { label: "clear()", action: () => editorRef.current?.clear() },
            { label: "focus()", action: () => editorRef.current?.focus() },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="px-3 py-1.5 rounded-lg text-xs font-mono border border-primary-300 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-800 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
        {refOutput && (
          <pre className="mt-3 rounded-lg bg-primary-900 text-primary-100 p-3 text-xs overflow-x-auto max-h-48 font-mono">
            {refOutput}
          </pre>
        )}
        <CodeExample
          code={`const editorRef = useRef<RichTextEditorHandle>(null);

<RichTextEditor ref={editorRef} />

// Programmatic access:
editorRef.current?.getHTML();
editorRef.current?.setHTML("<p>Hello</p>");
editorRef.current?.clear();`}
        />
      </Section>

      {/* 8. onSave callback */}
      <Section title="8 · onSave Callback (Cmd/Ctrl+S)">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
          Pass <code>onSave</code> to handle <kbd>Cmd+S</kbd> / <kbd>Ctrl+S</kbd> and the Save
          ribbon button. The callback always receives the content in the{" "}
          <strong>current mode</strong> — HTML for richtext, raw Markdown for markdown — so you
          never need to check both.
        </p>
        <RichTextEditor
          minHeight={200}
          defaultValue="<p>Edit this content, then press <strong>Cmd/Ctrl+S</strong> or click Save in the ribbon.</p>"
          onSave={(content, mode) =>
            setSaveLog((prev) => [{ content: content.slice(0, 200), mode }, ...prev].slice(0, 5))
          }
        />
        {saveLog.length > 0 && (
          <div className="mt-3 space-y-2">
            {saveLog.map((entry, i) => (
              <div
                key={i}
                className="rounded-lg bg-primary-900 text-primary-100 p-2 text-xs font-mono overflow-x-auto"
              >
                <span className="text-primary-400">[mode: {entry.mode}]</span> {entry.content}
              </div>
            ))}
          </div>
        )}
        <CodeExample
          code={`<RichTextEditor
  onSave={(content, mode) => {
    if (mode === "richtext") saveHTML(content);
    else saveMarkdown(content);
  }}
/>`}
        />
      </Section>

      {/* 9. Output formats */}
      <Section title="9 · Live Output Formats">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
          The <code>onChange</code> callback receives all 4 formats simultaneously.
        </p>
        <RichTextEditor
          onChange={setLiveOutput}
          defaultValue="<p>Type here to see all output formats update live.</p>"
          minHeight={180}
        />
        {liveOutput && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(["html", "markdown", "text"] as const).map((key) => (
              <div key={key}>
                <p className="text-xs font-semibold text-primary-500 mb-1 uppercase tracking-wide">
                  {key}
                </p>
                <pre className="rounded-lg bg-primary-900 text-primary-100 p-2 text-xs overflow-x-auto max-h-28 font-mono">
                  {String(liveOutput[key]).slice(0, 400)}
                </pre>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold text-primary-500 mb-1 uppercase tracking-wide">
                json
              </p>
              <pre className="rounded-lg bg-primary-900 text-primary-100 p-2 text-xs overflow-x-auto max-h-28 font-mono">
                {JSON.stringify(liveOutput.json, null, 2).slice(0, 400)}
              </pre>
            </div>
          </div>
        )}
        <CodeExample
          code={`<RichTextEditor
  onChange={({ html, markdown, json, text }) => {
    console.log({ html, markdown, json, text });
  }}
/>`}
        />
      </Section>

      {/* 10. Video / Embed */}
      <Section title="10 · Video & Embed">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
          Use the <strong>Insert → Video</strong> ribbon button to embed videos from multiple
          platforms or link a direct media file. Supported sources:
        </p>
        <div className="overflow-x-auto mb-4">
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
                ["YouTube", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "iframe embed"],
                ["Vimeo", "https://vimeo.com/123456789", "iframe embed"],
                ["Bilibili", "https://www.bilibili.com/video/BV1xx411c7mD", "iframe embed"],
                ["Dailymotion", "https://www.dailymotion.com/video/x7zvwpr", "iframe embed"],
                ["Twitch clip", "https://www.twitch.tv/clips/ClipName", "iframe embed"],
                ["Direct .mp4", "https://example.com/movie.mp4", "<video controls>"],
                ["Direct .webm / .mov / etc.", "https://example.com/clip.webm", "<video controls>"],
              ].map(([platform, url, method]) => (
                <tr key={platform} className="even:bg-primary-50/50 dark:even:bg-primary-900/30">
                  <td className="px-3 py-1.5 border border-primary-200 dark:border-primary-700 font-sans">
                    {platform}
                  </td>
                  <td className="px-3 py-1.5 border border-primary-200 dark:border-primary-700 break-all">
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
        <RichTextEditor
          defaultValue="<p>Click <strong>Insert → Video</strong> in the ribbon and paste any URL from the table above.</p>"
          minHeight={200}
        />
        <p className="text-xs text-secondary-500 mt-2">
          Both iframe embeds and native video elements can be dragged-to-resize from the right edge.
          Iframe embeds maintain 16:9 aspect ratio.
        </p>
      </Section>

      {/* 11. i18n / Labels */}
      <Section title="11 · i18n / Labels">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
          Pass a <code>Partial&lt;RichTextEditorLabels&gt;</code> to <code>labels</code> to override
          any ribbon or toolbar string. Only the keys you provide are changed — everything else
          stays in English.
        </p>
        <RichTextEditor
          minHeight={160}
          defaultValue="<p>The ribbon above is in Chinese.</p>"
          labels={{
            tab_home: "主页",
            tab_insert: "插入",
            tab_format: "格式",
            group_clipboard: "剪贴板",
            undo: "撤销",
            redo: "重做",
            save: "保存",
            group_text: "文本",
            bold: "加粗",
            italic: "斜体",
            underline: "下划线",
            strikethrough: "删除线",
            group_headings: "标题",
            h1: "H1",
            h2: "H2",
            h3: "H3",
            paragraph: "正文",
            group_alignment: "对齐",
            alignLeft: "左对齐",
            alignCenter: "居中",
            alignRight: "右对齐",
            alignJustify: "两端",
            group_lists: "列表",
            bulletList: "无序",
            orderedList: "有序",
            group_media: "媒体",
            image: "图片",
            video: "视频",
            group_content: "内容",
            link: "链接",
            table: "表格",
            codeBlock: "代码块",
            blockquote: "引用",
            divider: "分隔线",
            group_style: "样式",
            color: "颜色",
            highlight: "高亮",
            subscript: "下标",
            superscript: "上标",
            group_reset: "重置",
            clear: "清除格式",
          }}
        />
        <CodeExample
          code={`import type { RichTextEditorLabels } from "@jacshuo/onyx";

const zhLabels: Partial<RichTextEditorLabels> = {
  tab_home: "主页", tab_insert: "插入", tab_format: "格式",
  group_clipboard: "剪贴板", undo: "撤销", redo: "重做", save: "保存",
  // … override only the keys you need
  video: "视频",
};

<RichTextEditor labels={zhLabels} />`}
        />
      </Section>

      {/* Prop table */}
      <Section title="Props">
        <PropTable rows={propRows} title="RichTextEditorProps" />
      </Section>
      <Section title="Ref Handle">
        <PropTable rows={handleRows} title="RichTextEditorHandle" />
      </Section>
    </div>
  );
}
