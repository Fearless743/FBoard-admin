import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { usePlugins } from "./provider";
import { normalizePage, pageMatches } from "./page";
import { ExtensionRenderer } from "./slot";
import type { AdminUiExtension } from "./types";

interface AnchorMount {
  extension: AdminUiExtension;
  container: HTMLElement;
}

/**
 * CSS 锚点注入层：把声明了 anchor 的扩展块挂载到页面任意 DOM 节点旁。
 * 通过 MutationObserver 处理页面异步渲染 / 路由切换后锚点尚未出现的场景。
 * 需要放在 Router 内、且不随页面 key 重挂载（通常放在 AppShell）。
 */
export function PluginAnchors() {
  const { extensions, ready } = usePlugins();
  const location = useLocation();
  const currentPage = normalizePage(location.pathname);
  const [mounts, setMounts] = useState<AnchorMount[]>([]);

  useEffect(() => {
    const anchored = ready
      ? extensions.filter(
          (extension) => extension.anchor && pageMatches(extension, currentPage),
        )
      : [];

    if (anchored.length === 0) {
      setMounts([]);
      return;
    }

    const pending = new Set(anchored.map((extension) => extension.id));
    const created: AnchorMount[] = [];
    const containers: HTMLElement[] = [];
    let observer: MutationObserver | null = null;
    let disposed = false;
    let frame = 0;
    let timer = 0;

    const resolve = () => {
      if (disposed || pending.size === 0) return;

      let changed = false;
      for (const extension of anchored) {
        if (!pending.has(extension.id) || !extension.anchor) continue;

        let target: Element | null = null;
        try {
          target = document.querySelector(extension.anchor.selector);
        } catch {
          // 非法选择器：直接放弃该扩展块，避免每帧都抛异常
          pending.delete(extension.id);
          continue;
        }
        if (!(target instanceof HTMLElement)) continue;

        const container = document.createElement("div");
        container.setAttribute("data-fboard-anchor", extension.id);

        const position = extension.anchor.position ?? "append";
        if (position === "before") target.before(container);
        else if (position === "after") target.after(container);
        else if (position === "prepend") target.prepend(container);
        else target.append(container);

        containers.push(container);
        created.push({ extension, container });
        pending.delete(extension.id);
        changed = true;
      }

      if (changed) setMounts([...created]);
      else if (pending.size === 0) setMounts([]);
      if (pending.size === 0) {
        observer?.disconnect();
        window.clearTimeout(timer);
      }
    };

    // MutationObserver 在 DOM 抖动期可能每批变更都回调，这里合并到每帧一次，
    // 避免大量重复的 querySelector 扫描拖慢路由切换/表格渲染
    const schedule = () => {
      if (disposed || frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        resolve();
      });
    };

    observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    resolve();

    timer = window.setTimeout(() => observer?.disconnect(), 10000);

    return () => {
      disposed = true;
      observer?.disconnect();
      observer = null;
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      containers.forEach((container) => container.remove());
    };
  }, [extensions, ready, currentPage]);

  return (
    <>
      {mounts.map((mount) =>
        createPortal(
          <ExtensionRenderer
            extension={mount.extension}
            slot={null}
            page={currentPage}
          />,
          mount.container,
          mount.extension.id,
        ),
      )}
    </>
  );
}
