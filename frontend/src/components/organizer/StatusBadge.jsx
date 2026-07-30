import { getStatusBadgeConfig } from "../../utils/organizerHelpers";

export default function StatusBadge({ status, className = "" }) {
  const config = getStatusBadgeConfig(status);

  return (
    <span className={`status-badge ${config.bgColor} ${className}`}>
      <span className={`status-badge-dot ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
