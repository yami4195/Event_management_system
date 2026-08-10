import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { User, Mail, Phone, MapPin, CheckCircle2, Upload, ShieldCheck } from "lucide-react";
import "../../styles/components/customer-portal.css";

export default function CustomerSettings() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    city: "",
    subcity: "",
    houseNumber: "",
    emailAlerts: true,
    eventReminders: true,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: `${user.firstname || ""} ${user.lastname || ""}`.trim() || "Customer Attendee",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "Addis Ababa",
        subcity: user.subcity || "Bole",
        houseNumber: user.houseNumber || "1024",
        emailAlerts: true,
        eventReminders: true,
      });
      if (user.profile_picture || user.profilePicture) {
        setImagePreview(user.profile_picture || user.profilePicture);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    }, 800);
  };

  return (
    <div className="customer-page-container" style={{ maxWidth: "1000px" }}>
      {/* Header Banner */}
      <div className="customer-banner-card">
        <div className="customer-banner-text">
          <div className="customer-pill-badge">
            <span>Profile Settings</span>
          </div>
          <h1>Customer Profile & Preferences</h1>
          <p>Manage your account details, contact info, avatar photo, and alert settings.</p>
        </div>

        <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="btn-action-primary">
          <CheckCircle2 className="w-4 h-4" />
          <span>{isSubmitting ? "Saving..." : "Save Profile"}</span>
        </button>
      </div>

      {savedSuccess && (
        <div style={{ padding: "16px 24px", borderRadius: "18px", background: "#dcfce7", border: "1px solid #86efac", color: "#166534", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" }}>
          <CheckCircle2 className="w-5 h-5" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {/* Profile Card */}
        <div className="customer-section">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
            <User className="w-5 h-5" style={{ color: "#2563eb" }} />
            <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
              Personal Information
            </h2>
          </div>

          {/* Avatar Upload */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#2563eb",
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "900",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "3px solid #ffffff",
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.1)",
              }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                user?.firstname?.[0]?.toUpperCase() || "C"
              )}
            </div>

            <label className="btn-action-secondary" style={{ cursor: "pointer" }}>
              <Upload className="w-4 h-4" /> Change Profile Picture
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </label>
          </div>

          {/* Form Inputs Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 16px",
                  borderRadius: "14px",
                  border: "1.5px solid #cbd5e1",
                  background: "#f8fafc",
                  fontSize: "14px",
                  fontWeight: "600",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 16px",
                  borderRadius: "14px",
                  border: "1.5px solid #e2e8f0",
                  background: "#f1f5f9",
                  color: "#64748b",
                  fontSize: "14px",
                  fontWeight: "600",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+251 900 000 000"
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 16px",
                  borderRadius: "14px",
                  border: "1.5px solid #cbd5e1",
                  background: "#f8fafc",
                  fontSize: "14px",
                  fontWeight: "600",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 16px",
                  borderRadius: "14px",
                  border: "1.5px solid #cbd5e1",
                  background: "#f8fafc",
                  fontSize: "14px",
                  fontWeight: "600",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="customer-section">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
            <ShieldCheck className="w-5 h-5" style={{ color: "#2563eb" }} />
            <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
              Notification Preferences
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", fontWeight: "700", color: "#0f172a", cursor: "pointer" }}>
              <input
                type="checkbox"
                name="emailAlerts"
                checked={formData.emailAlerts}
                onChange={handleChange}
                style={{ width: "18px", height: "18px", accentColor: "#2563eb" }}
              />
              Receive event ticket confirmation emails
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", fontWeight: "700", color: "#0f172a", cursor: "pointer" }}>
              <input
                type="checkbox"
                name="eventReminders"
                checked={formData.eventReminders}
                onChange={handleChange}
                style={{ width: "18px", height: "18px", accentColor: "#2563eb" }}
              />
              Send event start reminders 24 hours prior
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
