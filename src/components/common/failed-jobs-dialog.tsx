import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Clock, Server, Bug } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/common/pagination";
import { getHorizonFailedJobs, type FailedJobItem } from "@/api/stat";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 10;

interface FailedJobsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function FailedJobCard({ job }: { job: FailedJobItem }) {
  return (
    <div className="rounded-lg border p-4 transition-colors hover:bg-muted/30">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-sm">{job.name.split("\\").pop()}</span>
            <Badge variant="destructive" className="shrink-0 text-[10px] px-1.5 py-0">
              {job.status}
            </Badge>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Server className="h-3 w-3" />
              {job.queue}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(Math.floor(new Date(job.failed_at).getTime() / 1000), true)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 rounded bg-muted/50 p-2">
        <p className="text-xs text-muted-foreground leading-relaxed break-all max-h-20 overflow-hidden relative">
          {job.exception?.split("\n")[0] || "暂无异常信息"}
        </p>
      </div>
    </div>
  );
}

export function FailedJobsDialog({ open, onOpenChange }: FailedJobsDialogProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["failed-jobs", page],
    queryFn: () => getHorizonFailedJobs(page, PAGE_SIZE),
    enabled: open,
  });

  const jobs = data?.data || [];
  const total = data?.total || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-destructive" />
            {t("dashboard.queue.details.failedJobsDetailTitle")}
            {total > 0 && (
              <Badge variant="destructive" className="ml-2">
                {total}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[100px] rounded-lg" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-muted-foreground">
              <AlertCircle className="mb-2 h-8 w-8" />
              <p className="text-sm">{t("dashboard.queue.details.noFailedJobs")}</p>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              {jobs.map((job) => (
                <FailedJobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>

        {total > PAGE_SIZE && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
