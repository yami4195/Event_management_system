import { useState, useEffect } from "react";
import { useOrganizer } from "../../hooks/useOrganizer";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Building, CreditCard, Bell, CheckCircle } from "lucide-react";

export default function Settings() {
  const { loading, settings, updateSettings } = useOrganizer();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    logoUrl: "",
    payoutMethod: "Telebirr",
    accountNumber: "",
    emailNotifications: true,
    registrationAlerts: true,
    payoutAlerts: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || "",
        email: settings.email || "",
        phone: settings.phone || "",
        bio: settings.bio || "",
        logoUrl: settings.logoUrl || "",
        payoutMethod: settings.payoutMethod || "Telebirr",
        accountNumber: settings.accountNumber || "",
        emailNotifications: settings.emailNotifications ?? true,
        registrationAlerts: settings.registrationAlerts ?? true,
        payoutAlerts: settings.payoutAlerts ?? true,
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await updateSettings(formData);
    setIsSubmitting(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black dark:border-white" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Organizer Account Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your organizer profile brand, payout details, and alert preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black border border-zinc-700 flex items-center gap-2 font-semibold text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Organizer Profile & Branding
              </h2>
              <p className="text-xs text-slate-500">Public details shown on your event listings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Organizer / Company Name
              </label>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Contact Email
              </label>
              <Input name="email" value={formData.email} onChange={handleChange} type="email" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <Input name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Logo Image URL
              </label>
              <Input name="logoUrl" value={formData.logoUrl} onChange={handleChange} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Organizer Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
          </div>
        </div>

        {/* Payout Information */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Payout & Bank Details
              </h2>
              <p className="text-xs text-slate-500">Destination for ticket sales payouts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Payout Method
              </label>
              <select
                name="payoutMethod"
                value={formData.payoutMethod}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-black/20"
              >
                <option value="Telebirr">Telebirr Mobile Wallet</option>
                <option value="CBE Birr">CBE Birr</option>
                <option value="Commercial Bank of Ethiopia">Commercial Bank of Ethiopia (CBE)</option>
                <option value="Awash Bank">Awash Bank</option>
                <option value="Dashen Bank">Dashen Bank</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Account Number / Phone
              </label>
              <Input name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Notification Preferences
              </h2>
              <p className="text-xs text-slate-500">Configure email and dashboard alerts</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black dark:text-white dark:focus:ring-white"
              />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Email Notifications for Ticket Purchases
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="registrationAlerts"
                checked={formData.registrationAlerts}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black dark:text-white dark:focus:ring-white"
              />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Capacity Milestone Alerts (50%, 75%, 100%)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="payoutAlerts"
                checked={formData.payoutAlerts}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black dark:text-white dark:focus:ring-white"
              />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Payout & Deposit Confirmation Notices
              </span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-bold px-8 shadow-md"
          >
            {isSubmitting ? "Saving Changes..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
