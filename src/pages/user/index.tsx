import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MoreHorizontal,
  Search,
  UserPlus,
  Mail,
  Ban,
  RotateCcw,
  Trash2,
  Copy,
  Loader2,
  ClipboardList,
  Activity,
  Users,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePlanOptions } from "@/hooks/use-plans";
import { fetchGroups, type ServerGroup } from "@/api/server";
import {
  banUser,
  destroyUser,
  fetchUsers,
  generateUser,
  resetUserSecret,
  sendMail,
  type UserFilter,
  type UserListItem,
} from "@/api/user";
import {
  formatBytes,
  formatDate,
  formatCurrency,
  bytesToGb,
} from "@/lib/utils";
import { adminPath } from "@/lib/paths";
import { UserEditDialog } from "./user-edit-dialog";
import {
  UserTrafficRecordsDialog,
  UserInvitesDialog,
} from "./user-related-dialogs";
import { UserTrafficResetDialog } from "./user-traffic-reset-dialog";
import { UserAssignOrderDialog } from "./user-assign-order-dialog";

export function UserListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState(searchParams.get("email") || "");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);
  const [selected, setSelected] = useState<number[]>([]);

  const [editing, setEditing] = useState<UserListItem | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [confirmBan, setConfirmBan] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<UserListItem | null>(null);

  const [trafficResetUser, setTrafficResetUser] = useState<UserListItem | null>(
    null,
  );
  const [trafficRecordsUser, setTrafficRecordsUser] =
    useState<UserListItem | null>(null);
  const [invitesUser, setInvitesUser] = useState<UserListItem | null>(null);
  const [assignOrderUser, setAssignOrderUser] = useState<UserListItem | null>(
    null,
  );

  const filter: UserFilter = {
    current: page,
    pageSize,
    filter: debouncedSearch
      ? [{ id: "email", value: debouncedSearch, logic: "and" }]
      : [],
  };

  const { data, isLoading } = useQuery({
    queryKey: ["users", filter],
    queryFn: () => fetchUsers(filter),
  });

  const { data: plansData } = usePlanOptions();
  const plansMap = useMemo(() => {
    const m: Record<number, string> = {};
    (plansData || []).forEach((p: any) => {
      m[p.id] = p.name;
    });
    return m;
  }, [plansData]);

  const { data: groupsData } = useQuery({
    queryKey: ["server-groups"],
    queryFn: fetchGroups,
    staleTime: 300000,
  });
  const groupsMap = useMemo(() => {
    const m: Record<number, string> = {};
    (groupsData || []).forEach((g: any) => {
      m[g.id] = g.name;
    });
    return m;
  }, [groupsData]);

  const users = data?.data || [];
  const total = data?.total || 0;

  const onSaved = () => qc.invalidateQueries({ queryKey: ["users"] });
  const refresh = () => onSaved();

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? users.map((u) => u.id) : []);
  };
  const handleSelect = (id: number, checked: boolean) => {
    setSelected((s) =>
      checked ? [...new Set([...s, id])] : s.filter((x) => x !== id),
    );
  };

  return (
    <>
      <PageHeader
        title={t("user.manage.title")}
        description={t("user.manage.description")}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setMailOpen(true)}
              disabled={!selected.length}
            >
              <Mail className="h-4 w-4" />
              {t("user.actions.send_email")}
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmBan(true)}
              disabled={!selected.length}
            >
              <Ban className="h-4 w-4" />
              {t("user.actions.batch_ban")}
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <UserPlus className="h-4 w-4" />
              {t("user.generate.button")}
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("user.filter.email_search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        {selected.length > 0 && (
          <Badge variant="secondary" className="h-9 px-3">
            {t("user.filter.selected", { count: selected.length })}
          </Badge>
        )}
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={users.length > 0 && selected.length === users.length}
                  onCheckedChange={(c) => handleSelectAll(c === true)}
                />
              </TableHead>
              <TableHead className="w-14">{t("user.columns.id")}</TableHead>
              <TableHead>{t("user.columns.email")}</TableHead>
              <TableHead className="text-center">
                {t("user.columns.online_count")}
              </TableHead>
              <TableHead className="text-center">
                {t("user.columns.status")}
              </TableHead>
              <TableHead>{t("user.columns.subscription")}</TableHead>
              <TableHead>{t("user.columns.group")}</TableHead>
              <TableHead className="text-right">
                {t("user.columns.used_traffic")}
              </TableHead>
              <TableHead className="text-right">
                {t("user.columns.total_traffic")}
              </TableHead>
              <TableHead>{t("user.columns.expire_time")}</TableHead>
              <TableHead className="text-right">
                {t("user.columns.balance")}
              </TableHead>
              <TableHead className="text-right">
                {t("user.columns.commission")}
              </TableHead>
              <TableHead>{t("user.columns.register_time")}</TableHead>
              <TableHead className="w-12 text-right">
                {t("user.columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 14 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => {
                const used = (u.u || 0) + (u.d || 0);
                const totalBytes = u.transfer_enable || 0;
                const pct =
                  totalBytes > 0
                    ? ((used / totalBytes) * 100).toFixed(1)
                    : "0.0";
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(u.id)}
                        onCheckedChange={(c) => handleSelect(u.id, c === true)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{u.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{u.email}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(u.email);
                              toast.success(t("common.copy.success"));
                            } catch {
                              toast.error(t("common.copy.failed"));
                            }
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {u.is_admin && (
                          <Badge variant="destructive">
                            {t("user.status.admin")}
                          </Badge>
                        )}
                        {!u.is_admin && u.is_staff && (
                          <Badge variant="secondary">
                            {t("user.status.staff")}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs tabular-nums">
                      <span className="cursor-pointer text-muted-foreground hover:text-foreground">
                        {u.online_count ?? "—"} / {u.device_limit ?? "∞"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {u.banned ? (
                        <Badge variant="destructive">
                          {t("user.columns.status_text.banned")}
                        </Badge>
                      ) : (
                        <Badge variant="success">
                          {t("user.columns.status_text.normal")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {u.plan_id ? plansMap[u.plan_id] || `#${u.plan_id}` : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {u.group_id
                        ? groupsMap[u.group_id] || `#${u.group_id}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs tabular-nums">
                      <span
                        className="cursor-pointer text-muted-foreground hover:text-foreground"
                        onClick={() => setTrafficRecordsUser(u)}
                      >
                        {formatBytes(used)}
                        <span className="ml-1 text-[10px]">({pct}%)</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-xs tabular-nums">
                      {totalBytes ? formatBytes(totalBytes) : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {u.expired_at ? (
                        <span className="cursor-pointer hover:text-foreground">
                          {formatDate(u.expired_at, false)}
                        </span>
                      ) : (
                        <span className="text-green-600 dark:text-green-400">
                          {t("user.columns.expire_status.permanent")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs tabular-nums">
                      {formatCurrency(u.balance)}
                    </TableCell>
                    <TableCell className="text-right text-xs tabular-nums">
                      {formatCurrency(u.commission_balance)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {u.created_at ? formatDate(u.created_at) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setEditing(u)}>
                            {t("user.columns.actions_menu.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              try {
                                await resetUserSecret(u.id);
                                toast.success("UUID & Token 已重置");
                                refresh();
                              } catch (e) {}
                            }}
                          >
                            <RotateCcw className="h-4 w-4" />
                            {t("user.columns.actions_menu.reset_secret")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              try {
                                const url = u.subscribe_url;
                                await navigator.clipboard.writeText(url);
                                toast.success(t("common.copy.success"));
                              } catch {
                                toast.error(t("common.copy.failed"));
                              }
                            }}
                          >
                            <Copy className="h-4 w-4" />
                            {t("user.columns.actions_menu.copy_url")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setTrafficResetUser(u)}
                          >
                            <Activity className="h-4 w-4" />
                            {t("user.columns.actions_menu.reset_traffic")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`${adminPath("order")}?user_id=${u.id}`)
                            }
                          >
                            <ClipboardList className="h-4 w-4" />
                            {t("user.columns.actions_menu.orders")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setTrafficRecordsUser(u)}
                          >
                            <Activity className="h-4 w-4" />
                            {t("user.columns.actions_menu.traffic_records")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setInvitesUser(u)}>
                            <Users className="h-4 w-4" />
                            {t("user.columns.actions_menu.invites")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setAssignOrderUser(u)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            {t("user.columns.actions_menu.assign_order")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setConfirmDelete(u)}
                          >
                            <Trash2 className="h-4 w-4" />
                            {t("user.columns.actions_menu.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
          selectedCount={selected.length}
        />
      </div>

      <UserEditDialog
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        user={editing}
        onSaved={refresh}
      />

      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={refresh}
      />

      <SendMailDialog
        open={mailOpen}
        onOpenChange={setMailOpen}
        filter={
          debouncedSearch
            ? [{ id: "email", value: debouncedSearch }]
            : undefined
        }
        ids={selected}
        onSent={refresh}
      />

      <ConfirmDialog
        open={confirmBan}
        onOpenChange={setConfirmBan}
        title={t("user.actions.confirm_ban.title")}
        description={
          debouncedSearch
            ? t("user.actions.confirm_ban.filtered_description")
            : t("user.actions.confirm_ban.all_description")
        }
        confirmText={t("user.actions.confirm_ban.confirm")}
        cancelText={t("user.actions.confirm_ban.cancel")}
        onConfirm={async () => {
          try {
            await banUser({
              filter: debouncedSearch ? { email: debouncedSearch } : undefined,
            });
            toast.success(t("user.messages.batch_ban.success"));
            setSelected([]);
            refresh();
            setConfirmBan(false);
          } catch {}
        }}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(v) => !v && setConfirmDelete(null)}
        title={t("user.columns.actions_menu.delete_confirm_title")}
        description={t("user.columns.actions_menu.delete_confirm_description", {
          email: confirmDelete?.email,
        })}
        onConfirm={async () => {
          if (!confirmDelete) return;
          try {
            await destroyUser(confirmDelete.id);
            toast.success(t("common.delete.success"));
            refresh();
            setConfirmDelete(null);
          } catch {}
        }}
      />

      <UserTrafficResetDialog
        open={!!trafficResetUser}
        onOpenChange={(v) => !v && setTrafficResetUser(null)}
        user={trafficResetUser}
        onDone={refresh}
      />

      <UserTrafficRecordsDialog
        open={!!trafficRecordsUser}
        onOpenChange={(v) => !v && setTrafficRecordsUser(null)}
        user={trafficRecordsUser}
      />

      <UserInvitesDialog
        open={!!invitesUser}
        onOpenChange={(v) => !v && setInvitesUser(null)}
        user={invitesUser}
      />

      <UserAssignOrderDialog
        open={!!assignOrderUser}
        onOpenChange={(v) => !v && setAssignOrderUser(null)}
        user={assignOrderUser}
        onDone={refresh}
      />
    </>
  );
}

/* ---------------- 创建用户 ---------------- */
function CreateUserDialog({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const { data: plans } = usePlanOptions();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email_prefix: "",
    email_suffix: "example.com",
    password: "",
    plan_id: "",
    expired_at: "",
    generate_count: 1,
  });
  const [result, setResult] = useState<any>(null);

  const submit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await generateUser({
        email_prefix: form.email_prefix || undefined,
        email_suffix: form.email_suffix,
        password: form.password || undefined,
        plan_id: form.plan_id ? Number(form.plan_id) : undefined,
        expired_at: form.expired_at
          ? Math.floor(new Date(form.expired_at).getTime() / 1000)
          : null,
        generate_count: form.email_prefix ? 1 : form.generate_count,
      });
      setResult(res);
      toast.success(t("user.generate.form.success"));
      onSaved();
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("user.generate.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t("user.generate.form.email_prefix")}</Label>
            <Input
              value={form.email_prefix}
              onChange={(e) =>
                setForm((f) => ({ ...f, email_prefix: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("user.generate.form.email_domain")}</Label>
            <Input
              value={form.email_suffix}
              onChange={(e) =>
                setForm((f) => ({ ...f, email_suffix: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("user.generate.form.password")}</Label>
            <Input
              type="text"
              placeholder={t("user.generate.form.password_placeholder")}
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("user.generate.form.subscription")}</Label>
            <Select
              value={form.plan_id || "none"}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, plan_id: v === "none" ? "" : v }))
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("user.generate.form.subscription_none")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {t("user.generate.form.subscription_none")}
                </SelectItem>
                {(plans || []).map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t("user.generate.form.expire_time")}</Label>
            <Input
              type="datetime-local"
              value={form.expired_at}
              onChange={(e) =>
                setForm((f) => ({ ...f, expired_at: e.target.value }))
              }
            />
          </div>
          {!form.email_prefix && (
            <div className="space-y-1.5">
              <Label>{t("user.generate.form.generate_count")}</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={form.generate_count}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    generate_count: Number(e.target.value),
                  }))
                }
              />
            </div>
          )}

          {result && (
            <pre className="max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("user.generate.form.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("user.generate.form.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- 发送邮件 ---------------- */
function SendMailDialog({
  open,
  onOpenChange,
  ids,
  filter,
  onSent,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  ids: number[];
  filter?: Array<{ id: string; value: any }>;
  onSent: () => void;
}) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const submit = async () => {
    if (!subject || !content) {
      toast.error(t("user.messages.send_mail.required_fields"));
      return;
    }
    setSubmitting(true);
    try {
      await sendMail({ subject, content, filter: filter as any });
      toast.success(t("user.messages.send_mail.success"));
      onSent();
      onOpenChange(false);
      setSubject("");
      setContent("");
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("user.send_mail.title")}</DialogTitle>
          <DialogDescription>
            {t("user.send_mail.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t("user.send_mail.subject")}</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("user.send_mail.content")}</Label>
            <Textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("user.send_mail.send")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
