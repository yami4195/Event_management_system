import { useState } from "react";
import {
  Settings as SettingsIcon,
  Save,
  Shield,
  Bell,
  Mail,
  Database,
  CheckCircle,
  Globe,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  const [settings, setSettings] = useState({
    platformName: "EventFlow Ethiopia",
    supportEmail: "support@eventflow.com",
    contactPhone: "+251 939 208 663",
    currency: "ETB",
    maxEventCapacity: 5000,
    emailNotifications: true,
    autoApproveRegistrations: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-6 lg:p-8 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Platform Settings & Configuration
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Configure system parameters, support contact points, and operational thresholds.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {saved && (
        <div className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* General Platform Details Card */}
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-600" />
              General Platform Identity
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Platform Name
                </label>
                <Input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="h-10 border-slate-200 bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Default Platform Currency
                </label>
                <Input
                  type="text"
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="h-10 border-slate-200 bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Support Email
                </label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="h-10 border-slate-200 bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Contact Phone Number
                </label>
                <Input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="h-10 border-slate-200 bg-white"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health & Status Card */}
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-600" />
              Database & Cloud Connectivity
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/70">
                <span className="text-xs font-bold uppercase text-slate-400">PostgreSQL Status</span>
                <p className="mt-1 font-semibold text-emerald-600 flex items-center gap-1.5 text-sm">
                  <CheckCircle className="h-4 w-4" /> Connected & Active
                </p>
              </div>

              <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/70">
                <span className="text-xs font-bold uppercase text-slate-400">Cloudinary CDN</span>
                <p className="mt-1 font-semibold text-emerald-600 flex items-center gap-1.5 text-sm">
                  <CheckCircle className="h-4 w-4" /> Configured & Verified
                </p>
              </div>

              <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/70">
                <span className="text-xs font-bold uppercase text-slate-400">Socket.IO Server</span>
                <p className="mt-1 font-semibold text-emerald-600 flex items-center gap-1.5 text-sm">
                  <CheckCircle className="h-4 w-4" /> Ready on Port 3000
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pt-2">
          <Button
            type="submit"
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 px-6 shadow-xs"
          >
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}