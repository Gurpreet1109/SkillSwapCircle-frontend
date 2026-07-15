import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { skillService } from "../../services/skillService";
import { exchangeService } from "../../services/exchangeService";
import { coinService } from "../../services/coinService";
import Loader from "../../components/common/Loader";

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="glass-card p-3 h-100">
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <p className="section-label" style={{ marginBottom: 4 }}>{label}</p>
        <h3 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", color }}>{value}</h3>
        {sub && <p style={{ margin: "4px 0 0", color: "var(--text-dim)", fontSize: "0.75rem" }}>{sub}</p>}
      </div>
      <span style={{ fontSize: "1.8rem", opacity: 0.7 }}>{icon}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [requests, setRequests] = useState([]);
  const [coins, setCoins] = useState(user?.skillCoins ?? 0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      skillService.getMy().catch(() => ({ skills: [] })),
      exchangeService.getMy().catch(() => ({ requests: [] })),
      coinService.getBalance().catch(() => ({ skillCoins: user?.skillCoins })),
    ]).then(([s, r, c]) => {
      setSkills(s.skills || []);
      setRequests(r.requests || r || []);
      setCoins(c.skillCoins ?? user?.skillCoins ?? 0);
      setLoading(false);
    });
  }, []);

  const pending = (Array.isArray(requests) ? requests : []).filter(r => r.status === "pending").length;
  const completed = (Array.isArray(requests) ? requests : []).filter(r => r.status === "completed").length;

  if (loading) return <Loader />;

  return (
    <div className="content-area">
      {/* Welcome */}
      <div className="animate-fade-up" style={{ marginBottom: "2rem" }}>
        <p className="section-label">Overview</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 4 }}>
          Hey, {user?.name?.split(" ")[0]} 👋
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Here's your SkillSwap Circle activity at a glance.
        </p>
      </div>

      {/* Stats grid */}
      <div className="row g-3 mb-4 animate-fade-up">
        <div className="col-6 col-md-3">
          <StatCard icon="✦" label="My Skills" value={skills.length} sub="skills listed" color="var(--primary-light)" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon="⏳" label="Pending" value={pending} sub="requests waiting" color="#fbbf24" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon="✓" label="Completed" value={completed} sub="exchanges done" color="#4ade80" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon="🪙" label="Coins" value={coins} sub="SkillCoins balance" color="#fbbf24" />
        </div>
      </div>

      {/* Profile health */}
      <div className="row g-3 mb-4 animate-fade-up-delay">
        <div className="col-md-6">
          <div className="glass-card p-3">
            <p className="section-label mb-2">Profile Health</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Reliability Score", value: user?.reliabilityScore ?? 100, color: user?.reliabilityScore >= 80 ? "#4ade80" : "#fbbf24" },
                { label: "Rating", value: (user?.rating?.average ?? 0) * 20, color: "var(--primary-light)" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{label}</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color }}>{value}%</span>
                  </div>
                  <div className="progress-bar-custom">
                    <div className="progress-bar-fill" style={{ width: `${value}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ★ {user?.rating?.average?.toFixed(1) ?? "0.0"} avg rating ({user?.rating?.count ?? 0} reviews)
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                🔁 {user?.totalSessions ?? 0} total sessions
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="glass-card p-3 h-100" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <p className="section-label mb-3">Quick Actions</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1 }}>
              {[
                { to: "/skills/add", icon: "✦", label: "Add Skill" },
                { to: "/skills", icon: "🔍", label: "Explore" },
                { to: "/exchange", icon: "⇄", label: "Requests" },
                { to: "/wallet", icon: "🪙", label: "Wallet" },
              ].map(({ to, icon, label }) => (
                <Link key={to} to={to} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)",
                    borderRadius: 12, padding: "0.75rem", textAlign: "center", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "rgba(108,71,255,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  >
                    <p style={{ fontSize: "1.4rem", margin: "0 0 4px" }}>{icon}</p>
                    <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 600, fontFamily: "'Syne', sans-serif", color: "var(--text)" }}>{label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Skills */}
      {skills.length > 0 && (
        <div className="animate-fade-up">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p className="section-label">Recent Skills</p>
            <Link to="/skills/my" style={{ color: "var(--primary-light)", textDecoration: "none", fontSize: "0.8rem" }}>View all →</Link>
          </div>
          <div className="row g-3">
            {skills.slice(0, 3).map(skill => (
              <div key={skill._id} className="col-md-4">
                <div className="glass-card p-3">
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    <span className={`badge-pill badge-primary`}>{skill.category}</span>
                    {skill.isVerified && <span className="badge-pill badge-success">✓</span>}
                  </div>
                  <p style={{ margin: 0, fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>{skill.title}</p>
                  <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "0.78rem" }}>{skill.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
