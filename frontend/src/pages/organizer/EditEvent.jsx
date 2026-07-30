import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventForm from "../../components/organizer/EventForm";
import { organizerService } from "../../services/organizerService";
import { useOrganizer } from "../../hooks/useOrganizer";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateEvent } = useOrganizer();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const res = await updateEvent(id, updatedData);
    setIsSubmitting(false);
    if (res.success) {
      navigate("/organizer/events");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Event Not Found</h2>
        <Button onClick={() => navigate("/organizer/events")} className="mt-4">
          Return to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="h-9 px-3"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Edit Event: {eventData.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Update event scheduling, pricing, location, or image assets.
          </p>
        </div>
      </div>

      <EventForm
        initialData={eventData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => navigate("/organizer/events")}
      />
    </div>
  );
}
