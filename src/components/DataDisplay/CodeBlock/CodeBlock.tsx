import React, { useEffect, useState, useRef, useCallback } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { codeBlockVariants } from "../../../styles/theme/data-display";

export type CodeBlockLanguage =
  | "typescript"
  | "javascript"
  | "tsx"
  | "jsx"
  | "html"
  | "css"
  | "json"
  | "markdown"
  | "python"
  | "rust"
  | "go"
  | "java"
  | "c"
  | "cpp"
  | "csharp"
  | "vue"
  | "xml"
  | "yaml"
  | "sql"
  | "bash"
  | "shell"
  | (string & {});

export type CodeBlockProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof codeBlockVariants> & {
    /** The source code to highlight */
    code: string;
    /** Programming language for syntax highlighting */
    language?: CodeBlockLanguage;
    /** Show line numbers */
    lineNumbers?: boolean;
    /** Enable live editing — renders a transparent textarea over the highlighted output */
    editable?: boolean;
    /** Called when the user edits code (only fires when `editable` is true) */
    onCodeChange?: (code: string) => void;
  };

/**
 * CSS-variables-based Shiki theme that maps to our semantic tokens.
 * Shiki replaces these variable references into inline styles,
 * and the actual colors come from tokens.css (light/dark).
 */
const cssVarTheme = {
  name: "onyx-css-vars",
  type: "dark" as const,
  settings: [
    {
      settings: {
        foreground: "var(--color-syntax-plain)",
        background: "var(--color-syntax-bg)",
      },
    },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "var(--color-syntax-comment)", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.operator.new",
        "keyword.operator.expression",
        "storage.type",
        "storage.modifier",
      ],
      settings: { foreground: "var(--color-syntax-keyword)" },
    },
    {
      scope: ["string", "string.quoted", "string.template"],
      settings: { foreground: "var(--color-syntax-string)" },
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: "var(--color-syntax-function)" },
    },
    {
      scope: ["variable", "variable.other", "variable.parameter", "meta.definition.variable"],
      settings: { foreground: "var(--color-syntax-variable)" },
    },
    {
      scope: ["constant.numeric", "constant.language"],
      settings: { foreground: "var(--color-syntax-number)" },
    },
    {
      scope: [
        "keyword.operator",
        "keyword.operator.assignment",
        "keyword.operator.comparison",
        "keyword.operator.arithmetic",
      ],
      settings: { foreground: "var(--color-syntax-operator)" },
    },
    {
      scope: ["entity.name.tag", "punctuation.definition.tag", "support.class.component"],
      settings: { foreground: "var(--color-syntax-tag)" },
    },
    {
      scope: ["entity.other.attribute-name", "meta.tag.attributes"],
      settings: { foreground: "var(--color-syntax-attr)" },
    },
    {
      scope: [
        "punctuation",
        "meta.brace",
        "punctuation.definition.block",
        "punctuation.separator",
        "punctuation.terminator",
      ],
      settings: { foreground: "var(--color-syntax-punctuation)" },
    },
    {
      scope: ["entity.name.type", "support.type", "support.class", "entity.other.inherited-class"],
      settings: { foreground: "var(--color-syntax-type)" },
    },
  ],
};

// Explicit per-language loaders — only these langs get bundled (no full @shikijs/langs pull-in).
// Uses @shikijs/langs individual exports so webpack creates one small chunk per language.
const LANG_LOADERS: Record<string, () => Promise<unknown>> = {
  typescript: () => import("@shikijs/langs/typescript"),
  javascript: () => import("@shikijs/langs/javascript"),
  tsx: () => import("@shikijs/langs/tsx"),
  jsx: () => import("@shikijs/langs/jsx"),
  html: () => import("@shikijs/langs/html"),
  css: () => import("@shikijs/langs/css"),
  json: () => import("@shikijs/langs/json"),
  markdown: () => import("@shikijs/langs/markdown"),
  python: () => import("@shikijs/langs/python"),
  rust: () => import("@shikijs/langs/rust"),
  go: () => import("@shikijs/langs/go"),
  java: () => import("@shikijs/langs/java"),
  c: () => import("@shikijs/langs/c"),
  cpp: () => import("@shikijs/langs/cpp"),
  csharp: () => import("@shikijs/langs/csharp"),
  vue: () => import("@shikijs/langs/vue"),
  xml: () => import("@shikijs/langs/xml"),
  yaml: () => import("@shikijs/langs/yaml"),
  sql: () => import("@shikijs/langs/sql"),
  bash: () => import("@shikijs/langs/bash"),
  shell: () => import("@shikijs/langs/shell"),
};

// Shared highlighter singleton (lazy) — uses shiki/core + JS regex engine (no WASM)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let highlighterPromise: Promise<any> | null = null;
const loadedLanguages = new Set<string>();

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = Promise.all([
      import("shiki/core"),
      import("shiki/engine/javascript"),
    ]).then(([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
      createHighlighterCore({
        themes: [cssVarTheme],
        langs: [],
        engine: createJavaScriptRegexEngine(),
      }),
    );
  }
  return highlighterPromise;
}

