import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import EventForm from "../../components/events/EventForm";
import { eventsService } from "../../services";
import { getRoleDashboard } from "../../components/auth/ProtectedRoute";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dashboardPath = getRoleDashboard(user?.role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData, imageFile) => {
    setIsSubmitting(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description || "");
      payload.append("category_id", formData.categoryId);
      payload.append("date", formData.date);
      payload.append("time", formData.time);
      payload.append("location", formData.location);
      payload.append("capacity", formData.capacity || 0);
      payload.append("price", formData.price || 0);

      if (imageFile) {
        payload.append("image", imageFile);
      }

      const res = await eventsService.create(payload);
      const newEventId = res.data?.data?.event?.event_id || res.data?.data?.id || res.data?.id;

      if (newEventId) {
        navigate(ROUTES.EVENT_DETAIL.replace(":id", newEventId));
      } else {
        navigate(dashboardPath);
      }
    } catch (err) {
      console.error("Create event error:", err);
      setError(err.response?.data?.message || "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <Link to={dashboardPath} className="back-link" style={{ marginBottom: "1rem" }}>
        <FiArrowLeft /> Back to Dashboard
      </Link>

      <div className="dashboard-header">
        <h1 className="dashboard-title">Create New Event</h1>
        <p className="dashboard-subtitle">Fill out the details below to publish your event.</p>
      </div>

      {error && (
        <div style={{ padding: "1rem", background: "rgba(255, 101, 132, 0.1)", color: "#ff6584", borderRadius: "8px", marginBottom: "2rem", border: "1px solid rgba(255, 101, 132, 0.3)" }}>
          {error}
        </div>
      )}

      <div style={{ maxWidth: "800px" }}>
        <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateEvent;
