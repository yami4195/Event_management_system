import "../../styles/components/analytics.css";

export default function AnalyticsCard({ title, subtitle, children, action }) {
  return (
    <div className="analytics-section-card">
      <div className="analytics-card-header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
