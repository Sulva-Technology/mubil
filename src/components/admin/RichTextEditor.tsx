"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  invalid?: boolean;
};

/** Tiptap editor limited to formatting the public site can render safely. */
export default function RichTextEditor({ id, value, onChange, placeholder = "Start writing...", invalid }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        id,
        class: "prose-mubil max-w-none min-h-[240px] px-4 py-3 outline-none",
        "aria-multiline": "true",
        role: "textbox",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            bullet: e.isActive("bulletList"),
            ordered: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            link: e.isActive("link"),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
          }
        : null,
  });

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link address (leave empty to remove)", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "" || url === "https://") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  const tools = [
    { label: "Bold", icon: Bold, active: state?.bold, run: () => editor?.chain().focus().toggleBold().run() },
    { label: "Italic", icon: Italic, active: state?.italic, run: () => editor?.chain().focus().toggleItalic().run() },
    { label: "Heading", icon: Heading2, active: state?.h2, run: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Subheading", icon: Heading3, active: state?.h3, run: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "Bulleted list", icon: List, active: state?.bullet, run: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "Numbered list", icon: ListOrdered, active: state?.ordered, run: () => editor?.chain().focus().toggleOrderedList().run() },
    { label: "Pull quote", icon: Quote, active: state?.quote, run: () => editor?.chain().focus().toggleBlockquote().run() },
    { label: "Link", icon: Link2, active: state?.link, run: setLink },
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-chip border bg-white transition-[border-color,box-shadow] focus-within:border-brand focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand)_14%,transparent)]",
        invalid ? "border-error" : "border-line",
      )}
    >
      <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-0.5 border-b border-line bg-bg px-2 py-1.5">
        {tools.map(({ label, icon: Icon, active, run }) => (
          <button
            key={label}
            type="button"
            onClick={run}
            aria-label={label}
            aria-pressed={!!active}
            title={label}
            className={cn("grid size-9 place-items-center rounded-lg text-ink-2 hover:bg-white hover:text-ink", active && "bg-white text-brand-text shadow-card")}
          >
            <Icon aria-hidden className="size-4" />
          </button>
        ))}
        <span aria-hidden className="mx-1 h-5 w-px bg-line" />
        <button type="button" onClick={() => editor?.chain().focus().undo().run()} disabled={!state?.canUndo} aria-label="Undo" title="Undo" className="grid size-9 place-items-center rounded-lg text-ink-2 hover:bg-white disabled:opacity-40">
          <Undo2 aria-hidden className="size-4" />
        </button>
        <button type="button" onClick={() => editor?.chain().focus().redo().run()} disabled={!state?.canRedo} aria-label="Redo" title="Redo" className="grid size-9 place-items-center rounded-lg text-ink-2 hover:bg-white disabled:opacity-40">
          <Redo2 aria-hidden className="size-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
