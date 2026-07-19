import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Profile</h1>
        <p className="dashboard-subtitle">Your account information.</p>
      </div>

      <div className="stat-card" style={{ maxWidth: "480px" }}>
        <div className="stat-card__content">
          <span className="stat-card__label">Name</span>
          <span className="stat-card__value" style={{ fontSize: "1.25rem" }}>
            {user?.firstname} {user?.lastname}
          </span>
          <span className="stat-card__label">Email</span>
          <span style={{ color: "#fff" }}>{user?.email}</span>
          <span className="stat-card__label">Role</span>
          <span style={{ color: "#fff" }}>{user?.role}</span>
          {user?.phone && (
            <>
              <span className="stat-card__label">Phone</span>
              <span style={{ color: "#fff" }}>{user.phone}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
