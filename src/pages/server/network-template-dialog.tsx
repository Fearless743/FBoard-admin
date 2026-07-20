import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTemplatesForProtocol, type NetworkTemplate } from "./network-templates";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  protocol: string;
  onApply: (template: NetworkTemplate) => void;
}

export function NetworkTemplateDialog({ open, onOpenChange, protocol, onApply }: Props) {
  const { t } = useTranslation();

  const templates = useMemo(() => getTemplatesForProtocol(protocol), [protocol]);

  if (templates.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
            <DialogTitle>{t("server.networkTemplate.title")}</DialogTitle>
            <DialogDescription>
              {t("server.networkTemplate.empty")}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>{t("server.networkTemplate.title")}</DialogTitle>
          <DialogDescription>
            {t("server.networkTemplate.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6 py-4">
          {templates.map((tmpl) => (
            <label
              key={tmpl.id}
              className="block cursor-pointer rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t(tmpl.labelKey)}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {protocol}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{t(tmpl.descriptionKey)}</p>
                </div>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onApply(tmpl);
                  }}
                >
                  <Check className="h-4 w-4" />
                  {t("server.networkTemplate.use")}
                </Button>
              </div>
            </label>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
