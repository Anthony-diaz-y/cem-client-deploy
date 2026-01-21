"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdUndo,
  MdRedo,
  MdFormatClear,
  MdLink,
  MdLinkOff,
  MdCode,
  MdFormatQuote
} from "react-icons/md";
import { IconType } from "react-icons";
import { useCallback, useEffect } from "react";
import ToolbarButton from "./RichTextEditorToolbarButton";
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
          class: "text-blue-200 underline cursor-pointer",
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
        class: "prose prose-invert max-w-none min-h-[250px] p-4 outline-none",
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
    <div className={`border border-richblack-600 rounded-lg overflow-hidden bg-richblack-800 focus-within:border-yellow-50 focus-within:ring-1 focus-within:ring-yellow-50 transition-all ${disabled ? "opacity-50" : ""}`}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror {
          color: #F1F2FF;
          font-size: 16px;
          line-height: 1.6;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #838894;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        .ProseMirror a {
          color: #47A5C5;
          text-decoration: underline;
          cursor: pointer;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #424854;
          padding-left: 1rem;
          color: #AFB2BF;
        }
        .ProseMirror pre {
          background: #161D29;
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

