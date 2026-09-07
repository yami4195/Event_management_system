import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Send,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Users,
  Clock,
  Trash2,
} from "lucide-react";
import { notificationsService } from "@/services/notifications.service";
import { userService } from "@/services/user.service";
import { eventsService } from "@/services/events.service";
import StatCard from "@/components/admin/StatCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Notifications() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  // Form State
  const [targetUserId, setTargetUserId] = useState("");
  const [targetEventId, setTargetEventId] = useState("");
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("update");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes, notifsRes] = await Promise.all([
        userService.getAll().catch(() => ({ data: { data: { users: [] } } })),
        eventsService.getAll().catch(() => ({ data: { data: { events: [] } } })),
        notificationsService.getAll().catch(() => ({ data: { data: { notifications: [] } } })),
      ]);

      const uList = usersRes.data?.data?.users || usersRes.data?.users || [];
      const eList = eventsRes.data?.data?.events || eventsRes.data?.events || [];
      const nList = notifsRes.data?.data?.notifications || notifsRes.data?.notifications || [];

      setUsers(uList);
      setEvents(eList);
      setNotifications(nList);

      if (uList.length > 0 && !targetUserId) {
        setTargetUserId(uList[0].id || uList[0].user_id);
      }
      if (eList.length > 0 && !targetEventId) {
        setTargetEventId(eList[0].event_id || eList[0].id);
      }
    } catch (err) {
      console.error("Failed to load notifications data:", err);
      showToast("Failed to fetch notification records.");
    } finally {
      setLoading(false);
    }
  }, [targetUserId, targetEventId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showToast = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!targetUserId || !targetEventId || !message.trim()) {
      showToast("Please select a recipient, event, and provide a notification message.");
      return;
    }

    setIsSending(true);
    try {
      await notificationsService.create({
        user_id: targetUserId,
        event_id: targetEventId,
        message: message.trim(),
        type: notificationType,
      });

      showToast("Notification dispatched in real-time via Socket.IO!");
      setMessage("");
      loadData();
    } catch (err) {
      console.error("Send notification error:", err);
      showToast(err.response?.data?.message || "Failed to dispatch notification.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificationsService.delete(id);
      setNotifications((prev) => prev.filter((n) => n.notification_id !== id));
      showToast("Notification removed.");
    } catch (err) {
      console.error("Delete notification error:", err);
      showToast("Failed to delete notification.");
    }
  };

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-6 lg:p-8 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Notification Dispatcher & Center
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Send real-time alerts, schedule reminders, and broadcast cancellation notifications.
          </p>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-md">
          {actionNotice}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          title="Dispatched Alerts"
          value={notifications.length.toString()}
          icon={Bell}
          description="Total notifications sent"
          variant="blue"
        />
        <StatCard
          title="Platform Users"
          value={users.length.toString()}
          icon={Users}
          description="Available alert recipients"
          variant="indigo"
        />
        <StatCard
          title="Active Events"
          value={events.length.toString()}
          icon={Calendar}
          description="Linked event contexts"
          variant="emerald"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Left Form: Dispatch New Notification (1 Col) */}
        <Card className="border-slate-200/80 shadow-xs lg:col-span-1">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Send className="h-5 w-5 text-indigo-600" />
              Dispatch Notification
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSendNotification} className="space-y-4">
              {/* Recipient User */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Recipient User *
                </label>
                <Select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="h-10 border-slate-200 bg-white"
                  required
                >
                  <option value="" disabled>Select User</option>
                  {users.map((u) => (
                    <option key={u.id || u.user_id} value={u.id || u.user_id}>
                      {u.firstname} {u.lastname} ({u.role})
                    </option>
                  ))}
                </Select>
              </div>

              {/* Related Event */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Related Event *
                </label>
                <Select
                  value={targetEventId}
                  onChange={(e) => setTargetEventId(e.target.value)}
                  className="h-10 border-slate-200 bg-white"
                  required
                >
                  <option value="" disabled>Select Event</option>
                  {events.map((e) => (
                    <option key={e.event_id || e.id} value={e.event_id || e.id}>
                      {e.title}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Type Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Notification Type
                </label>
                <Select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="h-10 border-slate-200 bg-white"
                >
                  <option value="update">General Update</option>
                  <option value="reminder">Event Reminder</option>
                  <option value="cancellation">Cancellation Alert</option>
                </Select>
              </div>

              {/* Message Body */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Please arrive 15 minutes before the opening session at Millennium Hall."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isSending}
                className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 shadow-xs"
              >
                <Send className="h-4 w-4" />
                {isSending ? "Dispatching..." : "Send Real-Time Alert"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Section: Notification History (2 Cols) */}
        <Card className="border-slate-200/80 shadow-xs lg:col-span-2">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">
              Notification Activity Log ({notifications.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3" />
                <p className="text-sm font-medium text-slate-500">Loading notification history...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                  <Bell className="h-8 w-8 stroke-[1.75]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No notifications dispatched yet
                </h3>
                <p className="mt-1 text-sm text-slate-500 max-w-sm">
                  Use the form on the left to send live notifications to users.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.notification_id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            n.type === "cancellation"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : n.type === "reminder"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }
                        >
                          {n.type?.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {n.sent_at ? new Date(n.sent_at).toLocaleString() : "Recently"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 pt-1">
                        {n.message}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNotification(n.notification_id)}
                      className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-50 gap-1 font-semibold self-end sm:self-center"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}