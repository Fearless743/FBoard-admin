import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/api/plan";

export interface PlanOption {
  id: number;
  name: string;
}

/**
 * 统一的「订阅方案」字典查询。全站通过此 hook 拉取并共享同一条
 * queryKey(["plans", "options"])，避免各页面重复请求。
 *
 * @param enabled 仅当需要时才发起请求（如对话框按需加载）
 */
export function usePlanOptions(enabled = true) {
  return useQuery({
    queryKey: ["plans", "options"],
    queryFn: () => fetchPlans(1, 200),
    enabled,
    staleTime: 5 * 60 * 1000,
    select: (res) => (res?.data || []).map((p) => ({ id: p.id, name: p.name })),
  });
}