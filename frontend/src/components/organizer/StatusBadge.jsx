export default function StatusBadge({ status = "upcoming" }) {
  const norm = String(status).toLowerCase();
  let statusClass = "status-upcoming";

  if (norm.includes("pub")) statusClass = "status-published";
  else if (norm.includes("draft")) statusClass = "status-draft";
  else if (norm.includes("canc")) statusClass = "status-cancelled";

  return (
    <span className={`custom-status-pill ${statusClass}`}>
      <span className="status-dot" />
      <span>{status.toUpperCase()}</span>
    </span>
  );
}
