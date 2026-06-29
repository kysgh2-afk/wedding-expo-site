"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef, useState } from "react";
import { plainTextToHtml } from "@/lib/html";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const TEXT_COLORS = [
  { label: "기본", value: "" },
  { label: "로즈", value: "#e11d48" },
  { label: "파랑", value: "#2563eb" },
  { label: "초록", value: "#16a34a" },
  { label: "보라", value: "#9333ea" },
  { label: "주황", value: "#ea580c" },
];

const HIGHLIGHT_COLORS = [
  { label: "없음", value: "" },
  { label: "노랑", value: "#fef08a" },
  { label: "핑크", value: "#fce7f3" },
  { label: "하늘", value: "#dbeafe" },
  { label: "연두", value: "#dcfce7" },
  { label: "회색", value: "#f1f5f9" },
];

function toolbarButtonClass(isActive = false) {
  return `rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
    isActive
      ? "bg-rose-600 text-white"
      : "bg-white text-slate-700 ring-1 ring-rose-100 hover:bg-rose-50"
  }`;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "본문을 입력하세요. 이미지는 본문 중간에도 자유롭게 넣을 수 있습니다.",
}: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value.includes("<") ? value : plainTextToHtml(value),
    editorProps: {
      attributes: {
        class: "article-editor min-h-72 px-4 py-4 outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;

      setUploading(true);
      setUploadError("");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (!response.ok) {
          setUploadError(data.error || "이미지 업로드에 실패했습니다.");
          return;
        }

        editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
      } catch {
        setUploadError("이미지 업로드에 실패했습니다.");
      } finally {
        setUploading(false);
      }
    },
    [editor],
  );

  if (!editor) {
    return (
      <div className="rounded-xl border border-rose-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
        에디터를 불러오는 중...
      </div>
    );
  }

  function setLink() {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 URL을 입력하세요", previousUrl ?? "https://");

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-rose-200 bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-rose-100 bg-rose-50/60 p-3">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toolbarButtonClass(editor.isActive("bold"))}
        >
          굵게
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toolbarButtonClass(editor.isActive("italic"))}
        >
          기울임
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={toolbarButtonClass(editor.isActive("underline"))}
        >
          밑줄
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={toolbarButtonClass(editor.isActive("strike"))}
        >
          취소선
        </button>

        <span className="hidden h-6 w-px bg-rose-200 sm:block" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toolbarButtonClass(editor.isActive("heading", { level: 2 }))}
        >
          제목1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={toolbarButtonClass(editor.isActive("heading", { level: 3 }))}
        >
          제목2
        </button>

        <span className="hidden h-6 w-px bg-rose-200 sm:block" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolbarButtonClass(editor.isActive("bulletList"))}
        >
          목록
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toolbarButtonClass(editor.isActive("orderedList"))}
        >
          번호
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={toolbarButtonClass(editor.isActive("blockquote"))}
        >
          인용
        </button>
        <button type="button" onClick={setLink} className={toolbarButtonClass(editor.isActive("link"))}>
          링크
        </button>

        <span className="hidden h-6 w-px bg-rose-200 sm:block" />

        <label className="flex items-center gap-1.5 text-xs text-slate-600">
          글자색
          <select
            className="rounded-lg border border-rose-200 bg-white px-2 py-1.5 text-sm"
            value={TEXT_COLORS.find((color) => editor.isActive("textStyle", { color: color.value }))?.value ?? ""}
            onChange={(event) => {
              const color = event.target.value;
              if (!color) {
                editor.chain().focus().unsetColor().run();
                return;
              }
              editor.chain().focus().setColor(color).run();
            }}
          >
            {TEXT_COLORS.map((color) => (
              <option key={color.label} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1.5 text-xs text-slate-600">
          배경색
          <select
            className="rounded-lg border border-rose-200 bg-white px-2 py-1.5 text-sm"
            onChange={(event) => {
              const color = event.target.value;
              if (!color) {
                editor.chain().focus().unsetHighlight().run();
                return;
              }
              editor.chain().focus().setHighlight({ color }).run();
            }}
          >
            {HIGHLIGHT_COLORS.map((color) => (
              <option key={color.label} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          disabled={uploading}
          className={toolbarButtonClass()}
        >
          {uploading ? "업로드 중..." : "사진 삽입"}
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadImage(file);
            event.target.value = "";
          }}
        />
      </div>

      <EditorContent editor={editor} />

      {uploadError ? <p className="px-4 pb-3 text-sm text-rose-600">{uploadError}</p> : null}
    </div>
  );
}

export function isEditorContentEmpty(html: string) {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length === 0;
}
