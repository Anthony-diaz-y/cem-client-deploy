"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEffect } from "react";
import MenuBar from "./RichTextEditorMenuBar";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const RichTextEditor = ({ value, onChange, placeholder, disabled }: RichTextEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-cem-primary underline cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
    ],
    content: value || '',
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[250px] p-4 outline-none",
        'data-placeholder': placeholder || 'Escribe aquí...',
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      if (!editor.view.hasFocus()) {
        editor.commands.setContent(value || '', { emitUpdate: false });
      }
    }
  }, [value, editor]);

  return (
    <div className={`border border-cem-neutral-gray-200 rounded-2xl overflow-hidden bg-white focus-within:border-cem-primary focus-within:ring-2 focus-within:ring-cem-primary/10 transition-all ${disabled ? "opacity-50" : ""}`}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror {
          color: #1E293B;
          font-size: 15px;
          line-height: 1.6;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94A3B8;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
          color: #0F172A;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
          color: #0F172A;
        }
        .ProseMirror a {
          color: #02819E;
          text-decoration: underline;
          cursor: pointer;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #E5E7EB;
          padding-left: 1rem;
          color: #64748B;
        }
        .ProseMirror pre {
          background: #F8FAFC;
          padding: 1rem;
          border-radius: 0.5rem;
          font-family: inherit;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
