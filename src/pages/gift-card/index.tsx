import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Gift, Download, ChevronDown, ChevronRight, X, GripVertical, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { IdBadge } from "@/components/common/id-badge";
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
import { SortableContainer, SortableRow, DragCell } from "@/components/common/sortable-table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createGiftCardTemplate,
  deleteGiftCardTemplate,
  sortGiftCardTemplates,
  fetchGiftCardCodes,
  fetchGiftCardTemplates,
  fetchGiftCardUsages,
  generateGiftCardCodes,
  toggleGiftCardCode,
  updateGiftCardCode,
  deleteGiftCardCode,
  exportGiftCardCodes,
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
  const [dragEnabled, setDragEnabled] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["gift-card", "templates", debouncedSearch],
    queryFn: () => fetchGiftCardTemplates(debouncedSearch),
  });
  const list: GiftCardTemplate[] = data?.data || [];
  // 后端已过滤；filtered 仅作为渲染源
  const filtered = list;

  const handleReorder = useCallback(async (ids: number[]) => {
    try {
      await sortGiftCardTemplates(ids);
      qc.invalidateQueries({ queryKey: ["gift-card", "templates"] });
    } catch (e) {}
  }, [qc]);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("giftCard.common.search")}
            value={search}
            onChange={(e) => { setSearch(e.target.value); if (dragEnabled) setDragEnabled(false); }}
            className="pl-9"
          />
        </div>
        <Button
          variant={dragEnabled ? "default" : "outline"}
          onClick={() => setDragEnabled(!dragEnabled)}
          disabled={!!search}
        >
          <GripVertical className="h-4 w-4" />
          {dragEnabled ? "完成排序" : "编辑排序"}
        </Button>
        <Button onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="h-4 w-4" />
          {t("giftCard.template.form.add")}
        </Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {dragEnabled && <TableHead className="w-10"></TableHead>}
              <TableHead className="w-16">{t("giftCard.template.table.columns.id")}</TableHead>
              <TableHead>{t("giftCard.template.table.columns.name")}</TableHead>
              <TableHead>{t("giftCard.template.table.columns.type")}</TableHead>
              <TableHead className="w-24 text-right">{t("giftCard.template.table.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={dragEnabled ? 5 : 4}><Skeleton className="h-20 w-full" /></TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={dragEnabled ? 5 : 4}>
                  <EmptyState icon={<Gift className="h-10 w-10" />} />
                </TableCell>
              </TableRow>
            ) : (
              <SortableContainer items={list} onReorder={handleReorder} enabled={dragEnabled}>
                {filtered.map((g) => (
                  <SortableRow key={g.id} id={g.id}>
                    <DragCell />
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IdBadge id={g.id} />
                        <Switch
                          checked={!!g.status}
                          onCheckedChange={async (checked) => {
                            try {
                              await updateGiftCardTemplate({ id: g.id, status: checked });
                              toast.success(t("common.success"));
                              qc.invalidateQueries({ queryKey: ["gift-card", "templates"] });
                            } catch (e) {}
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{g.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{t(`giftCard.types.${g.type}`)}</Badge>
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
                  </SortableRow>
                ))}
              </SortableContainer>
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

function CollapsibleSection({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  return (
    <div className="rounded-lg border">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {title}
      </button>
      {open && <div className="space-y-3 px-4 pb-4">{children}</div>}
    </div>
  );
}

function toLocalInput(unix: number): string {
  const d = new Date(unix * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
  const GB = 1073741824;

  const [name, setName] = useState("");
  const [type, setType] = useState<1 | 2 | 3>(1);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [themeColor, setThemeColor] = useState("#6366f1");
  const [icon, setIcon] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  const [balanceReward, setBalanceReward] = useState(0);
  const [transferReward, setTransferReward] = useState(0);
  const [expireDays, setExpireDays] = useState(0);
  const [deviceLimit, setDeviceLimit] = useState(0);
  const [resetPackage, setResetPackage] = useState(false);
  const [inviteRate, setInviteRate] = useState(0);
  const [planId, setPlanId] = useState("");
  const [planValidityDays, setPlanValidityDays] = useState(0);
  const [randomRewards, setRandomRewards] = useState<Array<Record<string, any>>>([]);

  const [condNewUser, setCondNewUser] = useState(false);
  const [condNewUserDays, setCondNewUserDays] = useState(7);
  const [condPaidUser, setCondPaidUser] = useState(false);
  const [condRequireInvite, setCondRequireInvite] = useState(false);
  const [condAllowedPlans, setCondAllowedPlans] = useState("");
  const [condDisallowedPlans, setCondDisallowedPlans] = useState("");

  const [limitMaxUse, setLimitMaxUse] = useState(0);
  const [limitCooldown, setLimitCooldown] = useState(0);

  const [festivalStart, setFestivalStart] = useState("");
  const [festivalEnd, setFestivalEnd] = useState("");
  const [festivalBonus, setFestivalBonus] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (template) {
      setName(template.name || "");
      setType((template.type as any) || 1);
      setDescription(template.description || "");
      setStatus(!!template.status);
      setThemeColor(template.theme_color || "#6366f1");
      setIcon(template.icon || "");
      setBackgroundImage(template.background_image || "");

      const r = template.rewards || {};
      setBalanceReward(r.balance ?? 0);
      setTransferReward(r.transfer_enable ? Math.round((r.transfer_enable / GB) * 100) / 100 : 0);
      setExpireDays(r.expire_days ?? 0);
      setDeviceLimit(r.device_limit ?? 0);
      setResetPackage(!!r.reset_package);
      setInviteRate(r.invite_reward_rate ?? 0);
      setPlanId(r.plan_id ? String(r.plan_id) : "");
      setPlanValidityDays(r.plan_validity_days ?? 0);
      setRandomRewards(r.random_rewards || []);

      const c = template.conditions || {};
      setCondNewUser(!!c.new_user_only);
      setCondNewUserDays(c.new_user_max_days ?? 7);
      setCondPaidUser(!!c.paid_user_only);
      setCondRequireInvite(!!c.require_invite);
      setCondAllowedPlans(c.allowed_plans?.join(", ") || "");
      setCondDisallowedPlans(c.disallowed_plans?.join(", ") || "");

      const l = template.limits || {};
      setLimitMaxUse(l.max_use_per_user ?? 0);
      setLimitCooldown(l.cooldown_hours ?? 0);

      const s = template.special_config || {};
      setFestivalStart(s.start_time ? toLocalInput(s.start_time) : "");
      setFestivalEnd(s.end_time ? toLocalInput(s.end_time) : "");
      setFestivalBonus(s.festival_bonus ?? 1);
    } else {
      setName(""); setType(1); setDescription(""); setStatus(true);
      setThemeColor("#6366f1"); setIcon(""); setBackgroundImage("");
      setBalanceReward(0); setTransferReward(0); setExpireDays(0);
      setDeviceLimit(0); setResetPackage(false); setInviteRate(0);
      setPlanId(""); setPlanValidityDays(0); setRandomRewards([]);
      setCondNewUser(false); setCondNewUserDays(7); setCondPaidUser(false);
      setCondRequireInvite(false); setCondAllowedPlans(""); setCondDisallowedPlans("");
      setLimitMaxUse(0); setLimitCooldown(0);
      setFestivalStart(""); setFestivalEnd(""); setFestivalBonus(1);
    }
  }, [open, template, GB]);

  const { data: plansData } = useQuery({
    queryKey: ["plans", "options"],
    queryFn: async () => {
      const m = await import("@/api/plan");
      return (m.fetchPlans as any)(1, 200);
    },
    enabled: open,
  });
  const plans: any[] = (plansData as any)?.data || [];

  const buildPayload = () => {
    const rewards: Record<string, any> = {};
    if (balanceReward) rewards.balance = balanceReward;
    if (transferReward) rewards.transfer_enable = Math.round(transferReward * GB);
    if (expireDays) rewards.expire_days = expireDays;
    if (deviceLimit) rewards.device_limit = deviceLimit;
    if (resetPackage) rewards.reset_package = true;
    if (inviteRate) rewards.invite_reward_rate = inviteRate;
    if (planId) rewards.plan_id = Number(planId);
    if (planValidityDays) rewards.plan_validity_days = planValidityDays;
    if (randomRewards.length) rewards.random_rewards = randomRewards;

    const conditions: Record<string, any> = {};
    if (condNewUser) { conditions.new_user_only = true; conditions.new_user_max_days = condNewUserDays; }
    if (condPaidUser) conditions.paid_user_only = true;
    if (condRequireInvite) conditions.require_invite = true;
    const ap = condAllowedPlans.split(",").map(s => Number(s.trim())).filter(n => !isNaN(n));
    const dp = condDisallowedPlans.split(",").map(s => Number(s.trim())).filter(n => !isNaN(n));
    if (ap.length) conditions.allowed_plans = ap;
    if (dp.length) conditions.disallowed_plans = dp;

    const limits: Record<string, any> = {};
    if (limitMaxUse) limits.max_use_per_user = limitMaxUse;
    if (limitCooldown) limits.cooldown_hours = limitCooldown;

    const specialConfig: Record<string, any> = {};
    if (festivalStart) specialConfig.start_time = Math.floor(new Date(festivalStart).getTime() / 1000);
    if (festivalEnd) specialConfig.end_time = Math.floor(new Date(festivalEnd).getTime() / 1000);
    if (festivalBonus > 1) specialConfig.festival_bonus = festivalBonus;

    return {
      name, type,
      description: description || undefined,
      status,
      theme_color: themeColor,
      icon: icon || undefined,
      background_image: backgroundImage || undefined,
      rewards,
      conditions: Object.keys(conditions).length ? conditions : undefined,
      limits: Object.keys(limits).length ? limits : undefined,
      special_config: Object.keys(specialConfig).length ? specialConfig : undefined,
    };
  };

  const submit = async () => {
    if (!name) { toast.error(t("giftCard.template.form.name.required") || "请输入名称"); return; }
    setSubmitting(true);
    try {
      const payload = buildPayload();
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
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>
            {template ? t("giftCard.template.form.edit") : t("giftCard.template.form.add")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 px-6 py-4">

          <CollapsibleSection title={t("giftCard.template.form.name.label") + " / " + t("giftCard.template.form.type.label")} defaultOpen>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>{t("giftCard.template.form.name.label")}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("giftCard.template.form.name.placeholder")} />
              </div>
              <div className="space-y-1.5">
                <Label>{t("giftCard.template.form.type.label")}</Label>
                <Select value={String(type)} onValueChange={(v) => setType(Number(v) as 1 | 2 | 3)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {([1, 2, 3] as const).map((n) => (
                      <SelectItem key={n} value={String(n)}>{t("giftCard.types." + n)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>{t("giftCard.template.form.description.label")}</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("giftCard.template.form.description.placeholder")} />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label className="text-sm font-normal">{t("giftCard.template.form.status.label")}</Label>
                <Switch checked={status} onCheckedChange={setStatus} />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t("giftCard.template.form.rewards.title")} defaultOpen>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{t("giftCard.template.form.rewards.balance.label")}</Label>
                  <Input type="number" value={balanceReward} onChange={(e) => setBalanceReward(Number(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("giftCard.template.form.rewards.transfer_enable.short_label")} (GB)</Label>
                  <Input type="number" value={transferReward} onChange={(e) => setTransferReward(Number(e.target.value))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{t("giftCard.template.form.rewards.expire_days.label")}</Label>
                  <Input type="number" value={expireDays} onChange={(e) => setExpireDays(Number(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("giftCard.template.form.rewards.device_limit.short_label")}</Label>
                  <Input type="number" value={deviceLimit} onChange={(e) => setDeviceLimit(Number(e.target.value))} />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label className="text-sm font-normal">{t("giftCard.template.form.rewards.reset_package.description")}</Label>
                <Switch checked={resetPackage} onCheckedChange={setResetPackage} />
              </div>
              <div className="space-y-1.5">
                <Label>{t("giftCard.template.form.rewards.invite_reward_rate.label")}</Label>
                <Input type="number" step="0.01" min={0} max={1} value={inviteRate} onChange={(e) => setInviteRate(Number(e.target.value))} />
              </div>
              {type === 2 && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{t("giftCard.template.form.rewards.plan_id.label")}</Label>
                    <Select value={planId} onValueChange={setPlanId}>
                      <SelectTrigger><SelectValue placeholder={t("giftCard.template.form.rewards.plan_id.placeholder")} /></SelectTrigger>
                      <SelectContent>
                        {plans.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("giftCard.template.form.rewards.plan_validity_days.label")}</Label>
                    <Input type="number" value={planValidityDays} onChange={(e) => setPlanValidityDays(Number(e.target.value))} />
                  </div>
                </div>
              )}              {type === 3 && (
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">{t("giftCard.template.form.rewards.random_rewards.label")}</Label>
                    <Button type="button" size="sm" variant="outline" onClick={() => setRandomRewards([...randomRewards, { balance: 0, transfer_enable: 0, expire_days: 0, device_limit: 0, weight: 10 }])}>
                      {t("giftCard.template.form.rewards.random_rewards.add")}
                    </Button>
                  </div>
                  {randomRewards.map((item, i) => (
                    <div key={i} className="grid grid-cols-7 gap-2 items-end rounded-md border p-2">
                      <div className="space-y-0.5"><Label className="text-[10px]">{t("giftCard.template.form.rewards.balance.short_label")}</Label><Input className="h-7 text-xs" value={item.balance || 0} onChange={(e) => { const c = [...randomRewards]; c[i] = { ...c[i], balance: Number(e.target.value) }; setRandomRewards(c); }} /></div>
                      <div className="space-y-0.5"><Label className="text-[10px]">{t("giftCard.template.form.rewards.transfer_enable.short_label")}</Label><Input className="h-7 text-xs" value={item.transfer_enable ? Math.round(item.transfer_enable / 1073741824 * 100) / 100 : 0} onChange={(e) => { const c = [...randomRewards]; c[i] = { ...c[i], transfer_enable: Math.round(Number(e.target.value) * 1073741824) }; setRandomRewards(c); }} /></div>
                      <div className="space-y-0.5"><Label className="text-[10px]">{t("giftCard.template.form.rewards.expire_days.short_label")}</Label><Input className="h-7 text-xs" value={item.expire_days || 0} onChange={(e) => { const c = [...randomRewards]; c[i] = { ...c[i], expire_days: Number(e.target.value) }; setRandomRewards(c); }} /></div>
                      <div className="space-y-0.5"><Label className="text-[10px]">{t("giftCard.template.form.rewards.device_limit.short_label")}</Label><Input className="h-7 text-xs" value={item.device_limit || 0} onChange={(e) => { const c = [...randomRewards]; c[i] = { ...c[i], device_limit: Number(e.target.value) }; setRandomRewards(c); }} /></div>
                      <div className="space-y-0.5"><Label className="text-[10px]">{t("giftCard.template.form.rewards.random_rewards.weight")}</Label><Input className="h-7 text-xs" value={item.weight || 10} onChange={(e) => { const c = [...randomRewards]; c[i] = { ...c[i], weight: Number(e.target.value) }; setRandomRewards(c); }} /></div>
                      <div className="flex items-end"><Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setRandomRewards(randomRewards.filter((_, j) => j !== i))}><X className="h-3 w-3" /></Button></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t("giftCard.template.form.conditions.title")}>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md border p-3">
                <div><Label className="text-sm font-normal">{t("giftCard.template.form.conditions.new_user_only.label")}</Label>{condNewUser && <p className="text-xs text-muted-foreground">{t("giftCard.template.form.conditions.new_user_only.hint", { days: condNewUserDays })}</p>}</div>
                <Switch checked={condNewUser} onCheckedChange={setCondNewUser} />
              </div>
              {condNewUser && (
                <div className="space-y-1.5"><Label>{t("giftCard.template.form.conditions.new_user_max_days.label")}</Label><Input type="number" value={condNewUserDays} onChange={(e) => setCondNewUserDays(Number(e.target.value))} /></div>
              )}
              <div className="flex items-center justify-between rounded-md border p-3"><Label className="text-sm font-normal">{t("giftCard.template.form.conditions.paid_user_only.label")}</Label><Switch checked={condPaidUser} onCheckedChange={setCondPaidUser} /></div>
              <div className="flex items-center justify-between rounded-md border p-3"><Label className="text-sm font-normal">{t("giftCard.template.form.conditions.require_invite.label")}</Label><Switch checked={condRequireInvite} onCheckedChange={setCondRequireInvite} /></div>
              <div className="space-y-1.5"><Label>{t("giftCard.template.form.conditions.allowed_plans.label")}</Label><Input value={condAllowedPlans} onChange={(e) => setCondAllowedPlans(e.target.value)} placeholder={t("giftCard.template.form.conditions.allowed_plans.placeholder")} /></div>
              <div className="space-y-1.5"><Label>{t("giftCard.template.form.conditions.disallowed_plans.label")}</Label><Input value={condDisallowedPlans} onChange={(e) => setCondDisallowedPlans(e.target.value)} placeholder={t("giftCard.template.form.conditions.disallowed_plans.placeholder")} /></div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t("giftCard.template.form.limits.title")}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>{t("giftCard.template.form.limits.max_use_per_user.label")}</Label><Input type="number" value={limitMaxUse} onChange={(e) => setLimitMaxUse(Number(e.target.value))} placeholder={t("giftCard.template.form.limits.max_use_per_user.placeholder")} /></div>
              <div className="space-y-1.5"><Label>{t("giftCard.template.form.limits.cooldown_hours.label")}</Label><Input type="number" value={limitCooldown} onChange={(e) => setLimitCooldown(Number(e.target.value))} placeholder={t("giftCard.template.form.limits.cooldown_hours.placeholder")} /></div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t("giftCard.template.form.display.title")}>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>{t("giftCard.template.form.display.theme_color.label")}</Label><div className="flex gap-2"><Input value={themeColor} onChange={(e) => setThemeColor(e.target.value)} placeholder="#6366f1" className="flex-1" /><input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="h-9 w-9 rounded-md border cursor-pointer" /></div></div>
              <div className="space-y-1.5"><Label>{t("giftCard.template.form.display.icon.label")}</Label><Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder={t("giftCard.template.form.display.icon.placeholder")} /></div>
              <div className="space-y-1.5"><Label>{t("giftCard.template.form.display.background_image.label")}</Label><Input value={backgroundImage} onChange={(e) => setBackgroundImage(e.target.value)} placeholder={t("giftCard.template.form.display.background_image.placeholder")} /></div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t("giftCard.template.form.special_config.title")}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>{t("giftCard.template.form.special_config.start_time.label")}</Label><Input type="datetime-local" value={festivalStart} onChange={(e) => setFestivalStart(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>{t("giftCard.template.form.special_config.end_time.label")}</Label><Input type="datetime-local" value={festivalEnd} onChange={(e) => setFestivalEnd(e.target.value)} /></div>
            </div>
            <div className="space-y-1.5 mt-3"><Label>{t("giftCard.template.form.special_config.festival_bonus.label")}</Label><Input type="number" step="0.1" min={1} value={festivalBonus} onChange={(e) => setFestivalBonus(Number(e.target.value))} /></div>
          </CollapsibleSection>

        </div>
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
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
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editCode, setEditCode] = useState<any>(null);
  const [deleteCode, setDeleteCode] = useState<any>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["gift-card", "codes"],
    queryFn: () => fetchGiftCardCodes(),
  });
  const list: any[] = data?.data || [];

  const handleToggle = async (c: any) => {
    try {
      const action = c.status === 3 ? "enable" : "disable";
      await toggleGiftCardCode({ id: c.id, action });
      toast.success(action === "enable" ? "已启用" : "已禁用");
      qc.invalidateQueries({ queryKey: ["gift-card", "codes"] });
    } catch (e) {}
  };

  return (
    <>
      <div className="mb-4 flex gap-2">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("giftCard.code.form.generate")}
        </Button>
        <Button variant="outline" onClick={async () => {
          try {
            const res = await exportGiftCardCodes();
            if (res && typeof res === 'object' && (res as any).url) {
              window.open((res as any).url, '_blank');
            } else {
              toast.success('导出成功');
            }
          } catch (e) {}
        }}>
          <Download className="h-4 w-4" />
          导出
        </Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>{t("giftCard.code.table.columns.code")}</TableHead>
              <TableHead>{t("giftCard.code.table.columns.template_name")}</TableHead>
              <TableHead className="text-right">{t("giftCard.code.table.columns.usage_count")}</TableHead>
              <TableHead>{t("giftCard.code.table.columns.created_at")}</TableHead>
              <TableHead className="w-24 text-right">操作</TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IdBadge id={c.id} />
                      {c.status === 0 || c.status === 3 ? (
                        <Switch
                          checked={c.status === 0}
                          onCheckedChange={() => handleToggle(c)}
                        />
                      ) : (
                        <Badge variant={c.status === 1 ? "success" : "warning"} className="text-[10px] px-1.5 py-0">
                          {t(`giftCard.code.status.${c.status}`)}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{c.code}</TableCell>
                  <TableCell>{c.template?.name || "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.usage_count}/{c.max_usage}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.created_at}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setEditCode(c)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleteCode(c)}
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
      <GenerateCodesDialog open={open} onOpenChange={setOpen} />
      <EditCodeDialog
        code={editCode}
        onOpenChange={(v) => { if (!v) setEditCode(null); }}
        onSaved={() => { setEditCode(null); qc.invalidateQueries({ queryKey: ["gift-card", "codes"] }); }}
      />
      <ConfirmDialog
        open={!!deleteCode}
        onOpenChange={(v) => !v && setDeleteCode(null)}
        title="确认删除"
        description={`确定要删除礼品码 ${deleteCode?.code} 吗？此操作不可撤销。`}
        onConfirm={async () => {
          if (!deleteCode) return;
          try {
            await deleteGiftCardCode(deleteCode.id);
            toast.success('删除成功');
            qc.invalidateQueries({ queryKey: ["gift-card", "codes"] });
            setDeleteCode(null);
          } catch (e) {}
        }}
      />
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
      <DialogContent className="max-w-sm max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>{t("giftCard.code.form.generate")}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6 py-4">
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
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
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

function EditCodeDialog({
  code,
  onOpenChange,
  onSaved,
}: {
  code: any;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const open = !!code;
  const [codeVal, setCodeVal] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [maxUsage, setMaxUsage] = useState(1);
  const [expiresAt, setExpiresAt] = useState("");
  const [editStatus, setEditStatus] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const { data: templatesData } = useQuery({
    queryKey: ["gift-card", "templates"],
    queryFn: () => fetchGiftCardTemplates(),
    enabled: open,
  });
  const templates: any[] = (templatesData as any)?.data || [];

  useEffect(() => {
    if (!open) return;
    if (code) {
      setCodeVal(code.code || "");
      setTemplateId(code.template_id ? String(code.template_id) : "");
      setMaxUsage(code.max_usage ?? 1);
      setExpiresAt(code.expires_at ? toLocalInput(code.expires_at) : "");
      setEditStatus(code.status ?? 0);
    } else {
      setCodeVal(""); setTemplateId(""); setMaxUsage(1); setExpiresAt(""); setEditStatus(0);
    }
  }, [open, code]);

  const submit = async () => {
    if (!code) return;
    setSubmitting(true);
    try {
      const payload: any = { id: code.id, code: codeVal };
      if (templateId) payload.template_id = Number(templateId);
      if (maxUsage) payload.max_usage = maxUsage;
      if (expiresAt) payload.expires_at = Math.floor(new Date(expiresAt).getTime() / 1000);
      else payload.expires_at = null;
      if (editStatus !== code.status) payload.status = editStatus;
      await updateGiftCardCode(payload);
      toast.success("更新成功");
      onSaved();
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>编辑礼品码</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6 py-4">
          <div className="space-y-1.5">
            <Label>礼品码</Label>
            <Input value={codeVal} onChange={(e) => setCodeVal(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>模板</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger><SelectValue placeholder={code?.template?.name || "请选择模板"} /></SelectTrigger>
              <SelectContent>
                {templates.map((tpl: any) => (
                  <SelectItem key={tpl.id} value={String(tpl.id)}>{tpl.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>最大使用次数</Label>
              <Input type="number" min={1} max={1000} value={maxUsage} onChange={(e) => setMaxUsage(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>状态</Label>
              <Select value={String(editStatus)} onValueChange={(v) => setEditStatus(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">未使用</SelectItem>
                  <SelectItem value="1">已使用</SelectItem>
                  <SelectItem value="2">已过期</SelectItem>
                  <SelectItem value="3">已禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>过期时间</Label>
            <Input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            保存
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
    queryFn: () => fetchGiftCardUsages(),
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
                <TableCell><IdBadge id={u.id} /></TableCell>
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
