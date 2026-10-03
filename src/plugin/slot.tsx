import { Component, useState, type ErrorInfo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { executePluginAction } from "@/api/misc";
import { applyPluginActionResult, unwrapPluginActionResponse } from "@/lib/plugin-action";
import { usePlugins } from "./provider";
import { getExtension } from "./registry";
import { normalizePage, pageMatches } from "./page";
import { resolveIcon } from "./nav";
import type { AdminUiExtension } from "./types";

class ExtensionErrorBoundary extends Component<
  { extensionId: string; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `[FboardAdmin] 插件控件 "${this.props.extensionId}" 渲染失败:`,
      error,
      info,
    );
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          插件控件 {this.props.extensionId} 渲染失败：{this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

/** 声明式按钮/链接：可选调用本插件的 registerAction，或直接打开 url */
function ButtonContribution({ extension }: { extension: AdminUiExtension }) {
  const [loading, setLoading] = useState(false);
  const Icon = extension.icon ? resolveIcon(extension.icon) : null;
  const label = extension.label || extension.name;

  const handleClick = async () => {
    if (extension.confirm && !window.confirm(extension.confirm)) {
      return;
    }

    if (extension.action) {
      setLoading(true);
      try {
        const res = await executePluginAction(
          extension.plugin,
          extension.action,
          extension.params || {},
        );
        applyPluginActionResult(unwrapPluginActionResponse(res), undefined, {
          fallbackMessage: label,
          onToastSuccess: (m) => toast.success(m),
          onToastError: (m) => toast.error(m),
        });
      } catch {
        // 请求层已统一提示错误
      } finally {
        setLoading(false);
      }
      return;
    }

    if (extension.url) {
      window.open(extension.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Button
      variant={extension.variant || "default"}
      size="sm"
      disabled={loading}
      onClick={() => void handleClick()}
    >
      {Icon && <Icon className="mr-1.5 h-4 w-4" />}
      {label}
    </Button>
  );
}

/** 渲染单个扩展块（组件 / 原始 HTML / iframe / 按钮 / 链接） */
export function ExtensionRenderer({
  extension,
  slot,
  page,
}: {
  extension: AdminUiExtension;
  slot: string | null;
  page: string;
}) {
  let node: ReactNode = null;

  if (extension.type === "button" || extension.type === "link") {
    node = <ButtonContribution extension={extension} />;
  } else if (extension.type === "html") {
    node = <div dangerouslySetInnerHTML={{ __html: extension.html ?? "" }} />;
  } else if (extension.type === "iframe") {
    node = (
      <iframe
        src={extension.url ?? ""}
        title={extension.title || extension.id}
        className="h-64 w-full rounded-md border bg-background"
      />
    );
  } else {
    const PluginComponent = extension.component
      ? getExtension(extension.component)
      : undefined;
    if (!PluginComponent) {
      node = import.meta.env.DEV ? (
        <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
          插件控件 {extension.component} 未注册（脚本未加载或未调用 registerExtension）
        </div>
      ) : null;
    } else {
      node = <PluginComponent extension={extension} slot={slot} page={page} />;
    }
  }

  return (
    <ExtensionErrorBoundary extensionId={extension.id}>
      {node}
    </ExtensionErrorBoundary>
  );
}

/**
 * 具名插槽。插件扩展块声明 `slot` 与当前插槽名一致时渲染。
 * `page` 不传时自动取当前路由，扩展块还可用 page 规则进一步限定生效页面。
 */
export function PluginSlot({
  name,
  page,
  className,
}: {
  name: string;
  page?: string;
  className?: string;
}) {
  const { extensions, ready } = usePlugins();
  const location = useLocation();
  const currentPage = page ?? normalizePage(location.pathname);

  const matched = extensions.filter(
    (extension) =>
      extension.slot === name && pageMatches(extension, currentPage),
  );

  if (!ready || matched.length === 0) return null;

  return (
    <div className={cn(className)} data-fboard-slot={name}>
      {matched.map((extension) => (
        <ExtensionRenderer
          key={extension.id}
          extension={extension}
          slot={name}
          page={currentPage}
        />
      ))}
    </div>
  );
}
