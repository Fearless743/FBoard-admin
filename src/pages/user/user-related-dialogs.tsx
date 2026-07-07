import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { adminGet } from "@/api/client";
import { formatBytes, formatDate } from "@/lib/utils";
import type { UserListItem } from "@/api/user";

/** 通用：用户关联数据弹窗（订单 / 流量记录 / 邀请） */
function UserRelatedTable({
  open,
  onOpenChange,
  user,
  title,
  queryKey,
  url,
  columns,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: UserListItem | null;
  title: string;
  queryKey: string;
  url: string;
  columns: Array<{
    key: string;
    label: string;
    render?: (row: any) => React.ReactNode;
    align?: "left" | "right" | "center";
  }>;
}) {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey, user?.id],
    queryFn: () => adminGet<any>(url + "?user_id=" + user?.id + "&current=1&pageSize=50"),
    enabled: open && !!user,
  });
  const list: any[] = data?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {title} · {user?.email}
          </DialogTitle>
        </DialogHeader>
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead
                    key={c.key}
                    className={
                      c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""
                    }
                  >
                    {c.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Skeleton className="h-20 w-full" />
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <EmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                list.map((row, i) => (
                  <TableRow key={row.id ?? i}>
                    {columns.map((c) => (
                      <TableCell
                        key={c.key}
                        className={
                          c.align === "right" ? "text-right tabular-nums" : c.align === "center" ? "text-center" : ""
                        }
                      >
                        {c.render ? c.render(row) : row[c.key] ?? "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function UserOrdersDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: UserListItem | null;
}) {
  const { t } = useTranslation();
  return (
    <UserRelatedTable
      open={open}
      onOpenChange={onOpenChange}
      user={user}
      title={t("user.columns.actions_menu.orders")}
      queryKey="user-orders"
      url="/order/fetch"
      columns={[
        { key: "trade_no", label: t("order.table.columns.tradeNo") },
        { key: "type", label: t("order.table.columns.type"), render: (r) => <Badge variant="outline">{t(`order.type.${r.type}`)}</Badge> },
        { key: "period", label: t("order.table.columns.period") },
        { key: "total_amount", label: t("order.table.columns.amount"), align: "right", render: (r) => `¥${((r.actual_amount ?? r.total_amount ?? 0) / 100).toFixed(2)}` },
        { key: "status", label: t("order.table.columns.status"), render: (r) => <Badge variant="secondary">{String(t(`order.status.${r.status}`, String(r.status)))}</Badge> },
        { key: "created_at", label: t("order.table.columns.createdAt"), render: (r) => formatDate(r.created_at) },
      ]}
    />
  );
}

export { UserTrafficRecordsDialog } from "./user-traffic-records-dialog";

export function UserInvitesDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: UserListItem | null;
}) {
  const { t } = useTranslation();
  return (
    <UserRelatedTable
      open={open}
      onOpenChange={onOpenChange}
      user={user}
      title={t("user.columns.actions_menu.invites")}
      queryKey="user-invites"
      url="/user/inviteList"
      columns={[
        { key: "invitee_email", label: "邀请用户" },
        { key: "commission_balance", label: t("user.columns.commission"), align: "right", render: (r) => formatBytes(r.commission_balance ?? 0) },
        { key: "created_at", label: "注册时间", render: (r) => formatDate(r.created_at) },
      ]}
    />
  );
}