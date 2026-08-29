"use client";

import { useEffect, useRef, useState } from "react";
import { uploadImageFile } from "@/lib/upload-image";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onError: (message: string) => void;
};

const tools = [
  { label: "제목", command: "formatBlock", value: "h2" },
  { label: "소제목", command: "formatBlock", value: "h3" },
  { label: "본문", command: "formatBlock", value: "p" },
  { label: "굵게", command: "bold" },
  { label: "기울임", command: "italic" },
  { label: "밑줄", command: "underline" },
  { label: "목록", command: "insertUnorderedList" },
  { label: "번호", command: "insertOrderedList" },
  { label: "인용", command: "formatBlock", value: "blockquote" },
] as const;

function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function RichTextEditor({ value, onChange, onError }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!initialized.current && editorRef.current) {
      editorRef.current.innerHTML = value || "<p><br></p>";
      initialized.current = true;
    }
  }, [value]);

  function run(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML ?? "");
  }

  function addLink() {
    const url = window.prompt("연결할 주소를 입력하세요. (https://...)");
    if (!url) return;
    run("createLink", url);
  }

  async function addImage(file: File) {
    setUploading(true);
    onError("");
    const result = await uploadImageFile(file);
    setUploading(false);
    if (!result.ok) {
      onError(result.error);
      return;
    }
    const alt = window.prompt("이미지 설명을 입력하세요.", file.name) || file.name;
    run(
      "insertHTML",
      `<figure><img src="${escapeAttribute(result.url)}" alt="${escapeAttribute(alt)}"><figcaption>${escapeAttribute(alt)}</figcaption></figure><p><br></p>`,
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-rose-200 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-rose-100 bg-rose-50 p-2">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => run(tool.command, "value" in tool ? tool.value : undefined)}
            className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-rose-100 hover:bg-rose-100"
          >
            {tool.label}
          </button>
        ))}
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={addLink} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-rose-100 hover:bg-rose-100">
          링크
        </button>
        <label className="cursor-pointer rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700">
          {uploading ? "이미지 업로드 중" : "본문 이미지"}
          <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void addImage(file); event.currentTarget.value = ""; }} />
        </label>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        className="content-editor min-h-[520px] px-6 py-5 text-base leading-8 text-slate-700 outline-none sm:px-8"
        data-placeholder="여기에 콘텐츠 본문을 작성하세요."
      />
    </div>
  );
}
