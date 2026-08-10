import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../styles/components/my-events.css";

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
    <div className="custom-pagination-bar">
      <div className="pagination-text">
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{" "}
        <strong>{totalItems}</strong> results
      </div>

      <div className="pagination-nav-btns">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="btn-page-nav"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        <div className="pagination-page-indicator">
          <span>{currentPage}</span> / <span>{totalPages}</span>
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="btn-page-nav"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
