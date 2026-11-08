import DOMPurify from "dompurify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export interface KnowledgeEditorProps {
  value: string;
  onChange: (v: string) => void;
}

/**
 * 保存前清洗 quill HTML：去掉 script/iframe/object/embed/form 等危险标签
 * 与 on* 事件属性。DOMPurify 默认已 strip 事件属性与 javascript: URI，
 * 这里显式 FORBID_TAGS 做双保险。
 */
export function sanitizeKnowledgeHtml(html: string): string {
  return DOMPurify.sanitize(html ?? "", {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input", "button"],
  });
}

/**
 * 富文本编辑器单独拆包：react-quill（含 snow 主题样式）体积较大，
 * 仅在打开知识库编辑弹窗时才动态加载，避免拖慢列表页首屏。
 */
export default function KnowledgeEditor({ value, onChange }: KnowledgeEditorProps) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
      }}
      style={{ height: "300px" }}
    />
  );
}
