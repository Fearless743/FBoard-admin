import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { Badge } from "@/components/ui/badge";
import { fetchUserLoginLogs, type UserListItem } from "@/api/user";
import { formatDate } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: UserListItem | null;
}

export function UserLoginHistoryDialog({ open, onOpenChange, user }: Props) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["user-login-logs", user?.id, page],
    queryFn: () => fetchUserLoginLogs(user!.id, page, pageSize),
    enabled: open && !!user,
  });

  const list = data?.data || [];
  const total = data?.total || 0;

  const methodLabel = (method: string) => {
    const key = `user.login_history.methods.${method}`;
    const label = t(key);
    return label === key ? method : label;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setPage(1);
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>
            {t("user.login_history.title")} · {user?.email}
          </DialogTitle>
          {(user?.register_ip || user?.last_login_ip) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
              {user.register_ip && (
                <span>
                  {t("user.dialog.fields.registerIp")}:{" "}
                  <span className="font-mono text-foreground">
                    {user.register_ip}
                  </span>
                </span>
              )}
              {user.last_login_ip && (
                <span>
                  {t("user.dialog.fields.lastLoginIp")}:{" "}
                  <span className="font-mono text-foreground">
                    {user.last_login_ip}
                  </span>
                </span>
              )}
            </div>
          )}
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("user.login_history.columns.time")}</TableHead>
                  <TableHead>{t("user.login_history.columns.ip")}</TableHead>
                  <TableHead>{t("user.login_history.columns.method")}</TableHead>
                  <TableHead>
                    {t("user.login_history.columns.user_agent")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-20 w-full" />
                    </TableCell>
                  </TableRow>
                ) : list.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <EmptyState
                        message={t("user.login_history.no_records")}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  list.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="whitespace-nowrap">
                        {row.created_at ? formatDate(row.created_at) : "—"}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {row.ip || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {methodLabel(row.method)}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className="max-w-[280px] truncate text-xs text-muted-foreground"
                        title={row.user_agent || undefined}
                      >
                        {row.user_agent || "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {total > pageSize && (
          <div className="border-t px-6 py-3 shrink-0">
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              compact
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
