import { marked } from "marked";
import type { Node as PmNode } from "@tiptap/pm/model";

/**
 * Parse Markdown to HTML using marked.
 * Returns synchronously; marked v12+ may return Promise for async renderers,
 * but the default renderer is synchronous with no async extensions.
 */
export function parseMarkdown(md: string): string {
  const result = marked.parse(md, { async: false });
  return result as string;
}

/**
 * Converts HTML produced by Tiptap to Markdown.
 * Handles headings, bold, italic, strikethrough, code, links,
 * images, ordered/unordered lists, blockquotes, horizontal rules,
 * and falls back to plain text for unrecognised tags.
 */
export function htmlToMarkdown(html: string): string {
  return (
    html
      // Block-level elements
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n\n")
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n\n")
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n\n")
      .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "#### $1\n\n")
      .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "##### $1\n\n")
      .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "###### $1\n\n")
      .replace(
        /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
        (_, inner) => inner.trim().replace(/^/gm, "> ") + "\n\n",
      )
      .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```\n\n")
      .replace(/<hr\s*\/?>/gi, "\n---\n\n")
      // Lists — convert list items before the container
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
      .replace(/<\/?(ul|ol)[^>]*>/gi, "\n")
      // Inline elements
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
      .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**")
      .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "_$1_")
      .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "_$1_")
      .replace(/<s[^>]*>([\s\S]*?)<\/s>/gi, "~~$1~~")
      .replace(/<del[^>]*>([\s\S]*?)<\/del>/gi, "~~$1~~")
      .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
      .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
      .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)")
      .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n")
      // Strip any remaining tags
      .replace(/<[^>]+>/g, "")
      // Decode basic HTML entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      // Collapse 3+ newlines to 2
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

/**
 * Count words in a string.
 */
export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/* ── Search helpers ──────────────────────────────── */

export interface TextMatch {
  from: number;
  to: number;
}

/**
 * Find all occurrences of `query` in a ProseMirror document.
 * Returns positions in ProseMirror document coordinates.
 */
export function findMatchesInDoc(doc: PmNode, query: string, caseSensitive = false): TextMatch[] {
  if (!query) return [];
  const matches: TextMatch[] = [];
  const flags = caseSensitive ? "g" : "gi";
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(escaped, flags);

  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(node.text)) !== null) {
      matches.push({ from: pos + m.index, to: pos + m.index + m[0].length });
    }
  });

  return matches;
}

/**
 * Find all occurrences of `query` in a plain string (for Markdown textarea).
 * Returns [start, end] character index pairs.
 */
export function findMatchesInText(
  text: string,
  query: string,
  caseSensitive = false,
): Array<[number, number]> {
  if (!query) return [];
  const flags = caseSensitive ? "g" : "gi";
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(escaped, flags);
  const matches: Array<[number, number]> = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    matches.push([m.index, m.index + m[0].length]);
  }
  return matches;
}
