import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Star,
  UserCheck,
  Building2,
  Tag,
} from "lucide-react";
import { getEventById, updateEvent, deleteEvent } from "@/data/events";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function AdminEventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  useEffect(() => {
    const found = getEventById(eventId);
    if (found) {
      setEvent({ ...found });
    }
  }, [eventId]);

  if (!event) {
    return (
      <div className="min-h-screen space-y-6 bg-slate-50 p-6 lg:p-8 text-slate-900">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/events")}
          className="mb-4 gap-2 border-slate-200 bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Button>
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">Event Not Found</h2>
          <p className="text-sm text-slate-500 mt-1">
            No event matching ID <code className="font-mono">{eventId}</code> was found.
          </p>
        </Card>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    const updated = updateEvent(event.id, { status: newStatus });
    if (updated) {
      setEvent({ ...updated });
      setActionNotice(`Event status updated to "${newStatus}"`);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleDelete = () => {
    deleteEvent(event.id);
    navigate("/admin/events");
  };

  const remainingSeats = Math.max(0, event.capacity - event.registered);
  const fillPercentage = Math.min(100, Math.round((event.registered / event.capacity) * 100));

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6 lg:p-8 text-slate-900">
      {/* Back Button & Top Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/events")}
            className="mb-3 gap-2 border-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-xs h-8 px-3 text-xs font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Events
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Event Moderation & Details
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Viewing details for Event ID:{" "}
            <code className="bg-slate-200/80 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800 font-bold">
              {event.id}
            </code>
          </p>
        </div>

        {/* Action Moderation Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {event.status !== "Published" && (
            <Button
              onClick={() => handleStatusChange("Published")}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4 font-semibold text-xs"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve Event
            </Button>
          )}

          {event.status !== "Cancelled" && (
            <Button
              onClick={() => handleStatusChange("Cancelled")}
              variant="outline"
              className="gap-1.5 border-rose-200 text-rose-700 hover:bg-rose-50 h-9 px-4 font-semibold text-xs"
            >
              <XCircle className="h-4 w-4" />
              Reject / Cancel
            </Button>
          )}

          <Button
            onClick={handleDelete}
            variant="outline"
            className="gap-1.5 border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 h-9 px-3 text-xs font-semibold"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-emerald-400" />
          {actionNotice}
        </div>
      )}

      {/* Hero Banner Header */}
      <Card className="overflow-hidden border-slate-200/80 shadow-xs">
        <div className="relative h-64 sm:h-80 w-full bg-slate-900">
          <img
            src={event.banner}
            alt={event.title}
            className="h-full w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <Badge className="bg-indigo-600 text-white font-semibold border-none">
                <Tag className="h-3.5 w-3.5 mr-1" />
                {event.category}
              </Badge>
              <StatusBadge status={event.status} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {event.title}
            </h2>
            <p className="text-sm text-slate-300 mt-1.5 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-400" />
              Organized by <span className="font-semibold text-white">{event.organizer}</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Content Split: Left (Overview & Details) | Right (Metrics & Feedback) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <Card className="border-slate-200/80 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Event Overview & Description
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {event.description}
              </p>

              {/* Event Metadata Grid */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 pt-5 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Date & Schedule
                    </span>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      {event.date}
                    </p>
                    <p className="text-xs text-slate-500">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Location & Venue
                    </span>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      {event.location}
                    </p>
                    <p className="text-xs text-slate-500">{event.venue}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Gallery (if available) */}
          {event.gallery && event.gallery.length > 0 && (
            <Card className="border-slate-200/80 shadow-xs">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-bold text-slate-900">
                  Event Gallery
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  {event.gallery.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl h-36 bg-slate-100 border border-slate-200"
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery preview ${index + 1}`}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Registrations Table */}
          <Card className="border-slate-200/80 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Recent Attendees & Registrations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {event.recentRegistrations && event.recentRegistrations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                      <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 px-4 py-3">
                        Attendee Name
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 px-4 py-3">
                        Email
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 px-4 py-3">
                        Registered Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {event.recentRegistrations.map((reg, i) => (
                      <TableRow key={i} className="hover:bg-slate-50/50">
                        <TableCell className="font-semibold text-slate-900 px-4 py-3 text-sm">
                          {reg.name}
                        </TableCell>
                        <TableCell className="text-slate-600 px-4 py-3 text-sm">
                          {reg.email}
                        </TableCell>
                        <TableCell className="text-slate-500 px-4 py-3 text-sm">
                          {reg.date}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-6 text-center text-sm text-slate-500">
                  No registered attendees recorded for this event yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col wide) */}
        <div className="space-y-6">
          {/* Seat Capacity & Registration Metrics Card */}
          <Card className="border-slate-200/80 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Capacity & Seats
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm font-semibold mb-1.5">
                  <span className="text-slate-600">Registered</span>
                  <span className="text-slate-900">
                    {event.registered} / {event.capacity}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Remaining
                  </span>
                  <p className="text-xl font-extrabold text-slate-900 mt-1">
                    {remainingSeats}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Occupancy
                  </span>
                  <p className="text-xl font-extrabold text-slate-900 mt-1">
                    {fillPercentage}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback & Ratings Summary */}
          <Card className="border-slate-200/80 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                Feedback & Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 text-center">
              {event.feedbackSummary && event.feedbackSummary.rating > 0 ? (
                <div>
                  <div className="text-4xl font-black text-slate-900">
                    {event.feedbackSummary.rating}
                  </div>
                  <div className="flex justify-center gap-1 my-2 text-amber-400">
                    {"★".repeat(Math.round(event.feedbackSummary.rating))}
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    Based on {event.feedbackSummary.totalReviews} attendee reviews
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-500 py-3">
                  No ratings or reviews submitted for this event yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
