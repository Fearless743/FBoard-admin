import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { StreamLanguage } from "@codemirror/language";
import { useSettingsStore } from "@/store/settings";

const confLanguage = StreamLanguage.define({
  name: "conf",
  token(stream) {
    if (stream.eatSpace()) return null;
    if (stream.match("//") || stream.match("#")) {
      stream.skipToEnd();
      return "lineComment";
    }
    if (stream.sol() && stream.match(/^\[[^\]]*\]/)) return "heading";
    if (stream.match(/^[A-Za-z_][\w.-]*(?=\s*=)/)) return "attributeName";
    if (stream.match(/^=/)) return "operator";
    if (stream.match(/^"[^"]*"/)) return "string";
    if (stream.match(/^[a-zA-Z][\w-]*(?=\s*\()/)) return "keyword";
    stream.next();
    return null;
  },
  languageData: {
    commentTokens: { line: ["#", "//"] },
  },
});

interface CodeEditorProps {
  value: string;
  onChange: (v: string) => void;
  language: "json" | "yaml" | "conf" | "text";
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const theme = useSettingsStore((s) => s.theme);
  const isDark = useMemo(() => {
    if (theme === "dark") return true;
    if (theme === "light") return false;
    return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  }, [theme]);

  const extensions = useMemo(() => {
    const exts = [
      EditorView.lineWrapping,
      EditorView.theme({
        "&": { fontSize: "12px" },
        ".cm-scroller": { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace" },
      }),
    ];
    if (language === "json") exts.push(json());
    else if (language === "yaml") exts.push(yaml());
    else if (language === "conf") exts.push(confLanguage);
    return exts;
  }, [language]);

  return (
    <div className="overflow-hidden rounded-md border bg-background">
      <CodeMirror
        value={value}
        onChange={onChange}
        theme={isDark ? oneDark : "light"}
        extensions={extensions}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          autocompletion: false,
          bracketMatching: language === "json",
          closeBrackets: language === "json",
        }}
        minHeight="480px"
      />
    </div>
  );
}