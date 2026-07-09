import { useQuery } from "@tanstack/react-query";
import { fetchConfigSection } from "@/api/config";

export function useSectionData(sectionKey: string) {
  return useQuery({
    queryKey: ["config", sectionKey],
    queryFn: () => fetchConfigSection(sectionKey),
    staleTime: 30_000,
  });
}