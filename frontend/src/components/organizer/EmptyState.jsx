import { FolderOpen } from "lucide-react";
import { Button } from "../ui/button";

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = "No items found",
  description = "There are no records available right now.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
