import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

/* ── Tiptap mock ── */
vi.mock("@tiptap/react", () => ({
  useEditor: () => null,
  EditorContent: ({ editor: _editor }: { editor: unknown }) => <div data-testid="editor-content" />,
}));
vi.mock("@tiptap/starter-kit", () => ({ default: {} }));
vi.mock("@tiptap/extension-underline", () => ({ default: {} }));
vi.mock("@tiptap/extension-text-align", () => ({ default: { configure: () => ({}) } }));
vi.mock("@tiptap/extension-color", () => ({ Color: {} }));
vi.mock("@tiptap/extension-highlight", () => ({ default: { configure: () => ({}) } }));
vi.mock("@tiptap/extension-image", () => {
  const ext: Record<string, unknown> = {};
  ext.configure = () => ext;
  ext.extend = () => ext;
  return { default: ext };
});
vi.mock("@tiptap/extension-link", () => ({ default: { configure: () => ({}) } }));
vi.mock("@tiptap/extension-youtube", () => ({ default: { configure: () => ({}) } }));
vi.mock("@tiptap/extension-placeholder", () => ({ default: { configure: () => ({}) } }));
vi.mock("@tiptap/extension-character-count", () => ({ default: {} }));
vi.mock("@tiptap/extension-typography", () => ({ default: {} }));
vi.mock("@tiptap/extension-subscript", () => ({ default: {} }));
vi.mock("@tiptap/extension-superscript", () => ({ default: {} }));
vi.mock("@tiptap/extension-table", () => ({
  default: { configure: () => ({}) },
  Table: { configure: () => ({}) },
}));
vi.mock("@tiptap/extension-table-row", () => ({ default: {} }));
vi.mock("@tiptap/extension-table-header", () => ({ default: {} }));
vi.mock("@tiptap/extension-table-cell", () => ({ default: {} }));
vi.mock("marked", () => ({
  marked: { parse: (md: string) => `<p>${md}</p>` },
}));

