import { Link } from "react-router-dom";
import { Edit, Trash2, Users, ArrowUpDown } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, formatCurrency, calculatePercentage } from "../../utils/organizerHelpers";
import { Button } from "../ui/button";

export default function EventTable({ events = [], onDelete, sortBy, sortOrder, onSort }) {
  const handleSortClick = (field) => {
    if (!onSort) return;
    const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    onSort(field, newOrder);
  };

  return (
    <div className="organizer-table-wrapper">
      <div className="table-responsive">
        <table className="org-table">
          <thead>
            <tr>
              <th onClick={() => handleSortClick("title")} className="cursor-pointer hover:text-blue-600">
                <div className="flex items-center gap-1.5">
                  Event Title
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th>Category</th>
              <th onClick={() => handleSortClick("date")} className="cursor-pointer hover:text-blue-600">
                <div className="flex items-center gap-1.5">
                  Date
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th>Status</th>
              <th onClick={() => handleSortClick("ticketsSold")} className="cursor-pointer hover:text-blue-600">
                <div className="flex items-center gap-1.5">
                  Tickets Sold
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th onClick={() => handleSortClick("revenue")} className="cursor-pointer hover:text-blue-600 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  Revenue
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const pct = calculatePercentage(event.ticketsSold, event.capacity);
              return (
                <tr key={event.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {event.title}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1">
                          {event.isOnline ? "Online" : event.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {event.category}
                    </span>
                  </td>
                  <td className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {formatDate(event.startDate)}
                  </td>
                  <td>
                    <StatusBadge status={event.status} />
                  </td>
                  <td>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {event.ticketsSold} / {event.capacity}
                    </div>
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                  <td className="text-right font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                    {formatCurrency(event.revenue, event.currency)}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/organizer/events/${event.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/organizer/registrations?eventId=${event.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                          <Users className="w-4 h-4" />
                        </Button>
                      </Link>
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(event)}
                          className="h-8 w-8 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
