import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { getStatUser } from "@/api/stat";
import { formatBytes, formatDate } from "@/lib/utils";
import type { UserListItem } from "@/api/user";

interface UserTrafficRecordsDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: UserListItem | null;
}

export function UserTrafficRecordsDialog({
  open,
  onOpenChange,
  user,
}: UserTrafficRecordsDialogProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["user-traffic-records", user?.id, page],
    queryFn: () => getStatUser(user!.id, page, pageSize),
    enabled: open && !!user,
  });

  const list = data?.data || [];
  const total = data?.total || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {t("traffic.trafficRecord.title")} · {user?.email}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("traffic.trafficRecord.time")}</TableHead>
                  <TableHead className="text-right">{t("traffic.trafficRecord.upload")}</TableHead>
                  <TableHead className="text-right">{t("traffic.trafficRecord.download")}</TableHead>
                  <TableHead className="text-right">{t("traffic.trafficRecord.rate")}</TableHead>
                  <TableHead className="text-right">{t("traffic.trafficRecord.total")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-20 w-full" />
                    </TableCell>
                  </TableRow>
                ) : list.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <EmptyState message={t("traffic.trafficRecord.noRecords")} />
                    </TableCell>
                  </TableRow>
                ) : (
                  list.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell>{formatDate(row.record_at, false)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatBytes(row.u || 0)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatBytes(row.d || 0)}</TableCell>
                      <TableCell className="text-right tabular-nums">{t("traffic.trafficRecord.multiplier", { value: row.server_rate || 1 })}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatBytes((row.u || 0) + (row.d || 0))}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {total > pageSize && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
