import { useEditor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { ResizableImage, ResizableVideo, EmbedFrame } from "./RichTextEditor.nodes";
import { findMatchesInDoc, type TextMatch } from "./RichTextEditor.utils";

/* ── Search ProseMirror Plugin ─────────────────── */

export interface SearchState {
  query: string;
  caseSensitive: boolean;
  currentIndex: number;
  matches: TextMatch[];
}

export const searchPluginKey = new PluginKey<SearchState>("rteSearch");

export const SearchExtension = Extension.create({
  name: "rteSearch",

  addProseMirrorPlugins() {
    return [
      new Plugin<SearchState>({
        key: searchPluginKey,

        state: {
          init(): SearchState {
            return { query: "", caseSensitive: false, currentIndex: 0, matches: [] };
          },
          apply(tr, prev): SearchState {
            const meta = tr.getMeta(searchPluginKey) as Partial<SearchState> | undefined;
            if (meta) {
              const next = { ...prev, ...meta };
              next.matches = findMatchesInDoc(tr.doc, next.query, next.caseSensitive);
              if (next.currentIndex >= next.matches.length) next.currentIndex = 0;
              return next;
            }
            if (tr.docChanged && prev.query) {
              const matches = findMatchesInDoc(tr.doc, prev.query, prev.caseSensitive);
              const currentIndex = Math.min(prev.currentIndex, Math.max(0, matches.length - 1));
              return { ...prev, matches, currentIndex };
            }
            return prev;
          },
        },

        props: {
          decorations(state) {
            const s = searchPluginKey.getState(state);
            if (!s?.query || !s.matches.length) return DecorationSet.empty;
            const decos = s.matches.map((m, i) =>
              Decoration.inline(m.from, m.to, {
                class: i === s.currentIndex ? "rte-search-current" : "rte-search-match",
              }),
            );
            return DecorationSet.create(state.doc, decos);
          },
        },
      }),
    ];
  },
});

export interface UseRichEditorOptions {
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  onChange?: (value: { html: string; markdown: string; json: object; text: string }) => void;
}

export function useRichEditor(options: UseRichEditorOptions) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      ResizableImage,
      ResizableVideo,
      EmbedFrame,
      Link.configure({ openOnClick: false }),
      Youtube.configure({ width: 480, height: 320 }),
      Placeholder.configure({ placeholder: options.placeholder ?? "Start typing…" }),
      CharacterCount,
      Typography,
      Subscript,
      Superscript,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      SearchExtension,
    ],
    content: options.defaultValue ?? "",
    editable: !options.readOnly,
    autofocus: options.autoFocus,
    onUpdate: ({ editor }) => {
      options.onChange?.({
        html: editor.getHTML(),
        markdown: "",
        json: editor.getJSON(),
        text: editor.getText(),
      });
    },
  });

  return editor;
}
