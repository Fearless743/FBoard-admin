import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/api/plan";

/** 套餐选项：{id, name}[]，提供给用户编辑/创建时下拉选择 */
export function usePlanOptions() {
  return useQuery({
    queryKey: ["plans", "options"],
    queryFn: fetchPlans,
    staleTime: 5 * 60 * 1000,
    select: (res) => (res || []).map((p) => ({ id: p.id, name: p.name })),
  });
}
