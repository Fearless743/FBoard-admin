import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/common/page-header";
import { Construction } from "lucide-react";

interface PlaceholderProps {
  title?: string;
  description?: string;
  /** i18n key，位于 nav.* 之下；传此项时优先使用 */
  titleKey?: string;
  /** 描述的 i18n key */
  descriptionKey?: string;
}

/** 临时页面占位 —— 路由跑起来后逐页替换为真实实现 */
export function Placeholder({
  title,
  description,
  titleKey,
  descriptionKey,
}: PlaceholderProps) {
  const { t } = useTranslation();
  const pageTitle = titleKey ? t(`nav.${extractKey(titleKey)}`) : title || "";
  const pageDesc = descriptionKey ? t(descriptionKey) : description;

  let resolvedTitle = pageTitle;
  if (titleKey) {
    // titleKey 形如 "nav.userManagement" 或 "userManagement"
    const full = titleKey.startsWith("nav.") ? titleKey : `nav.${titleKey}`;
    resolvedTitle = t(full);
    if (resolvedTitle === full) resolvedTitle = title || titleKey;
  }

  return (
    <>
      <PageHeader title={resolvedTitle} description={pageDesc} />
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-card/50 p-8 text-center">
        <Construction className="h-10 w-10 text-muted-foreground/60" />
        <div className="space-y-1">
          <p className="text-sm font-medium">{resolvedTitle}</p>
          {pageDesc && <p className="max-w-md text-xs text-muted-foreground">{pageDesc}</p>}
        </div>
        <p className="text-xs text-muted-foreground/60">
          {t("common.pageNotImplemented")}
        </p>
      </div>
    </>
  );
}

function extractKey(k: string): string {
  return k.startsWith("nav.") ? k.slice(4) : k;
}
