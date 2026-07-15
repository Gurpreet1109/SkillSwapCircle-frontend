import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/helpers";

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [dropOpen, setDropOpen] = useState(false);

  const pageNames = {
    "/dashboard": "Dashboard",
    "/skills": "Explore Skills",
    "/skills/my": "My Skills",
    "/exchange": "Requests",
    "/profile": "Profile",
    "/reviews": "Reviews",
    "/wallet": "Wallet",
    "/verify": "Verification",
  };
  const title = pageNames[location.pathname] || "SkillSwap Circle";

  return (
    <nav style={{
      background: "rgba(10,10,18,0.9)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border-subtle)",
      padding: "0.75rem 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onMenuToggle}
          className="d-lg-none"
          style={{ background: "none", border: "none", color: "var(--text)", fontSize: "1.3rem", cursor: "pointer" }}
        >☰</button>
        <h2 style={{
          margin: 0,
          fontSize: "1.1rem",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          color: "var(--text)",
        }}>{title}</h2>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Coin chip */}
        <span className="coin-chip d-none d-sm-inline-flex">
          🪙 {user?.skillCoins ?? 0}
        </span>

        {/* Avatar dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setDropOpen(!dropOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <div className="avatar-initials" style={{ width: 36, height: 36, fontSize: "0.8rem" }}>
              {getInitials(user?.name)}
            </div>
          </button>
          {dropOpen && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setDropOpen(false)} />
              <div className="glass-card" style={{
                position: "absolute", right: 0, top: "calc(100% + 8px)",
                width: 200, zIndex: 20, padding: "0.5rem",
              }}>
                <p style={{ padding: "0.5rem 0.75rem", margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>{user?.name}</p>
                <hr className="divider" style={{ margin: "0.25rem 0" }} />
                <Link to="/profile" className="d-block" style={{ padding: "0.5rem 0.75rem", color: "var(--text)", textDecoration: "none", borderRadius: 8, fontSize: "0.875rem" }} onClick={() => setDropOpen(false)}>👤 Profile</Link>
                <Link to="/wallet" className="d-block" style={{ padding: "0.5rem 0.75rem", color: "var(--text)", textDecoration: "none", borderRadius: 8, fontSize: "0.875rem" }} onClick={() => setDropOpen(false)}>🪙 Wallet</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
