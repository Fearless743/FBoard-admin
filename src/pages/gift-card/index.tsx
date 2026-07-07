import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Gift } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createGiftCardTemplate,
  deleteGiftCardTemplate,
  fetchGiftCardCodes,
  fetchGiftCardTemplates,
  fetchGiftCardUsages,
  generateGiftCardCodes,
  toggleGiftCardCode,
  updateGiftCardTemplate,
  type GiftCardTemplate,
} from "@/api/misc";

export function GiftCardPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader
        title={t("giftCard.title")}
        description={t("giftCard.description")}
      />
      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">{t("giftCard.tabs.templates")}</TabsTrigger>
          <TabsTrigger value="codes">{t("giftCard.tabs.codes")}</TabsTrigger>
          <TabsTrigger value="usages">{t("giftCard.tabs.usages")}</TabsTrigger>
        </TabsList>
        <TabsContent value="templates">
          <TemplatesPanel />
        </TabsContent>
        <TabsContent value="codes">
          <CodesPanel />
        </TabsContent>
        <TabsContent value="usages">
          <UsagesPanel />
        </TabsContent>
      </Tabs>
    </>
  );
}

function TemplatesPanel() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GiftCardTemplate | null>(null);
  const [deleting, setDeleting] = useState<GiftCardTemplate | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["gift-card", "templates"],
    queryFn: fetchGiftCardTemplates,
  });
  const list: GiftCardTemplate[] = data?.data || [];

  return (
    <>
      <div className="mb-4">
        <Button onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="h-4 w-4" />
          {t("giftCard.template.form.add")}
        </Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">{t("giftCard.template.table.columns.id")}</TableHead>
              <TableHead>{t("giftCard.template.table.columns.name")}</TableHead>
              <TableHead>{t("giftCard.template.table.columns.type")}</TableHead>
              <TableHead className="w-24 text-center">{t("giftCard.template.table.columns.status")}</TableHead>
              <TableHead className="w-24 text-right">{t("giftCard.template.table.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}><Skeleton className="h-20 w-full" /></TableCell>
              </TableRow>
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState icon={<Gift className="h-10 w-10" />} />
                </TableCell>
              </TableRow>
            ) : (
              list.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-mono text-xs">#{g.id}</TableCell>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{t(`giftCard.types.${g.type}`)}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {g.status ? <Badge variant="success">ON</Badge> : <Badge variant="secondary">OFF</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => { setEditing(g); setOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleting(g)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TemplateFormDialog
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        template={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ["gift-card", "templates"] })}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t("giftCard.template.actions.deleteConfirm.title")}
        description={t("giftCard.template.actions.deleteConfirm.description")}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await deleteGiftCardTemplate(deleting.id);
            toast.success(t("giftCard.messages.templateDeleted"));
            qc.invalidateQueries({ queryKey: ["gift-card", "templates"] });
            setDeleting(null);
          } catch (e) {}
        }}
      />
    </>
  );
}

