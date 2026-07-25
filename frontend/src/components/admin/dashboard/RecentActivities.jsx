import {
  UserPlus,
  CalendarPlus,
  CheckCircle2,
  Ticket,
  CreditCard,
  UserX,
  MessageSquare,
  Activity,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

export default function RecentActivities() {
  const activities = [
    {
      id: "act_1",
      user: "Sarah Chen",
      action: "created new event",
      target: "UI/UX Design Masterclass",
      time: "2 min ago",
      type: "event_created",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "act_2",
      user: "Michael Brown",
      action: "registered a new account",
      target: "",
      time: "18 min ago",
      type: "user_registered",
      avatar: null,
    },
    {
      id: "act_3",
      user: "Payment System",
      action: "processed payment",
      target: "Invoice #4521 — $245.00",
      time: "45 min ago",
      type: "payment_completed",
      avatar: null,
    },
    {
      id: "act_4",
      user: "Alex Morgan",
      action: "approved event",
      target: "Global Tech Summit 2026",
      time: "1 hour ago",
      type: "event_approved",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "act_5",
      user: "Emily Davis",
      action: "submitted feedback for",
      target: "Summer Music Fest 2026",
      time: "3 hours ago",
      type: "feedback_submitted",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "act_6",
      user: "Robert Wilson",
      action: "account status changed to",
      target: "Suspended",
      time: "5 hours ago",
      type: "organizer_suspended",
      avatar: null,
    },
    {
      id: "act_7",
      user: "Amanda White",
      action: "purchased 2 tickets for",
      target: "FinTech Innovation Forum",
      time: "6 hours ago",
      type: "ticket_purchased",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "user_registered":
        return <UserPlus className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />;
      case "event_created":
        return <CalendarPlus className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />;
      case "event_approved":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />;
      case "ticket_purchased":
        return <Ticket className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />;
      case "payment_completed":
        return <CreditCard className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />;
      case "organizer_suspended":
        return <UserX className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />;
      case "feedback_submitted":
        return <MessageSquare className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Activity className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />;
    }
  };

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Recent Activity
          </span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            Live
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 px-4 pb-2">
        <div className="max-h-[380px] overflow-y-auto space-y-3.5 pr-1">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
            >
              {/* User Avatar */}
              <div className="relative shrink-0">
                <Avatar src={item.avatar} name={item.user} size="sm" className="h-9 w-9" />
                <div className="absolute -bottom-1 -right-1 p-0.5 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
                  {getActivityIcon(item.type)}
                </div>
              </div>

              {/* Activity Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.user}</span>{" "}
                  <span className="text-slate-600 dark:text-slate-400 font-normal">{item.action}</span>{" "}
                  {item.target && (
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate block sm:inline">
                      {item.target}
                    </span>
                  )}
                </p>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block mt-0.5">
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
