import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Heart, ArrowRight, User, Ticket, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { formatDate } from "../../utils/helpers";

export default function EventCard({ event }) {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!event) return null;

  const eventId = event.event_id || event.id;
  const displayImage = event.image || event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80";
  const isFree = event.price === 0 || event.price === "Free" || !event.price;
  
  const totalSeats = event.capacity || 200;
  const attendeesCount = event.attendees || 0;
  const remainingSeats = event.seatsLeft !== undefined ? event.seatsLeft : Math.max(totalSeats - attendeesCount, 0);
  
  const isSoldOut = remainingSeats <= 0 || event.status === "Sold Out";
  const isAlmostFull = !isSoldOut && (remainingSeats <= 15 || event.status === "Almost Full");
  const bookedPercentage = Math.round(((totalSeats - remainingSeats) / totalSeats) * 100);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const detailUrl = ROUTES.EVENT_DETAIL ? ROUTES.EVENT_DETAIL.replace(":id", eventId) : `/events/${eventId}`;

  return (
    <div className="group flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
      
      {/* CARD MEDIA HEADER */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
        <img
          src={displayImage}
          alt={event.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Category Tag */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800 shadow">
          {event.category || event.category_name || "Event"}
        </span>

        {/* Status Badge */}
        <div className="absolute bottom-4 left-4">
          {isSoldOut ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white shadow">
              <XCircle className="h-3.5 w-3.5" /> Sold Out
            </span>
          ) : isAlmostFull ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white shadow">
              <AlertTriangle className="h-3.5 w-3.5" /> Almost Full
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow">
              <CheckCircle2 className="h-3.5 w-3.5" /> Open
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          aria-label="Save to favorites"
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-700 dark:text-slate-200 hover:text-rose-500 transition-colors shadow"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-4 right-4 px-3.5 py-1 rounded-xl bg-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-md">
          {isFree ? "Free" : typeof event.price === "number" ? `$${event.price}` : event.price}
        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
        <div className="space-y-3">
          
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
            {event.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {event.description || "Join us for an exciting experience filled with learning, networking, and inspiration."}
          </p>

          <div className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span>{formatDate ? formatDate(event.date) : event.date} {event.time ? `· ${event.time}` : ""}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">{event.location || "Online / Location TBA"}</span>
            </div>

            {(event.organizer || event.organizer_name) && (
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">By <strong>{event.organizer || event.organizer_name}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* SEATS CAPACITY & ACTION BUTTONS */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
          
          {/* Seats progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Ticket className="h-3 w-3" /> Seats Capacity
              </span>
              <span className={isSoldOut ? "text-rose-600 font-bold" : isAlmostFull ? "text-amber-600 font-bold" : "text-slate-700 dark:text-slate-300 font-medium"}>
                {isSoldOut ? "0 Left" : `${remainingSeats} left`} ({totalSeats} total)
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isSoldOut ? "bg-rose-500" : isAlmostFull ? "bg-amber-500" : "bg-indigo-600"
                }`}
                style={{ width: `${bookedPercentage}%` }}
              />
            </div>
          </div>

          {/* DYNAMIC BUTTON STATES */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={detailUrl}
              className="inline-flex items-center justify-center gap-1.5 px-3 h-10 rounded-xl border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              View Details
            </Link>

            {isSoldOut ? (
              <button
                disabled
                className="inline-flex items-center justify-center px-3 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold text-xs cursor-not-allowed"
              >
                Event Full
              </button>
            ) : (
              <Link
                to={detailUrl}
                className="inline-flex items-center justify-center gap-1 px-3 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all duration-200"
              >
                <span>Register Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
