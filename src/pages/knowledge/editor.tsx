import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export interface KnowledgeEditorProps {
  value: string;
  onChange: (v: string) => void;
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
