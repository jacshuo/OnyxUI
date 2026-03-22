/**
 * Resizable Image / Video / Embed node views for the RichTextEditor.
 * – ResizableImage:  extends Tiptap Image with resize handles
 * – ResizableVideo:  custom node using <video controls> with resize
 * – EmbedFrame:      custom node using <iframe> for Vimeo, Bilibili, etc.
 */
import React, { useRef, useState, useEffect } from "react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import { Node, mergeAttributes } from "@tiptap/core";
import type { NodeViewProps } from "@tiptap/core";

/* ── ResizableImageNodeView ─────────────────── */

function ResizableImageNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const startRef = useRef({ x: 0, width: 0 });

  const { src, alt, title } = node.attrs as {
    src: string;
    alt: string | null;
    title: string | null;
    width: number | null;
    height: number | null;
  };
  const width: number | null = (node.attrs as Record<string, unknown>).width as number | null;

  function startResize(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const currentWidth = imgRef.current?.offsetWidth ?? (typeof width === "number" ? width : 200);
    startRef.current = { x: e.clientX, width: currentWidth };
    setIsResizing(true);
  }

  useEffect(() => {
    if (!isResizing) return;

    function onMouseMove(e: MouseEvent) {
      const delta = e.clientX - startRef.current.x;
      const newWidth = Math.max(60, Math.round(startRef.current.width + delta));
      updateAttributes({ width: newWidth, height: null });
    }

    function onMouseUp() {
      setIsResizing(false);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing, updateAttributes]);

  return (
    <NodeViewWrapper
      as="span"
      className={`rte-image-wrapper${selected ? " rte-image-wrapper--selected" : ""}`}
    >
      {/* resize handle — keyboard/mouse interaction on img is intentional */}
      <img
        ref={imgRef}
        src={src}
        alt={alt ?? ""}
        title={title ?? ""}
        draggable={false}
        style={{
          display: "block",
          maxWidth: "100%",
          width: width ? `${width}px` : undefined,
          cursor: isResizing ? "ew-resize" : "default",
        }}
      />

      {selected && (
        <>
          {/* Visual selection corners (non-draggable) */}
          <span className="rte-rh rte-rh--nw" />
          <span className="rte-rh rte-rh--ne" />
          <span className="rte-rh rte-rh--sw" />

          {/* Draggable handles */}
          <span
            className="rte-rh rte-rh--se"
            onMouseDown={startResize}
            title="Drag to resize"
            role="separator"
            aria-label="Resize image"
          />
          <span
            className="rte-rh rte-rh--e"
            onMouseDown={startResize}
            title="Drag to resize"
            role="separator"
            aria-label="Resize image"
          />

          {/* Size badge */}
          {width && (
            <span className="rte-image-size-label" aria-live="polite">
              {width}px
            </span>
          )}
        </>
      )}
    </NodeViewWrapper>
  );
}

/* ── ResizableImage Extension ───────────────── */

export const ResizableImage = Image.extend({
  name: "image",

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => {
          const w = el.getAttribute("width");
          return w ? parseInt(w, 10) : null;
        },
        renderHTML: (attrs) =>
          attrs.width ? { width: attrs.width, style: `width:${attrs.width}px;` } : {},
      },
      height: {
        default: null,
        parseHTML: (el) => {
          const h = el.getAttribute("height");
          return h ? parseInt(h, 10) : null;
        },
        renderHTML: (attrs) => (attrs.height ? { height: attrs.height } : {}),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNodeView);
  },
}).configure({ inline: true, allowBase64: true });

/* ── ResizableVideoNodeView ─────────────────── */

function ResizableVideoNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const startRef = useRef({ x: 0, width: 0 });

  const { src } = node.attrs as { src: string };
  const width: number | null = (node.attrs as Record<string, unknown>).width as number | null;

  function startResize(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const currentWidth = wrapRef.current?.offsetWidth ?? (typeof width === "number" ? width : 320);
    startRef.current = { x: e.clientX, width: currentWidth };
    setIsResizing(true);
  }

  useEffect(() => {
    if (!isResizing) return;
    function onMouseMove(e: MouseEvent) {
      const delta = e.clientX - startRef.current.x;
      const newWidth = Math.max(120, Math.round(startRef.current.width + delta));
      updateAttributes({ width: newWidth });
    }
    function onMouseUp() {
      setIsResizing(false);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing, updateAttributes]);

  return (
    <NodeViewWrapper
      as="div"
      className={`rte-video-wrapper${selected ? " rte-video-wrapper--selected" : ""}`}
    >
      <div
        ref={wrapRef}
        style={{
          display: "inline-block",
          maxWidth: "100%",
          width: width ? `${width}px` : "100%",
          position: "relative",
        }}
      >
        {/* captions not needed for inline editor video nodes */}
        <video src={src} controls style={{ display: "block", width: "100%", maxWidth: "100%" }} />
        {selected && (
          <span
            className="rte-rh rte-rh--e"
            onMouseDown={startResize}
            title="Drag to resize"
            role="separator"
            aria-label="Resize video"
          />
        )}
      </div>
    </NodeViewWrapper>
  );
}

/* ── ResizableVideo Extension ───────────────── */

export const ResizableVideo = Node.create({
  name: "resizableVideo",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: {
        default: null,
        parseHTML: (el) => {
          const w = el.getAttribute("data-width");
          return w ? parseInt(w, 10) : null;
        },
        renderHTML: (attrs) => (attrs.width ? { "data-width": attrs.width } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type=resizable-video]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-type": "resizable-video" }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableVideoNodeView);
  },
});

/* ── EmbedFrameNodeView ─────────────────────── */

function EmbedFrameNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const startRef = useRef({ x: 0, width: 0 });

  const { src } = node.attrs as { src: string };
  const width: number = ((node.attrs as Record<string, unknown>).width as number) ?? 480;
  const height: number =
    ((node.attrs as Record<string, unknown>).height as number) ?? Math.round((width * 9) / 16);

  function startResize(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const currentWidth = wrapRef.current?.offsetWidth ?? width;
    startRef.current = { x: e.clientX, width: currentWidth };
    setIsResizing(true);
  }

  useEffect(() => {
    if (!isResizing) return;
    function onMouseMove(e: MouseEvent) {
      const delta = e.clientX - startRef.current.x;
      const newWidth = Math.max(160, Math.round(startRef.current.width + delta));
      updateAttributes({ width: newWidth, height: Math.round((newWidth * 9) / 16) });
    }
    function onMouseUp() {
      setIsResizing(false);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing, updateAttributes]);

  return (
    <NodeViewWrapper
      as="div"
      className={`rte-embed-wrapper${selected ? " rte-embed-wrapper--selected" : ""}`}
    >
      <div
        ref={wrapRef}
        style={{
          display: "inline-block",
          position: "relative",
          width: `${width}px`,
          maxWidth: "100%",
        }}
      >
        <iframe
          src={src}
          width={width}
          height={height}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
          title="Embedded video"
          style={{ display: "block", border: "none", maxWidth: "100%" }}
        />
        {selected && (
          <span
            className="rte-rh rte-rh--e"
            onMouseDown={startResize}
            title="Drag to resize"
            role="separator"
            aria-label="Resize embed"
          />
        )}
      </div>
    </NodeViewWrapper>
  );
}

/* ── EmbedFrame Extension ───────────────────── */

export const EmbedFrame = Node.create({
  name: "embedFrame",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: 480 },
      height: { default: 270 },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type=embed-frame]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-type": "embed-frame" }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedFrameNodeView);
  },
});
