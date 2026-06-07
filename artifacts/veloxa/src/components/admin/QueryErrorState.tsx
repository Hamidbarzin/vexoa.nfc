import { AlertCircle, RefreshCw } from "lucide-react";

export function QueryErrorState({
  title,
  onRetry,
}: {
  title: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="rounded-2xl p-12 text-center"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <AlertCircle className="h-8 w-8 mx-auto mb-3 text-red-400" />
      <p className="text-sm text-white/70 mb-1">{title}</p>
      <p className="text-xs text-white/35 mb-6">Please check your connection and try again.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
    </div>
  );
}
