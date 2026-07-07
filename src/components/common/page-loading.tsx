import { Loader2 } from "lucide-react";

export default function PageLoading() {
  return (
    <div className="flex h-full min-h-[40vh] items-center justify-center text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}
