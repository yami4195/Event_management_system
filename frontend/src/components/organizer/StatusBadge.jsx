export default function StatusBadge({ status = "upcoming", eventDate }) {
  let effectiveStatus = status;
  if (eventDate) {
    const d = new Date(eventDate);
    if (!isNaN(d.getTime()) && d.getTime() < Date.now()) {
      effectiveStatus = "completed";
    }
  }

  const norm = String(effectiveStatus).toLowerCase();
  let statusClass = "status-upcoming";

  if (norm.includes("comp") || norm.includes("end") || norm.includes("past")) statusClass = "status-completed";
  else if (norm.includes("pub") || norm.includes("act")) statusClass = "status-published";
  else if (norm.includes("draft")) statusClass = "status-draft";
  else if (norm.includes("canc")) statusClass = "status-cancelled";

  return (
    <span className={`custom-status-pill ${statusClass}`}>
      <span className="status-dot" />
      <span>{effectiveStatus.toUpperCase()}</span>
    </span>
  );
}
