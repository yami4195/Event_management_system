import { useState, useEffect, useMemo, useCallback } from "react";
import {
  MessageSquare,
  Star,
  Search,
  RotateCcw,
  Trash2,
  Calendar,
  Building2,
  User,
  CheckCircle,
} from "lucide-react";
import { eventsService } from "@/services/events.service";
import { feedbackService } from "@/services/feedback.service";
import StatCard from "@/components/admin/StatCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Feedback() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionNotice, setActionNotice] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await eventsService.getAll();
      const list = res.data?.data?.events || res.data?.events || [];
      setEvents(list);
      if (list.length > 0) {
        setSelectedEventId(list[0].event_id || list[0].id);
      }
    } catch (err) {
      console.error("Failed to load events for feedback:", err);
      showToast("Failed to load event list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const fetchFeedbackForEvent = useCallback(async (eventId) => {
    if (!eventId) return;
    setLoadingFeedback(true);
    try {
      const res = await feedbackService.getByEventId(eventId);
      const list = res.data?.data?.feedback || res.data?.feedback || [];
      setFeedbackList(list);
    } catch (err) {
      console.error("Failed to load feedback:", err);
      setFeedbackList([]);
    } finally {
      setLoadingFeedback(false);
    }
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchFeedbackForEvent(selectedEventId);
    }
  }, [selectedEventId, fetchFeedbackForEvent]);

  const showToast = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to remove this feedback review?")) return;
    try {
      await feedbackService.delete(feedbackId);
      showToast("Feedback review removed.");
      fetchFeedbackForEvent(selectedEventId);
    } catch (err) {
      console.error("Delete feedback error:", err);
      showToast("Failed to delete review.");
    }
  };

  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((fb) => {
      const matchesSearch =
        searchQuery === "" ||
        (fb.user_name && fb.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (fb.comment && fb.comment.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRating =
        ratingFilter === "All" || String(fb.rating) === ratingFilter;

      return matchesSearch && matchesRating;
    });
  }, [feedbackList, searchQuery, ratingFilter]);

  const averageRating = useMemo(() => {
    if (feedbackList.length === 0) return 0;
    const sum = feedbackList.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / feedbackList.length).toFixed(1);
  }, [feedbackList]);

  const selectedEvent = events.find((e) => (e.event_id || e.id) === selectedEventId);

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-6 lg:p-8 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Event Feedback & Reviews
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Moderate attendee reviews, monitor customer satisfaction scores, and analyze event feedback.
          </p>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-md">
          {actionNotice}
        </div>
      )}

      {/* Event Selector & Overall Metric Grid */}
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          title="Average Rating"
          value={`${averageRating} / 5.0`}
          icon={Star}
          description="Selected event rating"
          variant="indigo"
        />
        <StatCard
          title="Total Reviews"
          value={feedbackList.length.toString()}
          icon={MessageSquare}
          description="Attendee submissions"
          variant="blue"
        />
        <StatCard
          title="5-Star Ratings"
          value={feedbackList.filter((f) => f.rating === 5).length.toString()}
          icon={CheckCircle}
          description="Top tier satisfaction"
          variant="emerald"
        />
      </div>

      {/* Main Review Moderation Card */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Event Reviews
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Select an event to view its attendee feedback submissions
              </p>
            </div>

            {/* Event Selector Dropdown */}
            <div className="w-full sm:w-72">
              <Select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="h-10 border-slate-200 bg-white text-sm"
              >
                {events.map((evt) => (
                  <option key={evt.event_id || evt.id} value={evt.event_id || evt.id}>
                    {evt.title}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Search and Rating Filters */}
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search reviews by commenter or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 border-slate-200 bg-white"
              />
            </div>

            <div className="w-full sm:w-44">
              <Select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="h-10 border-slate-200"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </Select>
            </div>

            {(searchQuery || ratingFilter !== "All") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setRatingFilter("All");
                }}
                className="h-10 gap-1.5 border-slate-200 text-slate-600 hover:text-slate-900"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loadingFeedback ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3" />
              <p className="text-sm font-medium text-slate-500">Loading attendee feedback...</p>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <MessageSquare className="h-8 w-8 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No reviews found
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                No feedback has been submitted for this event yet, or no reviews match your active filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredFeedback.map((fb) => (
                <div
                  key={fb.feedback_id}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs">
                          {fb.user_name ? fb.user_name.charAt(0) : "U"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {fb.user_name || "Anonymous Attendee"}
                          </p>
                          <span className="text-xs text-slate-400">
                            {fb.submitted_at
                              ? new Date(fb.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                              : "Recently"}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < fb.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-md border border-slate-100">
                      "{fb.comment || "No comment provided."}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">
                      ID: {fb.feedback_id.slice(0, 8)}...
                    </span>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFeedback(fb.feedback_id)}
                      className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-50 gap-1 font-semibold"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}