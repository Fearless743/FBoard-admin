import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { adminGet, adminPost } from "@/api/client";
import { formatBytes, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { UserListItem } from "@/api/user";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: UserListItem | null;
  onDone: () => void;
}

export function UserTrafficResetDialog({ open, onOpenChange, user, onDone }: Props) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: history } = useQuery({
    queryKey: ["user", "traffic-reset", "history", user?.id],
    queryFn: () => adminGet<any>("/traffic-reset/user/" + user?.id + "/history"),
    enabled: open && !!user,
  });

  const submit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await adminPost<any>("/traffic-reset/reset-user", { user_id: user.id, reason });
      toast.success(t("user.traffic_reset.reset_success"));
      setReason("");
      onDone();
      onOpenChange(false);
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>{t("user.traffic_reset.title")}</DialogTitle>
          <DialogDescription>
            {t("user.traffic_reset.description", { email: user.email })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">

        <Tabs defaultValue="reset" className="w-full">
          <TabsList>
            <TabsTrigger value="reset">{t("user.traffic_reset.tabs.reset")}</TabsTrigger>
            <TabsTrigger value="history">{t("user.traffic_reset.tabs.history")}</TabsTrigger>
          </TabsList>

          <TabsContent value="reset" className="space-y-4">
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="mb-2 text-sm font-medium">{t("user.traffic_reset.user_info")}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="text-muted-foreground">{t("user.columns.email")}</span>
                <span className="font-medium">{user.email}</span>
                <span className="text-muted-foreground">{t("user.columns.used_traffic")}</span>
                <span className="font-medium">{formatBytes((user.u || 0) + (user.d || 0))}</span>
              </div>
            </div>

            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-500">
                    {t("user.traffic_reset.warning.title")}
                  </p>
                  <ul className="space-y-0.5 text-xs text-amber-700/80 dark:text-amber-500/80">
                    <li>• {t("user.traffic_reset.warning.irreversible")}</li>
                    <li>• {t("user.traffic_reset.warning.reset_to_zero")}</li>
                    <li>• {t("user.traffic_reset.warning.logged")}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{t("user.traffic_reset.reason.label")}</Label>
              <Textarea
                rows={3}
                placeholder={t("user.traffic_reset.reason.placeholder")}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {t("user.traffic_reset.reason.optional")}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            <div className="rounded-md border bg-muted/30 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("user.traffic_reset.history.reset_count")}</span>
                <span className="font-medium">{history?.total_count ?? "—"}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-muted-foreground">{t("user.traffic_reset.history.last_reset")}</span>
                <span className="font-medium">{history?.last_reset ? formatDate(history.last_reset) : t("user.traffic_reset.history.never")}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{t("user.traffic_reset.history.recent_records")}</p>
            <div className="space-y-2">
              {(history?.records || []).slice(0, 10).map((r: any, i: number) => (
                <div key={i} className="rounded-md border p-2 text-xs">
                  <div className="flex justify-between">
                    <span>{formatDate(r.reset_at)}</span>
                    <Badge>{r.reset_type}</Badge>
                  </div>
                  <div className="mt-1 text-muted-foreground">
                    ↑ {formatBytes(r.cleared_u || 0)} / ↓ {formatBytes(r.cleared_d || 0)}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        </div>

        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("user.traffic_reset.confirm_reset")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}