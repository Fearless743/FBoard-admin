import { useQuery } from "@tanstack/react-query";
import { fetchGroups, type ServerGroup } from "@/api/server";

/**
 * 统一的「节点权限组」字典查询。全站通过此 hook 拉取并共享同一条
 * queryKey(["server-groups"])，避免各页面各自 useQuery 造成重复请求。
 * 数据不常变化，staleTime 设为 5 分钟与 usePlans 的字典缓存策略一致。
 *
 * @param enabled 仅当需要时才发起请求（如对话框按需加载）
 */
export function useServerGroups(enabled = true) {
  return useQuery({
    queryKey: ["server-groups"],
    queryFn: fetchGroups,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export type { ServerGroup };