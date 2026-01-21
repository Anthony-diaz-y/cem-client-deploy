"use client";

import { Editor } from "@tiptap/react";
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
import { useCallback } from "react";
import ToolbarButton from "./RichTextEditorToolbarButton";

interface MenuBarProps {
  editor: Editor | null;
}

const useSetLink = (editor: Editor | null) => {
  return useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  }, [editor]);
};

const MenuBar = ({ editor }: MenuBarProps) => {
  const setLink = useSetLink(editor);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-richblack-700 border-b border-richblack-600 rounded-t-lg sticky top-0 z-10">
      <ToolbarButton
        icon={MdUndo}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Deshacer"
      />
      <ToolbarButton
        icon={MdRedo}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Rehacer"
      />

      <div className="w-px h-6 bg-richblack-600 mx-1" />

      <ToolbarButton
        icon={MdFormatBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Negrita"
      />
      <ToolbarButton
        icon={MdFormatItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Cursiva"
      />
      <ToolbarButton
        icon={MdFormatUnderlined}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Subrayado"
      />

      <div className="w-px h-6 bg-richblack-600 mx-1" />

      <ToolbarButton
        icon={MdFormatListBulleted}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Lista de viñetas"
      />
      <ToolbarButton
        icon={MdFormatListNumbered}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Lista numerada"
      />

      <div className="w-px h-6 bg-richblack-600 mx-1" />

      <ToolbarButton
        icon={MdFormatAlignLeft}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="Alinear a la izquierda"
      />
      <ToolbarButton
        icon={MdFormatAlignCenter}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="Centrar"
      />
      <ToolbarButton
        icon={MdFormatAlignRight}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="Alinear a la derecha"
      />

      <div className="w-px h-6 bg-richblack-600 mx-1" />

      <ToolbarButton
        icon={MdLink}
        onClick={setLink}
        isActive={editor.isActive("link")}
        title="Insertar enlace"
      />
      <ToolbarButton
        icon={MdLinkOff}
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        title="Quitar enlace"
      />

      <div className="w-px h-6 bg-richblack-600 mx-1" />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          if (editor.isActive("heading", { level: 1 })) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }
        }}
        className={`px-2 py-1 rounded text-sm font-bold ${
          editor.isActive("heading", { level: 1 })
            ? "bg-yellow-50/20 text-yellow-50"
            : "text-richblack-300 hover:bg-richblack-600 hover:text-richblack-5"
        }`}
        title="Título 1"
      >
        H1
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          if (editor.isActive("heading", { level: 2 })) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }
        }}
        className={`px-2 py-1 rounded text-sm font-bold ${
          editor.isActive("heading", { level: 2 })
            ? "bg-yellow-50/20 text-yellow-50"
            : "text-richblack-300 hover:bg-richblack-600 hover:text-richblack-5"
        }`}
        title="Título 2"
      >
        H2
      </button>

      <div className="w-px h-6 bg-richblack-600 mx-1" />

      <ToolbarButton
        icon={MdFormatQuote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="Cita"
      />
      <ToolbarButton
        icon={MdCode}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        title="Bloque de código"
      />
      <ToolbarButton
        icon={MdFormatClear}
        onClick={() => {
          editor.chain()
            .focus()
            .clearNodes()
            .unsetAllMarks()
            .setParagraph()
            .run();
        }}
        title="Limpiar formato"
      />
    </div>
  );
};

export default MenuBar;

