import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface ReadmeMarkdownProps {
  content: string;
}

/**
 * 插件说明的 Markdown 渲染单独拆包：react-markdown + remark-gfm 体积较大，
 * 仅在打开「插件说明」弹窗时才加载。
 */
export default function ReadmeMarkdown({ content }: ReadmeMarkdownProps) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
