import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventForm from "../../components/organizer/EventForm";
import { useOrganizer } from "../../hooks/useOrganizer";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { createEvent } = useOrganizer();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (eventData) => {
    setIsSubmitting(true);
    const res = await createEvent(eventData);
    setIsSubmitting(false);
    if (res.success) {
      navigate("/organizer/events");
    }
  };

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
            Publish New Event
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set up event details, ticketing pricing, venue locations, and banners.
          </p>
        </div>
      </div>

      <EventForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => navigate("/organizer/events")}
      />
    </div>
  );
}
