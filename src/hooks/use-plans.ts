import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/api/plan";

export function usePlanOptions() {
  return useQuery({
    queryKey: ["plans", "options"],
    queryFn: () => fetchPlans(1, 200),
    staleTime: 5 * 60 * 1000,
    select: (res) => (res?.data || []).map((p) => ({ id: p.id, name: p.name })),
  });
}
