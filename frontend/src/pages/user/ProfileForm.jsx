import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { profileService } from "../../services/profile.service";
import { ROUTES } from "../../constants/routes";

const emptyForm = {
  firstname: "",
  lastname: "",
  phone: "",
  city: "",
  subcity: "",
  house_number: "",
  profile_picture: "",
};

const ProfileForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    ...emptyForm,
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    phone: user?.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isEdit = location.pathname.includes("/edit");

  useEffect(() => {
    if (!user?.id) return;

    const loadProfile = async () => {
      try {
        const response = await profileService.getProfileByUserId(user.id);
        const profile = response?.data?.data?.profile;
        if (profile) {
          setFormData({
            firstname: profile.firstname || user?.firstname || "",
            lastname: profile.lastname || user?.lastname || "",
            phone: profile.phone || user?.phone || "",
            city: profile.city || "",
            subcity: profile.subcity || "",
            house_number: profile.house_number || "",
            profile_picture: profile.profile_picture || "",
          });
        }
      } catch (err) {
        if (err?.response?.status !== 404) {
          setError("Unable to load your current profile right now.");
        }
      }
    };

    if (isEdit) {
      loadProfile();
    }
  }, [isEdit, user?.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isEdit) {
        await profileService.updateProfile(user.id, formData);
        setSuccess("Profile updated successfully.");
      } else {
        await profileService.createProfile(formData);
        setSuccess("Profile created successfully.");
      }
      navigate(ROUTES.PROFILE);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{isEdit ? "Edit Profile" : "Create Profile"}</h1>
        <p className="dashboard-subtitle">
          {isEdit ? "Update your personal details." : "Complete your profile to get started."}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: "640px", display: "grid", gap: "1rem" }}>
        {error ? <div style={{ color: "#b91c1c" }}>{error}</div> : null}
        {success ? <div style={{ color: "#166534" }}>{success}</div> : null}

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <label>
            <div style={{ marginBottom: "0.35rem" }}>First name</div>
            <input name="firstname" value={formData.firstname} onChange={handleChange} required style={inputStyle} />
          </label>
          <label>
            <div style={{ marginBottom: "0.35rem" }}>Last name</div>
            <input name="lastname" value={formData.lastname} onChange={handleChange} required style={inputStyle} />
          </label>
          <label>
            <div style={{ marginBottom: "0.35rem" }}>Phone</div>
            <input name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
          </label>
          <label>
            <div style={{ marginBottom: "0.35rem" }}>City</div>
            <input name="city" value={formData.city} onChange={handleChange} style={inputStyle} />
          </label>
          <label>
            <div style={{ marginBottom: "0.35rem" }}>Subcity</div>
            <input name="subcity" value={formData.subcity} onChange={handleChange} style={inputStyle} />
          </label>
          <label>
            <div style={{ marginBottom: "0.35rem" }}>House number</div>
            <input name="house_number" value={formData.house_number} onChange={handleChange} style={inputStyle} />
          </label>
          <label>
            <div style={{ marginBottom: "0.35rem" }}>Profile picture URL</div>
            <input name="profile_picture" value={formData.profile_picture} onChange={handleChange} style={inputStyle} />
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Saving..." : isEdit ? "Save changes" : "Save profile"}
          </button>
          <button type="button" onClick={() => navigate(ROUTES.PROFILE)} style={secondaryButtonStyle}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  background: "#fff",
};

const buttonStyle = {
  backgroundColor: "#2d1b69",
  color: "#c8ff3d",
  border: "none",
  borderRadius: "6px",
  padding: "0.75rem 1rem",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle = {
  backgroundColor: "#f3f4f6",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  padding: "0.75rem 1rem",
  cursor: "pointer",
};

export default ProfileForm;
