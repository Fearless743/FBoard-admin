import { useState, useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUrlState, listQuerySchema } from "@/hooks/use-url-state";
import {
  MoreHorizontal,
  Search,
  UserPlus,
  Mail,
  Ban,
  Pencil,
  RotateCcw,
  Trash2,
  Copy,
  Loader2,
  ClipboardList,
  Activity,
  Users,
  ShoppingCart,
  History,
  X,
  Infinity as InfinityIcon,
  CheckCircle2,
  Download,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IdBadge } from "@/components/common/id-badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { fetchGroups } from "@/api/server";
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
  formatCurrencyYuan,
  cn,
  copyToClipboard,
} from "@/lib/utils";
import { adminPath } from "@/lib/paths";
import { UserEditDialog } from "./user-edit-dialog";
import {
  UserTrafficRecordsDialog,
  UserInvitesDialog,
} from "./user-related-dialogs";
import { UserTrafficResetDialog } from "./user-traffic-reset-dialog";
import { UserAssignOrderDialog } from "./user-assign-order-dialog";
import { UserLoginHistoryDialog } from "./user-login-history-dialog";

const COL_COUNT = 13;

function emailInitial(email?: string) {
  const ch = (email || "?").trim().charAt(0).toUpperCase();
  return ch || "?";
}

function avatarTone(email?: string) {
  const tones = [
    "bg-primary/10 text-primary",
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    "bg-sky-500/10 text-sky-700 dark:text-sky-400",
    "bg-violet-500/10 text-violet-700 dark:text-violet-400",
    "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  ];
  const s = email || "";
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * (i + 1)) % tones.length;
  return tones[h];
}

/** 用户列表可排序字段（与后端 applySorting 的 id 对齐） */
const USER_SORT_FIELDS = [
  "total_used",
  "balance",
  "commission_balance",
  "online_count",
] as const;
type UserSortField = (typeof USER_SORT_FIELDS)[number];

function expireMeta(expiredAt?: number | null) {
  if (!expiredAt) return { kind: "permanent" as const, days: null as number | null };
  const now = Date.now() / 1000;
  const days = Math.ceil((expiredAt - now) / 86400);
  if (days < 0) return { kind: "expired" as const, days };
  if (days <= 7) return { kind: "soon" as const, days };
  return { kind: "active" as const, days };
}

