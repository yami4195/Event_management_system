import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import EventForm from "../../components/organizer/EventForm";
import { organizerService } from "../../services/organizerService";
import { useOrganizer } from "../../hooks/useOrganizer";
import { ArrowLeft, AlertCircle, Edit3, ChevronRight } from "lucide-react";
import "../../styles/components/create-event.css";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateEvent } = useOrganizer();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      const res = await organizerService.getEventById(id);
      if (res.success) {
        setEventData(res.data);
      }
      setLoading(false);
    }
    loadEvent();
  }, [id]);

  const handleSubmit = async (updatedData) => {
    setIsSubmitting(true);
    setServerError("");
    const res = await updateEvent(id, updatedData);
    setIsSubmitting(false);
    if (res.success) {
      navigate("/organizer/events");
    } else {
      setServerError(res.message || "Failed to update event details.");
    }
  };

  if (loading) {
    return (
      <div className="create-event-page-wrapper" style={{ alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3" />
        <p style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>Loading Event Configuration...</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="create-event-page-wrapper" style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>Event Not Found</h2>
        <p style={{ fontSize: "13px", color: "#64748b" }}>The requested event could not be found or was removed.</p>
        <button onClick={() => navigate("/organizer/events")} className="btn-primary-custom" style={{ margin: "16px auto 0 auto" }}>
          Return to My Events
        </button>
      </div>
    );
  }

  return (
    <div className="create-event-page-wrapper">
      {/* Breadcrumb Navigation */}
      <div className="create-event-breadcrumb">
        <Link to="/organizer/dashboard" className="breadcrumb-link">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/organizer/events" className="breadcrumb-link">
          My Events
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="breadcrumb-current">Edit Event</span>
      </div>

      {/* Header Banner Card */}
      <div className="create-event-header-card">
        <div className="header-title-group">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="back-btn-custom"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div>
            <div className="header-badge-tag">
              <Edit3 className="w-3.5 h-3.5" /> Modify Event Details
            </div>
            <h1 className="create-event-title">Edit Event: {eventData.title}</h1>
            <p className="create-event-subtitle">
              Update event date/time scheduling, location, seat capacity, ticket price, or cover banner.
            </p>
          </div>
        </div>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="server-error-banner">
          <AlertCircle className="w-5 h-5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Uncrowded Form with Live Preview */}
      <EventForm
        initialData={eventData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => navigate("/organizer/events")}
      />
    </div>
  );
}