import { RichTextEditor } from "../components/Extras/RichTextEditor";
import type { RichTextEditorHandle } from "../components/Extras/RichTextEditor";

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe("RichTextEditor", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <Wrapper>
        <RichTextEditor />
      </Wrapper>,
    );
    expect(container.querySelector("[data-testid='rte-root']")).toBeTruthy();
  });

  it("renders in markdown mode", () => {
    render(
      <Wrapper>
        <RichTextEditor defaultMode="markdown" />
      </Wrapper>,
    );
    expect(screen.getByTestId("rte-markdown-source")).toBeTruthy();
  });

  it("does not render the markdown textarea in richtext mode", () => {
    render(
      <Wrapper>
        <RichTextEditor defaultMode="richtext" />
      </Wrapper>,
    );
    expect(screen.queryByTestId("rte-markdown-source")).toBeNull();
  });

  it("hides preview pane when showPreview is false (default)", () => {
    render(
      <Wrapper>
        <RichTextEditor />
      </Wrapper>,
    );
    expect(screen.queryByTestId("rte-preview-pane")).toBeNull();
  });

  it("shows preview pane when defaultShowPreview=true", () => {
    render(
      <Wrapper>
        <RichTextEditor defaultShowPreview={true} />
      </Wrapper>,
    );
    expect(screen.getByTestId("rte-preview-pane")).toBeTruthy();
  });

  it("shows preview pane when showPreview prop is true", () => {
    render(
      <Wrapper>
        <RichTextEditor showPreview={true} />
      </Wrapper>,
    );
    expect(screen.getByTestId("rte-preview-pane")).toBeTruthy();
  });

  it("calls onChange when markdown textarea changes", () => {
    const onChange = vi.fn();
    render(
      <Wrapper>
        <RichTextEditor defaultMode="markdown" onChange={onChange} />
      </Wrapper>,
    );
    const ta = screen.getByTestId("rte-markdown-source");
    fireEvent.change(ta, { target: { value: "# Hello" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        markdown: "# Hello",
        html: expect.any(String),
      }),
    );
  });

  it("applies custom className", () => {
    render(
      <Wrapper>
        <RichTextEditor className="my-rte" />
      </Wrapper>,
    );
    expect(screen.getByTestId("rte-root").classList.contains("my-rte")).toBe(true);
  });

  it("respects readOnly prop on markdown textarea", () => {
    render(
      <Wrapper>
        <RichTextEditor defaultMode="markdown" readOnly={true} />
      </Wrapper>,
    );
    const ta = screen.getByTestId("rte-markdown-source") as HTMLTextAreaElement;
    expect(ta.readOnly).toBe(true);
  });

  it("shows word and char count by default", () => {
    render(
      <Wrapper>
        <RichTextEditor showWordCount={true} showCharCount={true} />
      </Wrapper>,
    );
    expect(screen.getByText(/words/)).toBeTruthy();
    expect(screen.getByText(/chars/)).toBeTruthy();
  });

  it("hides word/char counts when both count props are false", () => {
    render(
      <Wrapper>
        <RichTextEditor showWordCount={false} showCharCount={false} />
      </Wrapper>,
    );
    expect(screen.queryByText(/words/)).toBeNull();
  });

  it("calls onModeChange when mode toggle is clicked", () => {
    const onModeChange = vi.fn();
    render(
      <Wrapper>
        <RichTextEditor onModeChange={onModeChange} />
      </Wrapper>,
    );
    // Mode switch is in the status bar — find by aria-label and check it to switch to Markdown
    const modeSwitch = screen.getByRole("switch", { name: /toggle editor mode/i });
    fireEvent.click(modeSwitch);
    expect(onModeChange).toHaveBeenCalledWith("markdown");
  });

  it("calls onPreviewChange when preview toggle clicked", () => {
    const onPreviewChange = vi.fn();
    render(
      <Wrapper>
        <RichTextEditor onPreviewChange={onPreviewChange} />
      </Wrapper>,
    );
    // Preview switch is in the status bar — find by aria-label
    const previewSwitch = screen.getByRole("switch", { name: /toggle live preview/i });
    fireEvent.click(previewSwitch);
    expect(onPreviewChange).toHaveBeenCalledWith(true);
  });

  it("exposes imperative handle methods via ref", () => {
    const ref = React.createRef<RichTextEditorHandle>();
    render(
      <Wrapper>
        <RichTextEditor ref={ref} defaultMode="markdown" />
      </Wrapper>,
    );

    expect(typeof ref.current?.getHTML).toBe("function");
    expect(typeof ref.current?.getMarkdown).toBe("function");
    expect(typeof ref.current?.getJSON).toBe("function");
    expect(typeof ref.current?.getText).toBe("function");
    expect(typeof ref.current?.setHTML).toBe("function");
    expect(typeof ref.current?.setMarkdown).toBe("function");
    expect(typeof ref.current?.setJSON).toBe("function");
    expect(typeof ref.current?.clear).toBe("function");
    expect(typeof ref.current?.focus).toBe("function");
    expect(typeof ref.current?.blur).toBe("function");
  });

  it("getMarkdown() returns markdown source in markdown mode", () => {
    const ref = React.createRef<RichTextEditorHandle>();
    render(
      <Wrapper>
        <RichTextEditor ref={ref} defaultMode="markdown" />
      </Wrapper>,
    );
    const ta = screen.getByTestId("rte-markdown-source");
    fireEvent.change(ta, { target: { value: "## Title" } });
    expect(ref.current?.getMarkdown()).toBe("## Title");
  });

  it("setMarkdown() updates the markdown textarea", async () => {
    const ref = React.createRef<RichTextEditorHandle>();
    render(
      <Wrapper>
        <RichTextEditor ref={ref} defaultMode="markdown" />
      </Wrapper>,
    );
    await act(async () => {
      ref.current?.setMarkdown("# Set via ref");
    });
    const ta = screen.getByTestId("rte-markdown-source") as HTMLTextAreaElement;
    expect(ta.value).toBe("# Set via ref");
  });
});

/* ── Utility tests ── */
import {
  parseMarkdown,
  htmlToMarkdown,
  countWords,
} from "../components/Extras/RichTextEditor/RichTextEditor.utils";

describe("RichTextEditor utils", () => {
  describe("parseMarkdown", () => {
    it("wraps text in a paragraph tag", () => {
      const result = parseMarkdown("hello");
      expect(result).toContain("hello");
    });
  });

  describe("htmlToMarkdown", () => {
    it("converts bold HTML to markdown", () => {
      expect(htmlToMarkdown("<p>Hello <strong>world</strong></p>")).toBe("Hello **world**");
    });

    it("returns plain text unchanged", () => {
      expect(htmlToMarkdown("plain text")).toBe("plain text");
    });
  });

  describe("countWords", () => {
    it("counts words correctly", () => {
      expect(countWords("hello world foo")).toBe(3);
    });

    it("returns 0 for empty string", () => {
      expect(countWords("")).toBe(0);
    });

    it("handles extra whitespace", () => {
      expect(countWords("  hello   world  ")).toBe(2);
    });
  });
});
