import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Network,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { cn } from "@/lib/utils";
import {
  createChildNode,
  dropServer,
  fetchGroups,
  getChildNodes,
  updateChildNode,
  type Server,
  type ServerGroup,
} from "@/api/server";

type ChildPayload = {
  name: string;
  host: string;
  port: number;
  group_ids?: number[];
  tags?: string[];
  show?: boolean;
};

export function VirtualNodeList({
  parentId,
  enabled,
}: {
  parentId: number;
  enabled: boolean;
}) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editNode, setEditNode] = useState<Server | null>(null);
  const [deleteNode, setDeleteNode] = useState<Server | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const {
    data: childNodes = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["server", "child-nodes", parentId],
    queryFn: () => getChildNodes(parentId),
    enabled: enabled && !!parentId,
  });

  const { data: groupsData } = useQuery({
    queryKey: ["server", "groups"],
    queryFn: fetchGroups,
    enabled: enabled,
    staleTime: 300_000,
  });
  const groups: ServerGroup[] = groupsData || [];
  const groupNameMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const g of groups) map.set(g.id, g.name);
    return map;
  }, [groups]);

  const invalidate = useCallback(async () => {
    await qc.invalidateQueries({
      queryKey: ["server", "child-nodes", parentId],
    });
    await qc.invalidateQueries({ queryKey: ["servers"] });
  }, [qc, parentId]);

  const handleAdd = useCallback(
    async (payload: ChildPayload) => {
      await createChildNode({ parent_id: parentId, ...payload });
      setDialogOpen(false);
      setEditNode(null);
      toast.success(t("server.form.virtualNode.saveSuccess"));
      await invalidate();
    },
    [parentId, invalidate, t],
  );

  const handleEdit = useCallback(
    async (payload: ChildPayload & { id: number }) => {
      await updateChildNode(payload);
      setDialogOpen(false);
      setEditNode(null);
      toast.success(t("server.form.virtualNode.saveSuccess"));
      await invalidate();
    },
    [invalidate, t],
  );

  const handleToggleShow = useCallback(
    async (node: Server, checked: boolean) => {
      setTogglingId(node.id);
      try {
        await updateChildNode({
          id: node.id,
          name: node.name,
          host: node.host,
          port: node.port,
          show: checked,
          group_ids: node.group_ids,
          tags: node.tags,
        });
        await invalidate();
      } catch {
        toast.error(
          t("server.form.virtualNode.toggleFailed", {
            defaultValue: "更新显示状态失败",
          }),
        );
      } finally {
        setTogglingId(null);
      }
    },
    [invalidate, t],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteNode) return;
    setDeleting(true);
    try {
      await dropServer(deleteNode.id);
      setDeleteNode(null);
      toast.success(
        t("server.form.virtualNode.deleteSuccess", {
          defaultValue: t("server.columns.actions_dropdown.delete_success", {
            defaultValue: "删除成功",
          }),
        }),
      );
      await invalidate();
    } catch {
      toast.error(
        t("server.form.virtualNode.deleteFailed", {
          defaultValue: "删除失败",
        }),
      );
    } finally {
      setDeleting(false);
    }
  }, [deleteNode, invalidate, t]);

  return (
    <div className="space-y-3 sm:col-span-2 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">
              {t("server.form.virtualNode.label")}
            </Label>
            <Badge variant="secondary" className="text-[10px] tabular-nums">
              {childNodes.length}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("server.form.virtualNode.description")}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            title={t("common.refresh", { defaultValue: "刷新" })}
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", isFetching && "animate-spin")}
            />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setEditNode(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            {t("server.form.virtualNode.add")}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-md border border-dashed py-8 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {t("common.loading", { defaultValue: "加载中..." })}
        </div>
      ) : childNodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-8 text-center">
          <Network className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground">
            {t("server.form.virtualNode.empty")}
          </p>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => {
              setEditNode(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            {t("server.form.virtualNode.add")}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {childNodes.map((node) => {
            const groupLabels = (node.group_ids || [])
              .map((id) => groupNameMap.get(Number(id)))
              .filter(Boolean) as string[];
            const nodeTags = (node.tags || []).filter(Boolean);
            const isToggling = togglingId === node.id;

            return (
              <div
                key={node.id}
                className={cn(
                  "rounded-md border px-3 py-2.5 transition-colors",
                  !node.show && "opacity-60",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Switch
                        checked={!!node.show}
                        disabled={isToggling}
                        onCheckedChange={(checked) =>
                          void handleToggleShow(node, checked)
                        }
                        className="scale-90"
                      />
                      <span className="text-sm font-medium truncate">
                        {node.name || `#${node.id}`}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {node.host}:{node.port}
                      </span>
                      <Badge
                        variant={node.show ? "default" : "outline"}
                        className="text-[10px]"
                      >
                        {node.show
                          ? t("server.form.virtualNode.visible", {
                              defaultValue: "显示",
                            })
                          : t("server.form.virtualNode.hidden", {
                              defaultValue: "隐藏",
                            })}
                      </Badge>
                      {isToggling && (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      )}
                    </div>

                    {(groupLabels.length > 0 || nodeTags.length > 0) && (
                      <div className="flex flex-wrap gap-1 pl-10">
                        {groupLabels.map((name) => (
                          <Badge
                            key={`g-${name}`}
                            variant="secondary"
                            className="text-[10px] font-normal"
                          >
                            {name}
                          </Badge>
                        ))}
                        {nodeTags.map((tag) => (
                          <Badge
                            key={`t-${tag}`}
                            variant="outline"
                            className="text-[10px] font-normal"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title={t("server.form.virtualNode.edit", {
                        defaultValue: "编辑",
                      })}
                      onClick={() => {
                        setEditNode(node);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      title={t("server.form.virtualNode.delete", {
                        defaultValue: "删除",
                      })}
                      onClick={() => setDeleteNode(node)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ChildNodeDialog
        open={dialogOpen}
        onOpenChange={(v) => {
          if (!v) {
            setDialogOpen(false);
            setEditNode(null);
          }
        }}
        editNode={editNode}
        groups={groups}
        onAdd={handleAdd}
        onEdit={handleEdit}
      />

      <ConfirmDialog
        open={!!deleteNode}
        onOpenChange={(v) => !v && setDeleteNode(null)}
        title={t("server.form.virtualNode.deleteConfirmTitle", {
          defaultValue: "确认删除",
        })}
        description={t("server.form.virtualNode.deleteConfirmDesc", {
          defaultValue: "确定要删除虚拟节点「{{name}}」吗？此操作不可恢复。",
          name: deleteNode?.name || deleteNode?.host || "",
        })}
        confirmText={t("common.delete", { defaultValue: "删除" })}
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function ChildNodeDialog({
  open,
  onOpenChange,
  editNode,
  groups,
  onAdd,
  onEdit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editNode: Server | null;
  groups: ServerGroup[];
  onAdd: (payload: ChildPayload) => Promise<void>;
  onEdit: (payload: ChildPayload & { id: number }) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState(443);
  const [show, setShow] = useState(true);
  const [groupIds, setGroupIds] = useState<number[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!editNode;

  useEffect(() => {
    if (!open) return;
    if (editNode) {
      setName(editNode.name || "");
      setHost(editNode.host || "");
      setPort(editNode.port ?? 443);
      setShow(!!editNode.show);
      setGroupIds((editNode.group_ids || []).map(Number));
      setTags((editNode.tags || []).filter(Boolean));
    } else {
      setName("");
      setHost("");
      setPort(443);
      setShow(true);
      setGroupIds([]);
      setTags([]);
    }
    setTagInput("");
    setSubmitting(false);
  }, [open, editNode]);

  const addTag = () => {
    const next = tagInput.trim().replace(/,/g, "");
    if (next && !tags.includes(next)) {
      setTags([...tags, next]);
    }
    setTagInput("");
  };

  const handleConfirm = async () => {
    if (!host.trim() || !name.trim()) return;
    setSubmitting(true);
    try {
      const payload: ChildPayload = {
        name: name.trim(),
        host: host.trim(),
        port: Number(port) || 443,
        group_ids: groupIds,
        tags,
        show,
      };
      if (isEditing && editNode) {
        await onEdit({ id: editNode.id, ...payload });
      } else {
        await onAdd(payload);
      }
    } catch {
      toast.error(
        t("server.form.virtualNode.saveFailed", {
          defaultValue: "保存虚拟节点失败",
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md flex flex-col p-0 gap-0 max-h-[90vh]">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>
            {isEditing
              ? t("server.form.virtualNode.editDialogTitle", {
                  defaultValue: "编辑虚拟节点",
                })
              : t("server.form.virtualNode.addDialogTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 px-6 py-4">
          <div className="space-y-1.5">
            <Label>{t("server.form.name.label", { defaultValue: "名称" })}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("server.form.virtualNode.namePlaceholder", {
                defaultValue: "虚拟节点名称",
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t("server.form.virtualNode.host")}</Label>
              <Input
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="host / domain"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("server.form.virtualNode.port")}</Label>
              <Input
                type="number"
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <Label className="text-sm font-normal">
              {t("server.form.virtualNode.show", { defaultValue: "显示" })}
            </Label>
            <Switch checked={show} onCheckedChange={setShow} />
          </div>

          <div className="space-y-1.5">
            <Label>{t("server.form.virtualNode.groupIds")}</Label>
            <div className="flex flex-wrap gap-2 rounded-md border p-2 min-h-10">
              {groups.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  {t("server.form.groups.empty")}
                </span>
              )}
              {groups.map((g) => {
                const active = groupIds.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() =>
                      setGroupIds(
                        active
                          ? groupIds.filter((id) => id !== g.id)
                          : [...groupIds, g.id],
                      )
                    }
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-accent",
                    )}
                  >
                    {g.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t("server.form.virtualNode.tags")}</Label>
            <div className="flex flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 min-h-10">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setTags(tags.filter((x) => x !== tag))}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                className="min-w-[80px] flex-1 border-0 bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground"
                placeholder={t("server.form.virtualNode.tagsPlaceholder")}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                  if (e.key === "Backspace" && !tagInput && tags.length) {
                    setTags(tags.slice(0, -1));
                  }
                }}
                onBlur={addTag}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 gap-2 border-t bg-background px-6 py-4">
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            disabled={submitting || !host.trim() || !name.trim()}
            onClick={() => void handleConfirm()}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing
              ? t("common.save", { defaultValue: "保存" })
              : t("common.add", { defaultValue: "添加" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
