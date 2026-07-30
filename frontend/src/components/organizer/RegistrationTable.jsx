import { CheckCircle2, XCircle, Mail, Phone } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, formatCurrency } from "../../utils/organizerHelpers";
import { Button } from "../ui/button";

export default function RegistrationTable({ registrations = [], onToggleCheckIn }) {
  return (
    <div className="organizer-table-wrapper">
      <div className="table-responsive">
        <table className="org-table">
          <thead>
            <tr>
              <th>Attendee</th>
              <th>Event</th>
              <th>Ticket Type</th>
              <th>Qty</th>
              <th>Amount Paid</th>
              <th>Reg Date</th>
              <th>Status</th>
              <th>Check-In</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg.id}>
                <td>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{reg.attendeeName}</div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {reg.email}
                      </span>
                      {reg.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {reg.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="font-semibold text-slate-800 dark:text-slate-200">{reg.eventTitle}</td>
                <td>
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
                    {reg.ticketType}
                  </span>
                </td>
                <td className="font-bold text-slate-900 dark:text-slate-100">{reg.quantity}</td>
                <td className="font-extrabold text-slate-900 dark:text-slate-100">
                  {formatCurrency(reg.totalPaid, reg.currency)}
                </td>
                <td className="text-xs text-slate-500">{formatDate(reg.registrationDate)}</td>
                <td>
                  <StatusBadge status={reg.status} />
                </td>
                <td>
                  <StatusBadge status={reg.checkInStatus} />
                </td>
                <td className="text-right">
                  {onToggleCheckIn && (
                    <Button
                      variant={reg.checkInStatus === "Checked In" ? "outline" : "default"}
                      size="sm"
                      onClick={() => onToggleCheckIn(reg.id)}
                      className={`h-8 text-xs font-semibold gap-1 ${
                        reg.checkInStatus === "Checked In"
                          ? "text-slate-600 border-slate-300"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      {reg.checkInStatus === "Checked In" ? (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Undo
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Check In
                        </>
                      )}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