function TemplateFormDialog({
  open,
  onOpenChange,
  template,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  template: GiftCardTemplate | null;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [type, setType] = useState<1 | 2 | 3 | 4>(1);
  const [submitting, setSubmitting] = useState(false);

  // 简单的形式：只允许编辑 name/type，复杂字段（rewards/conditions）放 JSON 文本
  const [advancedJson, setAdvancedJson] = useState("");

  if (open && !name && template?.name) {
    setName(template.name);
    setType((template.type as any) || 1);
    setAdvancedJson(JSON.stringify(template, null, 2));
  }
  if (open && !template && !name) {
    setName("");
    setAdvancedJson("");
  }

  const submit = async () => {
    setSubmitting(true);
    try {
      let payload: any = { name, type };
      if (advancedJson) {
        try {
          payload = { ...payload, ...JSON.parse(advancedJson), name, type };
        } catch (e) {
          toast.error("JSON 格式错误");
          setSubmitting(false);
          return;
        }
      }
      if (template) {
        await updateGiftCardTemplate({ id: template.id, ...payload });
        toast.success(t("giftCard.messages.templateUpdated"));
      } else {
        await createGiftCardTemplate(payload);
        toast.success(t("giftCard.messages.templateCreated"));
      }
      onSaved();
      onOpenChange(false);
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? t("giftCard.template.form.edit") : t("giftCard.template.form.add")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t("giftCard.template.form.name.label")}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("giftCard.template.form.type.label")}</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              value={type}
              onChange={(e) => setType(Number(e.target.value) as 1 | 2 | 3 | 4)}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {t(`giftCard.types.${n}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>高级 JSON（可选）</Label>
            <textarea
              rows={10}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs"
              value={advancedJson}
              onChange={(e) => setAdvancedJson(e.target.value)}
              placeholder='{"rewards": {...}, "conditions": {...}, ...}'
            />
            <p className="text-xs text-muted-foreground">
              完整字段请参考后端礼品卡接口文档
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("giftCard.template.form.submit.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CodesPanel() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["gift-card", "codes"],
    queryFn: fetchGiftCardCodes,
  });
  const list: any[] = data?.data || [];

  return (
    <>
      <div className="mb-4">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("giftCard.code.form.generate")}
        </Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>{t("giftCard.code.table.columns.code")}</TableHead>
              <TableHead>{t("giftCard.code.table.columns.template_name")}</TableHead>
              <TableHead>{t("giftCard.code.table.columns.status")}</TableHead>
              <TableHead className="text-right">{t("giftCard.code.table.columns.usage_count")}</TableHead>
              <TableHead>{t("giftCard.code.table.columns.created_at")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}><Skeleton className="h-20 w-full" /></TableCell>
              </TableRow>
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}><EmptyState /></TableCell>
              </TableRow>
            ) : (
              list.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">#{c.id}</TableCell>
                  <TableCell className="font-mono text-xs">{c.code}</TableCell>
                  <TableCell>{c.template_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{String(t(`giftCard.code.status.${c.status}`, c.status))}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.usage_count}/{c.max_usage}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.created_at}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <GenerateCodesDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function GenerateCodesDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useTranslation();
  const [templateId, setTemplateId] = useState("");
  const [count, setCount] = useState("10");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!templateId) {
      toast.error("请选择模板");
      return;
    }
    setSubmitting(true);
    try {
      const res = await generateGiftCardCodes({
        template_id: Number(templateId),
        count: Number(count) || 1,
      });
      toast.success(t("giftCard.messages.codesGenerated"));
      onOpenChange(false);
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("giftCard.code.form.generate")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t("giftCard.code.form.template_id.label")}</Label>
            <Input
              type="number"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              placeholder="Template ID"
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("giftCard.code.form.count.label")}</Label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("giftCard.code.form.submit.generate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UsagesPanel() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["gift-card", "usages"],
    queryFn: fetchGiftCardUsages,
  });
  const list: any[] = data?.data || [];

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">ID</TableHead>
            <TableHead>{t("giftCard.usage.table.columns.code")}</TableHead>
            <TableHead>{t("giftCard.usage.table.columns.user_email")}</TableHead>
            <TableHead>{t("giftCard.usage.table.columns.rewards_given")}</TableHead>
            <TableHead>{t("giftCard.usage.table.columns.ip_address")}</TableHead>
            <TableHead>{t("giftCard.usage.table.columns.created_at")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6}><Skeleton className="h-20 w-full" /></TableCell>
            </TableRow>
          ) : list.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}><EmptyState /></TableCell>
            </TableRow>
          ) : (
            list.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-mono text-xs">#{u.id}</TableCell>
                <TableCell className="font-mono text-xs">{u.code}</TableCell>
                <TableCell>{u.user_email}</TableCell>
                <TableCell className="text-xs">
                  {u.rewards_given ? JSON.stringify(u.rewards_given) : "—"}
                </TableCell>
                <TableCell className="text-xs">{u.ip_address}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{u.created_at}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
