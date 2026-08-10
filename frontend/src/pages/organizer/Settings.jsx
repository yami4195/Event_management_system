import { useState, useEffect } from "react";
import { useOrganizer } from "../../hooks/useOrganizer";
import { Building, CreditCard, Bell, CheckCircle, Save } from "lucide-react";
import "../../styles/components/settings.css";

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

  const [avatarFile, setAvatarFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || "",
        firstname: settings.firstname || "",
        lastname: settings.lastname || "",
        email: settings.email || "",
        phone: settings.phone || "",
        city: settings.city || "",
        subcity: settings.subcity || "",
        houseNumber: settings.houseNumber || "",
        bio: settings.bio || "",
        logoUrl: settings.logoUrl || settings.profilePicture || "",
        payoutMethod: settings.payoutMethod || "Telebirr",
        accountNumber: settings.accountNumber || "",
        emailNotifications: settings.emailNotifications ?? true,
        registrationAlerts: settings.registrationAlerts ?? true,
        payoutAlerts: settings.payoutAlerts ?? true,
      });
      setImagePreview(settings.logoUrl || settings.profilePicture || "");
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

    const nameParts = (formData.name || "").trim().split(" ");
    const firstname = formData.firstname || nameParts[0] || "Organizer";
    const lastname = formData.lastname || nameParts.slice(1).join(" ") || "";

    const payload = {
      firstname,
      lastname,
      name: (formData.name || "").trim(),
      phone: (formData.phone || "").trim(),
      city: (formData.city || "").trim(),
      subcity: (formData.subcity || "").trim(),
      house_number: (formData.houseNumber || "").trim(),
      bio: (formData.bio || "").trim(),
      payout_method: formData.payoutMethod,
      account_number: formData.accountNumber,
      emailNotifications: formData.emailNotifications,
      registrationAlerts: formData.registrationAlerts,
      payoutAlerts: formData.payoutAlerts,
    };

    if (avatarFile) {
      payload.image = avatarFile;
    } else if (imagePreview) {
      payload.image = imagePreview;
      payload.profile_picture = imagePreview;
    }

    await updateSettings(payload);
    setIsSubmitting(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  if (loading) {
    return (
      <div className="settings-wrapper" style={{ alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3" />
        <p style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>Loading Account Settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-wrapper">
      {/* Header Banner Card */}
      <div className="settings-header-card">
        <div className="settings-title-area">
          <h1>Organizer Account Settings</h1>
          <p>Manage your organization branding, profile info, bank payout details, and alert preferences.</p>
        </div>

        <button
          type="submit"
          form="settings-form"
          disabled={isSubmitting}
          className="btn-save-settings"
        >
          <Save className="w-5 h-5" />
          <span>{isSubmitting ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="settings-toast-success">
          <CheckCircle className="w-5 h-5" />
          <span>Settings updated successfully! Your organizer profile details are updated.</span>
        </div>
      )}

      <form id="settings-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {/* Profile Card */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <div className="settings-icon-badge">
              <Building className="w-6 h-6" />
            </div>
            <div className="settings-section-title-group">
              <h2>Organizer Profile & Branding</h2>
              <p>Public details shown on your event listings</p>
            </div>
          </div>

          <div className="settings-grid-2col">
            <div className="settings-field-group">
              <label className="settings-label">Organizer / Company Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="settings-input-control"
                placeholder="e.g. Acme Events Ethiopia"
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-label">Contact Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="settings-input-control"
                placeholder="organizer@domain.com"
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="settings-input-control"
                placeholder="+251 91 234 5678"
              />
            </div>

            <div className="settings-field-group settings-full-width">
              <label className="settings-label">Organizer Profile Logo</label>
              <div className="avatar-upload-row">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile Avatar" className="avatar-preview-img" />
                ) : (
                  <div className="avatar-preview-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#e2e8f0" }}>
                    <Building className="w-8 h-8" style={{ color: "#64748b" }} />
                  </div>
                )}
                <div className="avatar-upload-info">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatarFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="avatar-file-input"
                  />
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Upload PNG, JPG, or WEBP (Max 5MB)</span>
                </div>
              </div>
            </div>

            <div className="settings-field-group settings-full-width">
              <label className="settings-label">Organizer Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="settings-textarea-control"
                placeholder="Tell attendees about your events, vision, and upcoming gatherings..."
              />
            </div>
          </div>
        </div>

        {/* Payout Information */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <div className="settings-icon-badge" style={{ background: "#f0fdf4", borderColor: "#bbf7d0", color: "#16a34a" }}>
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="settings-section-title-group">
              <h2>Payout & Bank Details</h2>
              <p>Destination account for ticket sales payouts</p>
            </div>
          </div>

          <div className="settings-grid-2col">
            <div className="settings-field-group">
              <label className="settings-label">Payout Method</label>
              <select
                name="payoutMethod"
                value={formData.payoutMethod}
                onChange={handleChange}
                className="settings-select-control"
              >
                <option value="Telebirr">Telebirr Mobile Wallet</option>
                <option value="CBE Birr">CBE Birr</option>
                <option value="Commercial Bank of Ethiopia">Commercial Bank of Ethiopia (CBE)</option>
                <option value="Awash Bank">Awash Bank</option>
                <option value="Dashen Bank">Dashen Bank</option>
              </select>
            </div>

            <div className="settings-field-group">
              <label className="settings-label">Account Number / Phone</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="settings-input-control"
                placeholder="e.g. 1000123456789 or 0912345678"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <div className="settings-icon-badge" style={{ background: "#faf5ff", borderColor: "#e9d5ff", color: "#9333ea" }}>
              <Bell className="w-6 h-6" />
            </div>
            <div className="settings-section-title-group">
              <h2>Notification Preferences</h2>
              <p>Configure email and dashboard alerts</p>
            </div>
          </div>

          <div className="checkbox-list-group">
            <label className="checkbox-option-row">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                className="custom-checkbox-input"
              />
              <span className="checkbox-label-text">
                Email Notifications for Ticket Purchases
              </span>
            </label>

            <label className="checkbox-option-row">
              <input
                type="checkbox"
                name="registrationAlerts"
                checked={formData.registrationAlerts}
                onChange={handleChange}
                className="custom-checkbox-input"
              />
              <span className="checkbox-label-text">
                Capacity Milestone Alerts (50%, 75%, 100%)
              </span>
            </label>

            <label className="checkbox-option-row">
              <input
                type="checkbox"
                name="payoutAlerts"
                checked={formData.payoutAlerts}
                onChange={handleChange}
                className="custom-checkbox-input"
              />
              <span className="checkbox-label-text">
                Payout & Deposit Confirmation Notices
              </span>
            </label>
          </div>
        </div>

        {/* Bottom Save Action Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-save-settings"
          >
            <Save className="w-5 h-5" />
            <span>{isSubmitting ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
