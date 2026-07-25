import { Trophy, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function TopEventsLeaderboard() {
  const navigate = useNavigate();

  const topEvents = [
    {
      id: "evt_1",
      rank: 1,
      title: "Global Tech Summit 2026",
      organizer: "Sarah Chen",
      ticketsSold: 412,
      capacity: 500,
      revenue: "$20,600",
      banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "evt_3",
      rank: 2,
      title: "Summer Music Fest 2026",
      organizer: "Robert Wilson",
      ticketsSold: 890,
      capacity: 1200,
      revenue: "$17,800",
      banner: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "evt_8",
      rank: 3,
      title: "Mobile App Development Workshop",
      organizer: "Sarah Chen",
      ticketsSold: 610,
      capacity: 800,
      revenue: "$12,200",
      banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "evt_2",
      rank: 4,
      title: "UI/UX Design Masterclass",
      organizer: "Emily Davis",
      ticketsSold: 142,
      capacity: 150,
      revenue: "$9,940",
      banner: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "evt_6",
      rank: 5,
      title: "Cloud Native & DevOps Summit",
      organizer: "Alex Morgan",
      ticketsSold: 350,
      capacity: 350,
      revenue: "$8,750",
      banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <Card className="border-slate-200/80 shadow-xs bg-white">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Top Performing Events
          </span>
          <span className="text-xs font-semibold text-slate-500">
            By Revenue & Tickets
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 px-4 pb-2 space-y-3">
        {topEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => navigate(`/admin/events/${evt.id}`)}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 cursor-pointer group"
          >
            {/* Rank Badge */}
            <div
              className={`h-7 w-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                evt.rank === 1
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : evt.rank === 2
                  ? "bg-slate-200 text-slate-800 border border-slate-300"
                  : evt.rank === 3
                  ? "bg-amber-700/10 text-amber-900 border border-amber-700/20"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              #{evt.rank}
            </div>

            {/* Banner Thumbnail */}
            <div className="h-10 w-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
              <img
                src={evt.banner}
                alt={evt.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Event Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                {evt.title}
              </h4>
              <p className="text-[11px] font-medium text-slate-500 truncate">
                {evt.organizer} • {evt.ticketsSold} tickets sold
              </p>
            </div>

            {/* Revenue */}
            <div className="text-right shrink-0">
              <span className="text-xs font-black text-slate-900 block">
                {evt.revenue}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center justify-end">
                <ArrowUpRight className="h-3 w-3" />
                {Math.round((evt.ticketsSold / evt.capacity) * 100)}% cap
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
