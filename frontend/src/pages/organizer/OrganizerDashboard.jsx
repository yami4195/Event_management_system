import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Ticket,
  DollarSign,
  Users,
  PlusCircle,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useOrganizer } from "../../hooks/useOrganizer";
import DashboardCard from "../../components/organizer/DashboardCard";
import EventTable from "../../components/organizer/EventTable";
import RegistrationTable from "../../components/organizer/RegistrationTable";
import DeleteModal from "../../components/organizer/DeleteModal";
import EmptyState from "../../components/organizer/EmptyState";
import { formatCurrency } from "../../utils/organizerHelpers";
import { Button } from "../../components/ui/button";

export default function OrganizerDashboard() {
  const {
    loading,
    summary,
    events,
    registrations,
    notifications,
    deleteEvent,
    toggleCheckIn,
  } = useOrganizer();

  const [selectedDeleteEvent, setSelectedDeleteEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteEvent) return;
    setIsDeleting(true);
    await deleteEvent(selectedDeleteEvent.id);
    setIsDeleting(false);
    setSelectedDeleteEvent(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black dark:border-white" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="organizer-welcome-banner">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Organizer Control Center
          </div>
          <h1 className="welcome-title">Welcome back, TechHub Addis!</h1>
          <p className="welcome-subtitle">
            Manage your live event registrations, monitor ticket sales revenue, and launch new experiences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/organizer/events/create">
            <Button size="lg" className="bg-white hover:bg-zinc-100 text-black font-bold shadow-lg">
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Event
            </Button>
          </Link>
          <Link to="/organizer/analytics">
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold">
              <BarChart3 className="w-5 h-5 mr-2" />
              Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="dashboard-cards-grid">
        <DashboardCard
          title="Total Events"
          value={summary?.totalEvents || events.length}
          trend="+2 this month"
          isPositive={true}
          icon={Calendar}
        />
        <DashboardCard
          title="Upcoming Events"
          value={summary?.upcomingEvents || 3}
          trend="Active"
          isPositive={true}
          icon={Calendar}
        />
        <DashboardCard
          title="Tickets Sold"
          value={summary?.ticketsSold || 1895}
          trend="+18.4%"
          isPositive={true}
          icon={Ticket}
        />
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(summary?.totalRevenue || 1445150)}
          trend="+24.1%"
          isPositive={true}
          icon={DollarSign}
        />
      </div>

      {/* Recent Events Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Recent Events
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Quick view of your active and upcoming event listings.
            </p>
          </div>
          <Link to="/organizer/events" className="text-sm font-bold text-black dark:text-white hover:underline flex items-center gap-1">
            View All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {events.length === 0 ? (
          <EmptyState
            title="No events created yet"
            description="Start publishing events to reach thousands of attendees."
            actionLabel="Create First Event"
            onAction={() => (window.location.href = "/organizer/events/create")}
          />
        ) : (
          <EventTable
            events={events.slice(0, 5)}
            onDelete={(evt) => setSelectedDeleteEvent(evt)}
          />
        )}
      </div>

      {/* Grid Split: Recent Registrations & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Recent Registrations (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Recent Registrations
            </h2>
            <Link to="/organizer/registrations" className="text-sm font-bold text-black dark:text-white hover:underline flex items-center gap-1">
              Manage All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <RegistrationTable
            registrations={registrations.slice(0, 4)}
            onToggleCheckIn={toggleCheckIn}
          />
        </div>

        {/* Activity Feed (1 col) */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Activity Feed
          </h2>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {n.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(selectedDeleteEvent)}
        onClose={() => setSelectedDeleteEvent(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Event"
        description={`Are you sure you want to delete "${selectedDeleteEvent?.title}"? All registration data will be permanently removed.`}
      />
    </div>
  );
}