export function UserListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  // 保留 email 键名以兼容订单页等深链 ?email=
  const [qs, setQs, query] = useUrlState(
    listQuerySchema({
      email: { type: "string", default: "", debounce: 500 },
      sort: {
        type: "enum",
        values: ["", ...USER_SORT_FIELDS] as readonly string[],
        default: "",
      },
      order: {
        type: "enum",
        values: ["", "asc", "desc"] as const,
        default: "",
      },
    }),
  );
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
  const [loginHistoryUser, setLoginHistoryUser] =
    useState<UserListItem | null>(null);
  const [assignOrderUser, setAssignOrderUser] = useState<UserListItem | null>(
    null,
  );

  const activeSortField =
    query.sort && (USER_SORT_FIELDS as readonly string[]).includes(query.sort)
      ? (query.sort as UserSortField)
      : "";
  const activeSortDesc =
    activeSortField && query.order === "asc" ? false : activeSortField ? true : null;

  const toggleSort = (field: UserSortField) => {
    // 三态：未排序 → 降序 → 升序 → 未排序
    if (activeSortField !== field) {
      setQs({ sort: field, order: "desc", page: 1 });
      return;
    }
    if (query.order !== "asc") {
      setQs({ sort: field, order: "asc", page: 1 });
      return;
    }
    setQs({ sort: "", order: "", page: 1 });
  };

  const filter: UserFilter = {
    current: query.page,
    pageSize: query.pageSize,
    filter: query.email
      ? [{ id: "email", value: query.email, logic: "and" }]
      : [],
    sort:
      activeSortField && activeSortDesc != null
        ? [{ id: activeSortField, desc: activeSortDesc }]
        : undefined,
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

  const SortableHead = ({
    field,
    children,
    className,
    align = "left",
  }: {
    field: UserSortField;
    children: ReactNode;
    className?: string;
    align?: "left" | "center" | "right";
  }) => {
    const active = activeSortField === field;
    const Icon = !active
      ? ArrowUpDown
      : query.order === "asc"
        ? ArrowUp
        : ArrowDown;
    return (
      <TableHead className={className}>
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={cn(
            "inline-flex w-full items-center gap-1 text-xs font-medium transition-colors hover:text-foreground",
            align === "center" && "justify-center",
            align === "right" && "justify-end",
            active ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <span>{children}</span>
          <Icon
            className={cn(
              "h-3.5 w-3.5 shrink-0",
              active ? "text-foreground" : "text-muted-foreground/70",
            )}
          />
        </button>
      </TableHead>
    );
  };

  return (
    <>
      <PageHeader
        title={t("user.manage.title")}
        description={t("user.manage.description")}
        actions={
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <Button
              onClick={() => setCreateOpen(true)}
              className="w-full sm:w-auto"
            >
              <UserPlus className="h-4 w-4" />
              {t("user.generate.button")}
            </Button>
          </div>
        }
      />

      <div className="mb-4 space-y-2">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("user.filter.email_search")}
            value={qs.email}
            onChange={(e) => setQs({ email: e.target.value })}
            className="pl-9"
          />
        </div>
        {selected.length > 0 ? (
          <div className="flex w-full flex-wrap items-center gap-2 rounded-lg border bg-muted/40 px-3 py-1.5">
            <Badge variant="secondary" className="h-7 gap-1.5 px-2.5 font-normal">
              <Users className="h-3.5 w-3.5" />
              {t("user.filter.selected", { count: selected.length })}
            </Badge>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <Button
              size="sm"
              variant="outline"
              className="h-7"
              onClick={() => setMailOpen(true)}
            >
              <Mail className="h-3.5 w-3.5" />
              {t("user.actions.send_email")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirmBan(true)}
            >
              <Ban className="h-3.5 w-3.5" />
              {t("user.actions.batch_ban")}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto h-7 w-7 px-0 sm:ml-0"
              onClick={() => setSelected([])}
              title={t("user.filter.clear_selection")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="sticky left-0 z-10 w-10 bg-card">
                <Checkbox
                  checked={
                    users.length > 0 &&
                    selected.length > 0 &&
                    selected.length === users.length
                  }
                  onCheckedChange={(c) => handleSelectAll(c === true)}
                  aria-label={t("common.selectAll")}
                />
              </TableHead>
              <TableHead className="hidden w-14 md:table-cell">
                {t("user.columns.id")}
              </TableHead>
              <TableHead className="min-w-0 sm:min-w-[180px] md:min-w-[220px]">
                {t("user.columns.email")}
              </TableHead>
              <SortableHead
                field="online_count"
                className="hidden w-[100px] lg:table-cell"
                align="center"
              >
                {t("user.columns.online_count")}
              </SortableHead>
              <TableHead className="hidden w-[108px] text-center sm:table-cell">
                {t("user.columns.status")}
              </TableHead>
              <TableHead className="hidden min-w-[120px] md:table-cell">
                {t("user.columns.subscription")}
              </TableHead>
              <TableHead className="hidden min-w-[100px] xl:table-cell">
                {t("user.columns.group")}
              </TableHead>
              <SortableHead
                field="total_used"
                className="hidden min-w-[120px] sm:table-cell"
              >
                {t("user.columns.used_traffic")}
              </SortableHead>
              <TableHead className="hidden min-w-[120px] lg:table-cell">
                {t("user.columns.expire_time")}
              </TableHead>
              <SortableHead
                field="balance"
                className="hidden min-w-[100px] xl:table-cell"
                align="right"
              >
                {t("user.columns.balance")}
              </SortableHead>
              <SortableHead
                field="commission_balance"
                className="hidden min-w-[100px] xl:table-cell"
                align="right"
              >
                {t("user.columns.commission")}
              </SortableHead>
              <TableHead className="hidden min-w-[120px] xl:table-cell">
                {t("user.columns.register_time")}
              </TableHead>
              <TableHead className="sticky right-0 z-10 w-12 bg-card text-right sm:w-20">
                {t("user.columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: COL_COUNT }).map((_, j) => (
                    <TableCell
                      key={j}
                      className={cn(
                        // 0 checkbox, 1 id, 2 email, 3 online, 4 status,
                        // 5 plan, 6 group, 7 traffic, 8 expire,
                        // 9 balance, 10 commission, 11 register, 12 actions
                        j === 1 && "hidden md:table-cell",
                        j === 3 && "hidden lg:table-cell",
                        j === 4 && "hidden sm:table-cell",
                        j === 5 && "hidden md:table-cell",
                        j === 6 && "hidden xl:table-cell",
                        j === 7 && "hidden sm:table-cell",
                        j === 8 && "hidden lg:table-cell",
                        j === 9 && "hidden xl:table-cell",
                        j === 10 && "hidden xl:table-cell",
                        j === 11 && "hidden xl:table-cell",
                      )}
                    >
                      <Skeleton
                        className={cn("h-4 w-full", j === 2 && "h-9 w-44")}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={COL_COUNT}>
                  <EmptyState
                    icon={<Users className="h-10 w-10" />}
                    message={t("common.table.noData")}
                  />
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => {
                const used = (u.u || 0) + (u.d || 0);
                const totalBytes = u.transfer_enable || 0;
                const expire = expireMeta(u.expired_at);
                const online = Number(u.online_count || 0);
                const selectedRow = selected.includes(u.id);
                const planName = u.plan_id
                  ? plansMap[u.plan_id] || `#${u.plan_id}`
                  : null;
                const groupName = u.group_id
                  ? groupsMap[u.group_id] || `#${u.group_id}`
                  : null;

                const stickyBg = selectedRow
                  ? "bg-muted"
                  : u.banned
                    ? "bg-destructive/[0.03]"
                    : "bg-card";

                const statusBadge = (
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-5 shrink-0 whitespace-nowrap border-transparent px-1.5 text-[11px] font-normal sm:px-2 sm:text-xs",
                      u.banned
                        ? "bg-destructive/10 text-destructive"
                        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                    )}
                  >
                    {u.banned
                      ? t("user.columns.status_text.banned")
                      : t("user.columns.status_text.normal")}
                  </Badge>
                );

                const planBadge = planName ? (
                  <Badge
                    variant="secondary"
                    className="max-w-[160px] truncate font-normal"
                    title={planName}
                  >
                    {planName}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                );

                const expireCell =
                  expire.kind === "permanent" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <InfinityIcon className="h-3.5 w-3.5" />
                      {t("user.columns.expire_status.permanent")}
                    </span>
                  ) : (
                    <div className="space-y-0.5">
                      <p
                        className={cn(
                          "text-xs tabular-nums",
                          expire.kind === "expired" &&
                            "font-medium text-destructive",
                          expire.kind === "soon" &&
                            "font-medium text-amber-600 dark:text-amber-400",
                          expire.kind === "active" && "text-muted-foreground",
                        )}
                      >
                        {formatDate(u.expired_at, false)}
                      </p>
                      {expire.days != null && (
                        <p
                          className={cn(
                            "text-[10px]",
                            expire.kind === "expired" && "text-destructive/80",
                            expire.kind === "soon" &&
                              "text-amber-600/80 dark:text-amber-400/80",
                            expire.kind === "active" &&
                              "text-muted-foreground/80",
                          )}
                        >
                          {expire.kind === "expired"
                            ? t("user.columns.expire_status.expired", {
                                days: Math.abs(expire.days),
                              })
                            : t("user.columns.expire_status.remaining", {
                                days: expire.days,
                              })}
                        </p>
                      )}
                    </div>
                  );

                return (
                  <TableRow
                    key={u.id}
                    data-state={selectedRow ? "selected" : undefined}
                    className={cn(
                      "group",
                      u.banned && !selectedRow && "bg-destructive/[0.03]",
                    )}
                  >
                    <TableCell
                      className={cn(
                        "sticky left-0 z-10 align-top group-hover:bg-muted/50 sm:align-middle",
                        stickyBg,
                      )}
                    >
                      <Checkbox
                        checked={selectedRow}
                        onCheckedChange={(c) => handleSelect(u.id, c === true)}
                        aria-label={`select ${u.email}`}
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <IdBadge id={u.id} compact />
                    </TableCell>
                    <TableCell className="min-w-0 align-top sm:align-middle">
                      <div className="flex min-w-0 items-start gap-2 sm:items-center sm:gap-2.5">
                        <Avatar className="mt-0.5 h-8 w-8 shrink-0 sm:mt-0">
                          <AvatarFallback
                            className={cn(
                              "text-xs font-semibold",
                              avatarTone(u.email),
                            )}
                          >
                            {emailInitial(u.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 space-y-1">
                          <div className="flex min-w-0 items-center gap-1">
                            <span
                              className="truncate font-medium"
                              title={u.email}
                            >
                              {u.email}
                            </span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hidden h-6 w-6 shrink-0 opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100 sm:inline-flex"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      await copyToClipboard(u.email);
                                      toast.success(t("common.copy.success"));
                                    } catch {
                                      toast.error(t("common.copy.failed"));
                                    }
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {t("user.columns.copy_email")}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="md:hidden">
                              <IdBadge id={u.id} compact />
                            </span>
                            {u.is_admin && (
                              <Badge
                                variant="destructive"
                                className="h-5 px-1.5 text-[10px] font-normal"
                              >
                                {t("user.status.admin")}
                              </Badge>
                            )}
                            {!u.is_admin && u.is_staff && (
                              <Badge
                                variant="secondary"
                                className="h-5 px-1.5 text-[10px] font-normal"
                              >
                                {t("user.status.staff")}
                              </Badge>
                            )}
                          </div>
                          {/* 窄屏：在独立列出现前，把关键信息并入邮箱列 */}
                          <div className="flex flex-wrap items-center gap-1 pt-0.5 md:hidden">
                            <span className="sm:hidden">{statusBadge}</span>
                            {planName ? (
                              <Badge
                                variant="secondary"
                                className="max-w-[9rem] truncate px-1.5 text-[10px] font-normal"
                                title={planName}
                              >
                                {planName}
                              </Badge>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            className="text-left text-[11px] tabular-nums text-muted-foreground underline-offset-2 hover:text-primary hover:underline sm:hidden"
                            onClick={() => setTrafficRecordsUser(u)}
                          >
                            {formatBytes(used)}
                            {online > 0
                              ? ` · ${online}/${u.device_limit ?? "∞"}`
                              : ""}
                          </button>
                          <div className="text-[11px] lg:hidden">{expireCell}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-center lg:table-cell">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex items-center gap-1.5 rounded-md border bg-muted/30 px-2 py-1 text-xs tabular-nums">
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                online > 0
                                  ? "bg-emerald-500"
                                  : "bg-muted-foreground/40",
                              )}
                            />
                            <span className="font-medium text-foreground">
                              {online}
                            </span>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-muted-foreground">
                              {u.device_limit ?? "∞"}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {t("user.columns.online_count")}: {online} /{" "}
                          {u.device_limit ?? "∞"}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="hidden text-center whitespace-nowrap sm:table-cell">
                      {statusBadge}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {planBadge}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {groupName ? (
                        <Badge
                          variant="outline"
                          className="max-w-[140px] truncate font-normal text-muted-foreground"
                          title={groupName}
                        >
                          {groupName}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <button
                        type="button"
                        className="group/traffic w-full min-w-0 text-left sm:min-w-[100px]"
                        onClick={() => setTrafficRecordsUser(u)}
                      >
                        <div className="flex items-baseline justify-between gap-2 text-xs tabular-nums">
                          <span className="font-medium group-hover/traffic:text-primary">
                            {formatBytes(used)}
                          </span>
                        </div>
                      </button>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {expireCell}
                    </TableCell>
                    <TableCell className="hidden text-right text-xs tabular-nums font-medium xl:table-cell">
                      {formatCurrencyYuan(u.balance)}
                    </TableCell>
                    <TableCell className="hidden text-right text-xs tabular-nums text-muted-foreground xl:table-cell">
                      {formatCurrencyYuan(u.commission_balance)}
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground tabular-nums xl:table-cell">
                      {u.created_at ? formatDate(u.created_at) : "—"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "sticky right-0 z-10 align-top text-right group-hover:bg-muted/50 sm:align-middle",
                        stickyBg,
                      )}
                    >
                      <div className="flex items-center justify-end gap-0.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hidden h-8 w-8 sm:inline-flex"
                              onClick={() => setEditing(u)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("user.columns.actions_menu.edit")}
                          </TooltipContent>
                        </Tooltip>
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
                            <DropdownMenuItem
                              className="sm:hidden"
                              onClick={() => setEditing(u)}
                            >
                              <Pencil className="h-4 w-4" />
                              {t("user.columns.actions_menu.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                try {
                                  await resetUserSecret(u.id);
                                  toast.success(
                                    t("user.messages.reset_secret.success"),
                                  );
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
                                  await copyToClipboard(url);
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
                            <DropdownMenuItem
                              onClick={() => setLoginHistoryUser(u)}
                            >
                              <History className="h-4 w-4" />
                              {t("user.columns.actions_menu.login_history")}
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
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <Pagination
          page={qs.page}
          pageSize={qs.pageSize}
          total={total}
          onPageChange={(p) => setQs({ page: p })}
          onPageSizeChange={(s) => setQs({ pageSize: s, page: 1 })}
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
          query.email
            ? [{ id: "email", value: query.email }]
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
          query.email
            ? t("user.actions.confirm_ban.filtered_description")
            : t("user.actions.confirm_ban.all_description")
        }
        confirmText={t("user.actions.confirm_ban.confirm")}
        cancelText={t("user.actions.confirm_ban.cancel")}
        onConfirm={async () => {
          try {
            await banUser({
              filter: query.email ? { email: query.email } : undefined,
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

      <UserLoginHistoryDialog
        open={!!loginHistoryUser}
        onOpenChange={(v) => !v && setLoginHistoryUser(null)}
        user={loginHistoryUser}
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

type GeneratedUser = {
  email: string;
  password?: string;
  expired_at?: string | null;
  uuid?: string;
  created_at?: string;
  subscribe_url?: string;
};

function normalizeGenerateResult(res: unknown): {
  ok: boolean;
  users: GeneratedUser[];
} {
  if (res === true || res === 1) return { ok: true, users: [] };
  if (Array.isArray(res)) return { ok: true, users: res as GeneratedUser[] };
  if (res && typeof res === "object") {
    const obj = res as Record<string, unknown>;
    if (Array.isArray(obj.data)) {
      return { ok: true, users: obj.data as GeneratedUser[] };
    }
  }
  return { ok: !!res, users: [] };
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
  const [result, setResult] = useState<{
    ok: boolean;
    users: GeneratedUser[];
  } | null>(null);

  const resetOnClose = (v: boolean) => {
    onOpenChange(v);
    if (!v) {
      setResult(null);
      setForm({
        email_prefix: "",
        email_suffix: "example.com",
        password: "",
        plan_id: "",
        expired_at: "",
        generate_count: 1,
      });
    }
  };

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
      setResult(normalizeGenerateResult(res));
      toast.success(t("user.generate.form.success"));
      onSaved();
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  const copyAll = async () => {
    if (!result?.users.length) return;
    const text = result.users
      .map((u) => {
        const lines = [
          t("user.generate.copy_line.email", { value: u.email }),
          u.password
            ? t("user.generate.copy_line.password", { value: u.password })
            : null,
          u.expired_at
            ? t("user.generate.copy_line.expire", { value: u.expired_at })
            : null,
          u.subscribe_url
            ? t("user.generate.copy_line.subscribe", {
                value: u.subscribe_url,
              })
            : null,
        ].filter(Boolean);
        return lines.join("\n");
      })
      .join("\n\n");
    try {
      await copyToClipboard(text);
      toast.success(t("common.copy.success"));
    } catch {
      toast.error(t("common.copy.failed"));
    }
  };

  const downloadCsv = () => {
    if (!result?.users.length) return;
    const header = [
      t("user.generate.csv.email"),
      t("user.generate.csv.password"),
      t("user.generate.csv.expire_time"),
      t("user.generate.csv.uuid"),
      t("user.generate.csv.created_at"),
      t("user.generate.csv.subscribe_url"),
    ];
    const rows = result.users.map((u) =>
      [
        u.email,
        u.password || "",
        u.expired_at || "",
        u.uuid || "",
        u.created_at || "",
        u.subscribe_url || "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = "\uFEFF" + [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={resetOnClose}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>{t("user.generate.title")}</DialogTitle>
          <DialogDescription>
            {form.email_prefix
              ? t("user.generate.description_single")
              : t("user.generate.description_batch")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 px-6 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-1">
              <Label>{t("user.generate.form.email_prefix")}</Label>
              <Input
                value={form.email_prefix}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email_prefix: e.target.value }))
                }
                placeholder={t("user.generate.form.email_prefix_placeholder")}
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
          <div className="grid gap-3 sm:grid-cols-2">
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

          {result?.ok && (
            <div className="space-y-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  {result.users.length > 0
                    ? t("user.generate.form.generated_count", {
                        count: result.users.length,
                      })
                    : t("user.generate.form.success")}
                </div>
                {result.users.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7"
                      onClick={copyAll}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {t("user.generate.form.copy_all")}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7"
                      onClick={downloadCsv}
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t("user.generate.form.download_csv")}
                    </Button>
                  </div>
                )}
              </div>

              {result.users.length > 0 ? (
                <div className="max-h-56 space-y-2 overflow-y-auto pr-0.5">
                  {result.users.map((u) => (
                    <div
                      key={u.email}
                      className="rounded-md border bg-card p-2.5 text-xs shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 space-y-1">
                          <p className="truncate font-medium text-foreground">
                            {u.email}
                          </p>
                          {u.password && (
                            <p className="text-muted-foreground">
                              {t("user.generate.form.result_password")}{" "}
                              <span className="font-mono text-foreground">
                                {u.password}
                              </span>
                            </p>
                          )}
                          {u.expired_at && (
                            <p className="text-muted-foreground">
                              {t("user.generate.form.result_expire")}{" "}
                              {u.expired_at}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={async () => {
                                  try {
                                    await copyToClipboard(u.email);
                                    toast.success(t("common.copy.success"));
                                  } catch {
                                    toast.error(t("common.copy.failed"));
                                  }
                                }}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {t("user.generate.form.copy_email")}
                            </TooltipContent>
                          </Tooltip>
                          {u.subscribe_url && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={async () => {
                                    try {
                                      await copyToClipboard(u.subscribe_url!);
                                      toast.success(t("common.copy.success"));
                                    } catch {
                                      toast.error(t("common.copy.failed"));
                                    }
                                  }}
                                >
                                  <ClipboardList className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {t("user.generate.form.copy_subscribe")}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {t("user.generate.form.single_success_hint")}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => resetOnClose(false)}>
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
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>{t("user.send_mail.title")}</DialogTitle>
          <DialogDescription>
            {t("user.send_mail.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-6 py-4">
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
        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
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
