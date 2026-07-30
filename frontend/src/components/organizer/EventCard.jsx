import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, Edit, Users, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, formatCurrency, calculatePercentage } from "../../utils/organizerHelpers";
import { Button } from "../ui/button";

export default function EventCard({ event, onDelete }) {
  const percentage = calculatePercentage(event.ticketsSold, event.capacity);

  return (
    <div className="event-card-item">
      <div className="event-card-media">
        <img src={event.image} alt={event.title} loading="lazy" />
        <div className="absolute top-3 left-3 z-10">
          <StatusBadge status={event.status} />
        </div>
        <div className="absolute top-3 right-3 z-10 bg-slate-900/75 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white">
          {event.price > 0 ? formatCurrency(event.price, event.currency) : "Free"}
        </div>
      </div>

      <div className="event-card-body">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 block">
            {event.category}
          </span>
          <h3 className="event-card-title line-clamp-1">{event.title}</h3>

          <div className="event-card-meta">
            <div className="meta-row">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-1">{formatDate(event.startDate)}</span>
            </div>
            <div className="meta-row">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-1">{event.isOnline ? "Online Event" : event.location}</span>
            </div>
          </div>
        </div>

        {/* Ticket Progress */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5" /> Tickets Sold
            </span>
            <span className="text-slate-900 dark:text-slate-100">
              {event.ticketsSold} / {event.capacity} ({percentage}%)
            </span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
          </div>

          <div className="flex items-center justify-between gap-2 mt-4 pt-2">
            <Link to={`/organizer/events/${event.id}/edit`}>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-semibold">
                <Edit className="w-3.5 h-3.5" /> Edit
              </Button>
            </Link>

            <div className="flex items-center gap-1">
              <Link to={`/organizer/registrations?eventId=${event.id}`}>
                <Button variant="secondary" size="sm" className="h-8 text-xs gap-1 font-semibold">
                  <Users className="w-3.5 h-3.5" /> Attendees
                </Button>
              </Link>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(event)}
                  className="h-8 w-8 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
