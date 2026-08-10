import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCustomer } from "../../hooks/useCustomer";
import { Compass, Ticket, Calendar, MapPin, Search, QrCode, ArrowRight } from "lucide-react";
import "../../styles/components/customer-portal.css";

export default function CustomerEvents() {
  const { loading, registrations, cancelRegistration } = useCustomer();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPass, setSelectedPass] = useState(null);

  const filteredList = useMemo(() => {
    return registrations.filter((reg) => {
      const title = (reg.event_title || reg.eventTitle || "").toLowerCase();
      const loc = (reg.event_location || "").toLowerCase();
      const matchesSearch = !searchQuery || title.includes(searchQuery.toLowerCase()) || loc.includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || (reg.status || "").toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [registrations, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="customer-page-container" style={{ alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3" />
        <p style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>Loading My Registered Event Passes...</p>
      </div>
    );
  }

  return (
    <div className="customer-page-container">
      {/* Header Banner */}
      <div className="customer-banner-card">
        <div className="customer-banner-text">
          <div className="customer-pill-badge">
            <span>{registrations.length} Active Ticket Passes</span>
          </div>
          <h1>My Registered Event Passes</h1>
          <p>Access your ticket passes, check QR entry codes, and manage your event schedule.</p>
        </div>

        <Link to="/events" className="btn-action-primary">
          <Compass className="w-4 h-4" />
          <span>Discover More Events</span>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", background: "#ffffff", padding: "20px 24px", border: "1px solid #e2e8f0", borderRadius: "24px", boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          {/* Search Input */}
          <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <Search className="w-4 h-4" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title or location..."
              style={{
                width: "100%",
                height: "46px",
                paddingLeft: "44px",
                paddingRight: "16px",
                borderRadius: "14px",
                border: "1.5px solid #cbd5e1",
                background: "#f8fafc",
                fontSize: "14px",
                fontWeight: "600",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              height: "46px",
              padding: "0 18px",
              borderRadius: "14px",
              border: "1.5px solid #cbd5e1",
              background: "#f8fafc",
              fontSize: "14px",
              fontWeight: "600",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Registrations List / Table */}
      {filteredList.length === 0 ? (
        <div className="customer-section" style={{ textAlign: "center", padding: "60px 40px" }}>
          <Ticket className="w-12 h-12" style={{ color: "#2563eb", margin: "0 auto 16px auto" }} />
          <h3 style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: "0 0 8px 0" }}>No registered passes found</h3>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 24px 0" }}>There are no registered tickets matching your search query.</p>
          <Link to="/events" className="btn-action-primary" style={{ display: "inline-flex" }}>
            <Compass className="w-4 h-4" /> Browse All Events
          </Link>
        </div>
      ) : (
        <div className="customer-table-card">
          <div className="customer-table-wrapper">
            <table className="customer-data-table">
              <thead>
                <tr>
                  <th>Event Name & Location</th>
                  <th>Date</th>
                  <th>Pass Type</th>
                  <th>Ticket Qty</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Ticket Pass</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((reg) => (
                  <tr key={reg.id || reg.registration_id}>
                    <td>
                      <div className="pass-event-cell">
                        <div className="pass-event-icon">🎫</div>
                        <div>
                          <h4 className="pass-title">{reg.event_title || reg.eventTitle}</h4>
                          <div className="pass-sub">
                            <span><MapPin className="w-3.5 h-3.5 inline mr-1" />{reg.event_location || "Venue TBA"}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                      {reg.event_date || reg.registrationDate || "TBA"}
                    </td>
                    <td>
                      <span style={{ padding: "4px 10px", borderRadius: "8px", background: "#eff6ff", color: "#2563eb", fontSize: "12px", fontWeight: "800" }}>
                        {reg.ticket_type || reg.ticketType || "Standard Pass"}
                      </span>
                    </td>
                    <td style={{ fontWeight: "900", fontSize: "15px", color: "#0f172a" }}>
                      {reg.quantity || 1}
                    </td>
                    <td>
                      <span style={{ padding: "4px 12px", borderRadius: "20px", background: "#dcfce7", color: "#16a34a", fontSize: "12px", fontWeight: "800" }}>
                        {reg.status || "Confirmed"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedPass(reg)}
                          className="btn-action-primary"
                          style={{ height: "36px", padding: "0 14px", fontSize: "12px" }}
                        >
                          <QrCode className="w-4 h-4" /> QR Pass
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR Ticket Pass Modal */}
      {selectedPass && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#ffffff", borderRadius: "28px", padding: "36px", maxWidth: "440px", width: "100%", border: "1px solid #e2e8f0", boxShadow: "0 20px 40px rgba(15, 23, 42, 0.2)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "20px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
              🎟️
            </div>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px 0" }}>
                {selectedPass.event_title || selectedPass.eventTitle}
              </h2>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                Present this QR code at the event entrance for instant door check-in.
              </p>
            </div>

            {/* QR Code Placeholder Box */}
            <div style={{ width: "200px", height: "200px", background: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <QrCode className="w-24 h-24" style={{ color: "#0f172a" }} />
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", letterSpacing: "0.08em" }}>
                PASS #{String(selectedPass.id || selectedPass.registration_id || "10092").substring(0, 8).toUpperCase()}
              </span>
            </div>

            <div style={{ display: "flex", gap: "12px", width: "100%" }}>
              <button
                type="button"
                onClick={() => setSelectedPass(null)}
                className="btn-action-secondary"
                style={{ flex: 1, justifyContent: "center" }}
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
