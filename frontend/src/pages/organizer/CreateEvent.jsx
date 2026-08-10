import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import EventForm from "../../components/organizer/EventForm";
import { useOrganizer } from "../../hooks/useOrganizer";
import { ArrowLeft, AlertCircle, Sparkles, ChevronRight, PlusCircle } from "lucide-react";
import "../../styles/components/create-event.css";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { createEvent } = useOrganizer();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (eventData) => {
    setIsSubmitting(true);
    setServerError("");
    const res = await createEvent(eventData);
    setIsSubmitting(false);
    if (res.success) {
      navigate("/organizer/events");
    } else {
      setServerError(
        res.message || "Failed to publish event. Please check your input fields."
      );
    }
  };

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
        <span className="breadcrumb-current">Create Event</span>
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
              <PlusCircle className="w-3.5 h-3.5" /> New Experience Studio
            </div>
            <h1 className="create-event-title">Create & Publish Event</h1>
            <p className="create-event-subtitle">
              Set up your event timing, ticketing price, venue location, and Cloudinary cover banner.
            </p>
          </div>
        </div>

        <div className="header-info-pill">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Cloudinary Storage Direct</span>
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
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => navigate("/organizer/events")}
      />
    </div>
  );
}
