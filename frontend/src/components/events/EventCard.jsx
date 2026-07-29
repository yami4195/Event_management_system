import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Banknote, ArrowRight } from "lucide-react";
import { ROUTES } from "../../constants/routes";

function formatCardDate(dateInput) {
  if (!dateInput) return "TUESDAY, 12 OCT 2024";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput).toUpperCase();
    return d
      .toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  } catch (e) {
    console.log("error happened: " + e);
    return String(dateInput).toUpperCase();
  }
}

function formatCardPrice(price) {
  if (price === 0 || price === "0" || price === "Free" || price === "free" || !price) {
    return "Free";
  }
  if (typeof price === "number") {
    return `$${price.toFixed(2)}`;
  }
  if (typeof price === "string" && !price.startsWith("$") && !isNaN(Number(price))) {
    return `$${Number(price).toFixed(2)}`;
  }
  return String(price);
}

export default function EventCard({ event }) {
  if (!event) return null;

  const eventId = event.event_id || event.id;
  const displayImage =
    event.image ||
    event.imageUrl ||
    event.image_url ||
    event.cover_image ||
    event.media_url ||
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80";

  const totalSeats = event.capacity || 200;
  const attendeesCount = event.attendees || 0;
  const remainingSeats =
    event.seatsLeft !== undefined
      ? event.seatsLeft
      : Math.max(totalSeats - attendeesCount, 0);

  const isSoldOut = remainingSeats <= 0 || event.status === "Sold Out";
  const detailUrl = ROUTES?.EVENT_DETAIL
    ? ROUTES.EVENT_DETAIL.replace(":id", eventId)
    : `/events/${eventId}`;

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-4 h-full">
      
      {/* 1. Full Horizontal Image Container (No Cutoff / Fits Entire Photo) */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center shrink-0">
        {/* Subtle blurred background image fill */}
        <img
          src={displayImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110"
          aria-hidden="true"
        />

        {/* Main image set to object-contain so NO part of the photo gets cut off */}
        <img
          src={displayImage}
          alt={event.title || "Event Image"}
          className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {(event.category || event.category_name) && (
          <span className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm">
            {event.category || event.category_name}
          </span>
        )}
      </div>

      {/* 2. Title Section */}
      <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 flex flex-col justify-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Title</span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
          {event.title || "Global Tech Forum 2024"}
        </h3>
      </div>

      {/* 3. Details Grid (Date, Location, Remaining Seats, Price) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Date Box */}
        <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-medium text-slate-400 block">Date</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
              {formatCardDate(event.date)}
            </span>
          </div>
        </div>

        {/* Location Box */}
        <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-medium text-slate-400 block">Location</span>
            <span className="text-xs font-bold uppercase text-slate-900 dark:text-white truncate block">
              {event.location || "PALO ALTO CONVENTION CENTER"}
            </span>
          </div>
        </div>

        {/* Remaining Seats Box */}
        <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-medium text-slate-400 block">Remaining Seat</span>
            <span
              className={`text-xs font-extrabold uppercase truncate block ${
                isSoldOut
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {isSoldOut ? "0 SEATS LEFT" : `${remainingSeats} SEATS LEFT`}
            </span>
          </div>
        </div>

        

        {/* Price Box */}
        <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Banknote className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-medium text-slate-400 block">Price</span>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate block">
              {formatCardPrice(event.price)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Action Button */}
      <Link
        to={detailUrl}
        className={`w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mt-1 ${
          isSoldOut
            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed pointer-events-none"
            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-blue-600/20"
        }`}
      >
        <span>{isSoldOut ? "Sold Out" : "Book Now"}</span>
        {!isSoldOut && <ArrowRight className="w-4 h-4" />}
      </Link>
    </div>
  );
}