import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Fingerprint, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  passkeyDelete,
  passkeyList,
  passkeyRegisterOptions,
  passkeyRegisterVerify,
  type PasskeyItem,
} from "@/api/passkey";
import { startRegistration } from "@simplewebauthn/browser";

export function PasskeyDialog({
  open,
  onOpenChange,
  mandatory,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mandatory?: boolean;
}) {
  const { t } = useTranslation();
  const [items, setItems] = useState<PasskeyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [name, setName] = useState("");

  const fetchList = async () => {
    setLoading(true);
    try {
      setItems(await passkeyList());
    } catch {
      /* toast 已由拦截器处理 */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) void fetchList();
  }, [open ]);

  const handleAdd = async () => {
    setWorking(true);
    try {
      const options = await passkeyRegisterOptions();
      const credential = await startRegistration({ optionsJSON: options as any });
      await passkeyRegisterVerify(credential, name || undefined);
      toast.success(t("common.success"));
      setName("");
      await fetchList();
    } catch (e: any) {
      if (e?.name !== "NotAllowedError") {
        // startRegistration 取消不弹错
      }
    } finally {
      setWorking(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (items.length <= 1) {
      toast.error(t("auth.passkey.keepOne"));
      return;
    }
    setWorking(true);
    try {
      await passkeyDelete(id);
      toast.success(t("common.success"));
      await fetchList();
    } finally {
      setWorking(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (mandatory && !v) return;
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-md gap-0 overflow-y-auto p-0">
        <DialogHeader className="shrink-0 px-6 pb-2 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            {t("auth.passkey.title")}
          </DialogTitle>
          <DialogDescription>
            {mandatory ? t("auth.passkey.mandatoryHint") : t("auth.passkey.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              {t("auth.passkey.empty")}
            </p>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Fingerprint className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.last_used_at
                        ? t("auth.passkey.lastUsed", {
                            time: new Date(item.last_used_at * 1000).toLocaleString(),
                          })
                        : t("auth.passkey.neverUsed")}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={working || items.length <= 1}
                    onClick={() => handleDelete(item.id)}
                    title={t("common.delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-2">
            <Label htmlFor="passkey-name">{t("auth.passkey.nameLabel")}</Label>
            <Input
              id="passkey-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("auth.passkey.namePlaceholder")}
              maxLength={64}
            />
          </div>
          <Button className="w-full" disabled={working} onClick={handleAdd}>
            {working && <Loader2 className="h-4 w-4 animate-spin" />}
            <Plus className="h-4 w-4" />
            {t("auth.passkey.add")}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("auth.passkey.phoneHint")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
