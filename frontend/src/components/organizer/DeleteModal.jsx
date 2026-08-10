import { AlertTriangle, Trash2 } from "lucide-react";
import "../../styles/components/my-events.css";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  isDeleting = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-icon-badge">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="delete-modal-header">
          <h2 className="delete-modal-title">{title}</h2>
          <p className="delete-modal-desc">{description}</p>
        </div>

        <div className="delete-modal-actions">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="btn-modal-cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn-modal-delete"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
