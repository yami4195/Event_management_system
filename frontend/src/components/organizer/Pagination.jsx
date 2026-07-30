import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="pagination-bar">
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        Showing <span className="text-slate-900 dark:text-slate-100">{startItem}</span> to{" "}
        <span className="text-slate-900 dark:text-slate-100">{endItem}</span> of{" "}
        <span className="text-slate-900 dark:text-slate-100">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 px-2.5"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Prev
        </Button>

        <div className="flex items-center gap-1 text-xs font-bold px-2">
          <span className="text-blue-600 dark:text-blue-400">{currentPage}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 dark:text-slate-400">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 px-2.5"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
