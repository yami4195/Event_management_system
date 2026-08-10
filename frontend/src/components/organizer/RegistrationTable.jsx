import { CheckCircle2, XCircle, Mail, Phone } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, formatCurrency } from "../../utils/organizerHelpers";
import "../../styles/components/attendants.css";

export default function RegistrationTable({ registrations = [], onToggleCheckIn }) {
  return (
    <div className="attendants-table-card">
      <div className="attendants-table-scroll">
        <table className="custom-attendants-table">
          <thead>
            <tr>
              <th>Attendee Details</th>
              <th>Target Event</th>
              <th>Ticket Type</th>
              <th>Qty</th>
              <th>Amount Paid</th>
              <th>Reg Date</th>
              <th>Payment Status</th>
              <th>Check-In Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => {
              const initials = reg.attendeeName
                ? reg.attendeeName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "AT";

              const isCheckedIn = reg.checkInStatus === "Checked In";

              return (
                <tr key={reg.id}>
                  <td>
                    <div className="attendee-info-cell">
                      <div className="attendee-avatar-circle">{initials}</div>
                      <div>
                        <h4 className="attendee-name-title">{reg.attendeeName}</h4>
                        <div className="attendee-contact-sub">
                          <span className="attendee-contact-item">
                            <Mail className="w-3 h-3" /> {reg.email}
                          </span>
                          {reg.phone && (
                            <span className="attendee-contact-item">
                              <Phone className="w-3 h-3" /> {reg.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: "800", color: "#0f172a" }}>{reg.eventTitle}</td>
                  <td>
                    <span className="ticket-type-pill">{reg.ticketType}</span>
                  </td>
                  <td style={{ fontWeight: "900", color: "#0f172a", fontSize: "15px" }}>{reg.quantity}</td>
                  <td style={{ fontWeight: "900", color: "#0f172a", fontSize: "15px" }}>
                    {formatCurrency(reg.totalPaid, reg.currency)}
                  </td>
                  <td style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                    {formatDate(reg.registrationDate)}
                  </td>
                  <td>
                    <StatusBadge status={reg.status} />
                  </td>
                  <td>
                    <StatusBadge status={reg.checkInStatus} />
                  </td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      {onToggleCheckIn && (
                        <button
                          type="button"
                          onClick={() => onToggleCheckIn(reg.id)}
                          className={isCheckedIn ? "btn-undo-action" : "btn-checkin-action"}
                        >
                          {isCheckedIn ? (
                            <>
                              <XCircle className="w-4 h-4" /> Undo Check-In
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" /> Check In
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
