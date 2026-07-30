import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Bell, User, PlusCircle, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import useAuth from "../../hooks/useAuth";

export default function OrganizerNavbar({
  onToggleSidebar,
  notifications = [],
  title = "Organizer Dashboard",
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    try {
      if (logout) await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="organizer-navbar">
      <div className="navbar-left">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="navbar-toggle-btn"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="navbar-title">{title}</h1>
      </div>

      <div className="navbar-right">
        {/* Quick Create Event CTA */}
        <Link to="/organizer/events/create" className="hidden sm:inline-flex">
          <Button size="sm" className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-bold gap-1.5 shadow-sm">
            <PlusCircle className="w-4 h-4" />
            Create Event
          </Button>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Organizer Notifications
                </span>
                <span className="text-xs font-semibold text-black dark:text-white">
                  {unreadCount} new
                </span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No recent notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs flex flex-col gap-1"
                    >
                      <div className="font-bold text-slate-900 dark:text-slate-100">{n.title}</div>
                      <div className="text-slate-600 dark:text-slate-400 leading-snug">{n.message}</div>
                      <span className="text-[10px] text-slate-400 font-semibold">{n.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <Link to="/organizer/settings" title="Profile Settings">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            <User className="w-5 h-5" />
          </div>
        </Link>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="h-10 text-xs font-bold text-zinc-900 hover:text-black dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 gap-1.5"
          title="Log out of your account"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
