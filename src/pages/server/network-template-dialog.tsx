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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>网络模板</DialogTitle>
            <DialogDescription>当前协议暂无可用模板</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>网络模板</DialogTitle>
          <DialogDescription>
            选择一个预设网络模板，一键填充协议配置
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {templates.map((tmpl) => (
            <label
              key={tmpl.id}
              className="block cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{tmpl.label}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {protocol}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{tmpl.description}</p>
                </div>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onApply(tmpl);
                  }}
                >
                  <Check className="h-4 w-4" />
                  使用
                </Button>
              </div>
            </label>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
