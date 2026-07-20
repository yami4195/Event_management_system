import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { profileService } from "../../services/profile.service";
import { ROUTES } from "../../constants/routes";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const loadProfile = async () => {
      try {
        const response = await profileService.getProfileByUserId(user.id);
        setProfile(response?.data?.data?.profile || null);
      } catch (error) {
        if (error?.response?.status === 404) {
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Profile</h1>
        <p className="dashboard-subtitle">Your account information.</p>
      </div>

      {loading ? (
        <p>Loading profile...</p>
      ) : !profile ? (
        <div className="stat-card" style={{ maxWidth: "480px" }}>
          <div className="stat-card__content">
            <span className="stat-card__label">Create your profile</span>
            <p style={{ color: "#fff", marginTop: "0.5rem" }}>
              You have not created your profile yet. Complete it to add your contact details.
            </p>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => navigate(ROUTES.CREATE_PROFILE)}
            >
              Create
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="stat-card" style={{ maxWidth: "480px" }}>
            <div className="stat-card__content">
              <span className="stat-card__label">Name</span>
              <span className="stat-card__value" style={{ fontSize: "1.25rem" }}>
                {profile.firstname} {profile.lastname}
              </span>
              <span className="stat-card__label">Phone</span>
              <span style={{ color: "#fff" }}>{profile.phone || "Not provided"}</span>
              <span className="stat-card__label">City</span>
              <span style={{ color: "#fff" }}>{profile.city || "Not provided"}</span>
              <span className="stat-card__label">Subcity</span>
              <span style={{ color: "#fff" }}>{profile.subcity || "Not provided"}</span>
              <span className="stat-card__label">House number</span>
              <span style={{ color: "#fff" }}>{profile.house_number || "Not provided"}</span>
            </div>
          </div>
          <button
            type="button"
            style={buttonStyle}
            onClick={() => navigate(ROUTES.EDIT_PROFILE)}
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#2d1b69",
  color: "#c8ff3d",
  height: "2.5rem",
  padding: "0 1rem",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  marginTop: "1rem",
  fontWeight: "bold",
};

export default Profile;
