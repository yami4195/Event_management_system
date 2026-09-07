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
  Trash2,
  Building2,
  Tag,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { eventsService } from "@/services/events.service";
import { registrationsService } from "@/services/registrations.service";
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
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);

  useEffect(() => {
    async function fetchEventDetails() {
      setLoading(true);
      try {
        const [eventRes, regsRes] = await Promise.all([
          eventsService.getById(eventId),
          registrationsService.getByEventId(eventId).catch(() => ({ data: { data: { registrations: [] } } })),
        ]);

        const e = eventRes.data?.data?.event || eventRes.data?.event;
        const regs = regsRes.data?.data?.registrations || regsRes.data?.registrations || [];

        if (e) {
          const status = e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1).toLowerCase() : "Upcoming";
          setEvent({
            id: e.event_id || e.id,
            title: e.title || "Untitled Event",
            organizer: e.organizer_name || "Organizer",
            category: e.category_name || "General",
            location: e.location || "Venue TBD",
            date: e.date ? new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD",
            time: e.time || "10:00 AM",
            capacity: Number(e.capacity) || 0,
            price: Number(e.price) || 0,
            status: status,
            banner: e.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
            description: e.description || "",
            createdAt: e.created_at,
          });
          setAttendees(regs);
        }
      } catch (err) {
        console.error("Failed to load event details:", err);
        showToast("Failed to fetch event details from server.");
      } finally {
        setLoading(false);
      }
    }

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const showToast = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await eventsService.update(eventId, { status: newStatus.toLowerCase() });
      setEvent((prev) => ({ ...prev, status: newStatus }));
      showToast(`Event status updated to ${newStatus}.`);
    } catch (err) {
      console.error("Status update error:", err);
      showToast("Failed to update status.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event? This will also remove attendee registrations.")) {
      return;
    }
    try {
      await eventsService.delete(eventId);
      navigate("/admin/events");
    } catch (err) {
      console.error("Delete event error:", err);
      showToast("Failed to delete event.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading event details...</p>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6 lg:p-8 text-slate-900">
      {/* Top Actions & Header */}
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
            Event ID: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs font-mono">{event.id}</code>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {event.status !== "Upcoming" && (
            <Button
              onClick={() => handleStatusChange("Upcoming")}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-9 px-3 text-xs"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve / Publish
            </Button>
          )}

          {event.status !== "Cancelled" && (
            <Button
              onClick={() => handleStatusChange("Cancelled")}
              variant="outline"
              className="gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 h-9 px-3 text-xs font-semibold"
            >
              <XCircle className="h-4 w-4" />
              Cancel Event
            </Button>
          )}

          <Button
            onClick={handleDelete}
            variant="outline"
            className="gap-1.5 border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 h-9 px-3 text-xs"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md">
          {actionNotice}
        </div>
      )}

      {/* Main Event Overview Card */}
      <Card className="border-slate-200/80 shadow-xs overflow-hidden">
        <div className="relative h-64 w-full bg-slate-900">
          <img
            src={event.banner}
            alt={event.title}
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="text-white">
              <Badge className="bg-indigo-600/90 text-white hover:bg-indigo-600 mb-2 border-none">
                {event.category}
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {event.title}
              </h2>
            </div>
            <StatusBadge status={event.status} />
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Key Metric Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <Building2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Organizer
                </span>
                <p className="text-sm font-semibold text-slate-800">{event.organizer}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <Calendar className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Date & Time
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  {event.date} • {event.time}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <MapPin className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Location
                </span>
                <p className="text-sm font-semibold text-slate-800">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <Users className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Registrations
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  {attendees.length} / {event.capacity} seats filled
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">Event Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
              {event.description || "No specific overview provided for this event."}
            </p>
          </div>

          {/* Registered Attendees Table */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>Registered Attendees ({attendees.length})</span>
            </h3>

            {attendees.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg text-sm">
                No attendees have registered for this event yet.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-200">
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Attendee Name</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Email</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Registration Date</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendees.map((reg, index) => (
                      <TableRow key={reg.user_id || index} className="border-b border-slate-100">
                        <TableCell className="px-4 py-3 font-semibold text-slate-900">
                          {reg.user_name || "Attendee"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-slate-600">{reg.user_email}</TableCell>
                        <TableCell className="px-4 py-3 text-slate-500 text-sm">
                          {reg.registration_date ? new Date(reg.registration_date).toLocaleDateString() : "Recent"}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge className={reg.status === "cancelled" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}>
                            {reg.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