async function highlight(code: string, lang: string, lineNumbers: boolean): Promise<string> {
  const highlighter = await getHighlighter();
  if (lang && !loadedLanguages.has(lang)) {
    const loader = LANG_LOADERS[lang];
    if (loader) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mod = (await loader()) as any;
        await highlighter.loadLanguage(mod.default ?? mod);
        loadedLanguages.add(lang);
      } catch {
        lang = "text";
      }
    } else {
      // Unknown language — fall back to plain text
      lang = "text";
    }
  }
  let html: string = highlighter.codeToHtml(code, {
    lang: lang || "text",
    theme: "onyx-css-vars",
  });

  // Inject shared line-height into the <pre> so it matches the textarea
  html = html.replace(
    /(<pre [^>]*style=")/,
    "$1line-height:1.7;tab-size:2;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;",
  );

  if (lineNumbers) {
    let lineNum = 0;
    html = html.replace(/<span class="line">/g, () => {
      lineNum++;
      return `<span class="line"><span class="line-number" data-line="${lineNum}"></span>`;
    });
  }

  return html;
}

export function CodeBlock({
  code,
  language = "text",
  lineNumbers = false,
  editable = false,
  onCodeChange,
  size,
  className,
  ...props
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    // In editable mode, never inject line numbers into the HTML — they're rendered as a separate gutter
    highlight(code, language, editable ? false : lineNumbers).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code, language, lineNumbers, editable]);

  // Sync scroll between textarea and highlighted pre (and gutter)
  const handleScroll = useCallback(() => {
    const ta = textareaRef.current;
    const pre = preRef.current?.querySelector("pre");
    const gutter = containerRef.current?.querySelector<HTMLElement>("[data-gutter]");
    if (ta && pre) {
      pre.scrollTop = ta.scrollTop;
      pre.scrollLeft = ta.scrollLeft;
    }
    if (ta && gutter) {
      gutter.scrollTop = ta.scrollTop;
    }
  }, []);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onCodeChange?.(e.target.value);
    },
    [onCodeChange],
  );

  // Handle Tab key for indentation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newValue = ta.value.substring(0, start) + "  " + ta.value.substring(end);
        onCodeChange?.(newValue);
        // Restore cursor position after React re-render
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
    },
    [onCodeChange],
  );

  const lineNumberClasses =
    lineNumbers &&
    "[&_.line-number]:inline-block [&_.line-number]:w-8 [&_.line-number]:mr-4 [&_.line-number]:text-right [&_.line-number]:text-secondary-400 [&_.line-number]:select-none [&_.line-number]:before:content-[attr(data-line)]";

  const sharedFont = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  const sharedLineHeight = 1.7;

  const lineCount = code.split("\n").length;

  if (editable) {
    return (
      <div
        ref={containerRef}
        className={cn(
          codeBlockVariants({ size }),
          "flex border border-primary-200 dark:border-primary-700",
          className,
        )}
        style={{ background: "var(--color-syntax-bg)" }}
        {...props}
      >
        {/* Optional line‑number gutter (separate column, never inside the overlay) */}
        {lineNumbers && (
          <div
            data-gutter
            aria-hidden
            className="shrink-0 select-none overflow-hidden py-4 pl-3 pr-1 text-right text-secondary-400"
            style={{
              fontFamily: sharedFont,
              lineHeight: sharedLineHeight,
              width: "3rem",
            }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}

        {/* Code editing area: textarea on top, highlighted pre behind */}
        <div className="relative min-w-0 flex-1">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleInput}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="relative z-2 m-0 block h-full w-full resize-none overflow-auto whitespace-pre border-none bg-transparent p-4 text-transparent caret-primary-600 outline-none dark:caret-primary-400"
            style={{
              fontFamily: sharedFont,
              lineHeight: sharedLineHeight,
              tabSize: 2,
              minHeight: "6rem",
            }}
          />
          <div
            ref={preRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-1 overflow-hidden [&_pre]:m-0 [&_pre]:h-full [&_pre]:overflow-hidden [&_pre]:p-4 [&_code]:bg-transparent"
            dangerouslySetInnerHTML={html ? { __html: html } : undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        codeBlockVariants({ size }),
        "border border-primary-200 dark:border-primary-700",
        lineNumberClasses,
        className,
      )}
      style={{ background: "var(--color-syntax-bg)" }}
      {...props}
    >
      <div
        ref={preRef}
        className="[&_pre]:m-0 [&_pre]:p-4"
        dangerouslySetInnerHTML={html ? { __html: html } : undefined}
      >
        {!html ? (
          <pre className="m-0 p-4" style={{ background: "var(--color-syntax-bg)" }}>
            <code>{code}</code>
          </pre>
        ) : undefined}
      </div>
    </div>
  );
}
