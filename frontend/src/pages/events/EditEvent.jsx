import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import EventForm from "../../components/events/EventForm";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { eventsService } from "../../services";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventsService.getById(id);
        const data = res.data?.data?.event || res.data?.data || res.data;
        if (data) setInitialData(data);
      } catch (err) {
        setError("Failed to load event details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

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

      await eventsService.update(id, payload);
      navigate(`/events/${id}`);
    } catch (err) {
      console.error("Update event error:", err);
      setError(err.response?.data?.message || "Failed to update event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading event..." />;
  }

  if (error && !initialData) {
    return (
      <div className="dashboard-page">
        <h2>{error}</h2>
        <Link to="/dashboard" className="btn btn--outline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Link to="/dashboard" className="back-link" style={{ marginBottom: "1rem" }}>
        <FiArrowLeft /> Back to Dashboard
      </Link>
      
      <div className="dashboard-header">
        <h1 className="dashboard-title">Edit Event</h1>
        <p className="dashboard-subtitle">Update the details for "{initialData?.title}".</p>
      </div>

      {error && (
        <div style={{ padding: "1rem", background: "rgba(255, 101, 132, 0.1)", color: "#ff6584", borderRadius: "8px", marginBottom: "2rem", border: "1px solid rgba(255, 101, 132, 0.3)" }}>
          {error}
        </div>
      )}

      <div style={{ maxWidth: "800px" }}>
        <EventForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default EditEvent;
