import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { getInitials } from "../../utils/helpers";

const Stars = ({ rating }) => (
  <span>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(rating) ? "#fbbf24" : "var(--text-dim)", fontSize: "1rem" }}>★</span>)}</span>
);

const Profile = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="content-area">
      <div className="animate-fade-up" style={{ marginBottom: "1.5rem" }}>
        <p className="section-label">Account</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>My Profile</h2>
      </div>

      <div className="row g-4">
        {/* Main card */}
        <div className="col-md-5 col-lg-4">
          <div className="glass-card p-4 text-center">
            <div className="avatar-initials mx-auto mb-3" style={{ width: 72, height: 72, fontSize: "1.5rem" }}>
              {getInitials(user.name)}
            </div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 4 }}>{user.name}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 12 }}>{user.email}</p>
            <span className={`badge-pill ${user.role === "admin" ? "badge-accent" : "badge-muted"}`} style={{ textTransform: "capitalize" }}>{user.role}</span>

            {user.bio && (
              <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6, textAlign: "left" }}>
                {user.bio}
              </p>
            )}
            <hr className="divider" />
            <Link to="/profile/edit">
              <button className="btn-outline-glow w-100">Edit Profile</button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="col-md-7 col-lg-8">
          <div className="row g-3 mb-3">
            {[
              { label: "SkillCoins", value: user.skillCoins, icon: "🪙" },
              { label: "Reliability", value: `${user.reliabilityScore}%`, icon: "⚡" },
              { label: "Sessions", value: user.totalSessions, icon: "🔁" },
              { label: "No-Shows", value: user.noShowCount, icon: "⚠" },
            ].map(s => (
              <div key={s.label} className="col-6">
                <div className="glass-card p-3">
                  <p style={{ fontSize: "1.5rem", margin: "0 0 4px" }}>{s.icon}</p>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, margin: "0 0 2px", fontSize: "1.5rem" }}>{s.value}</h4>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.78rem" }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-3">
            <p className="section-label mb-3">Rating</p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "3rem", margin: 0, lineHeight: 1 }}>
                  {user.rating?.average?.toFixed(1) ?? "0.0"}
                </h2>
                <Stars rating={user.rating?.average ?? 0} />
                <p style={{ margin: "4px 0 0", color: "var(--text-dim)", fontSize: "0.78rem" }}>{user.rating?.count ?? 0} reviews</p>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                {[5,4,3,2,1].map(n => (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", width: 8 }}>{n}</span>
                    <span style={{ color: "#fbbf24", fontSize: "0.75rem" }}>★</span>
                    <div className="progress-bar-custom" style={{ flex: 1 }}>
                      <div className="progress-bar-fill" style={{ width: `${Math.random() * 80}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
