import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/dashboard", icon: "⊞", label: "Dashboard" },
  { to: "/skills", icon: "✦", label: "Explore Skills" },
  { to: "/skills/my", icon: "◈", label: "My Skills" },
  { to: "/exchange", icon: "⇄", label: "Requests" },
  { to: "/reviews", icon: "★", label: "Reviews" },
  { to: "/wallet", icon: "🪙", label: "Wallet" },
  { to: "/verify", icon: "✓", label: "Verification" },
];

const Sidebar = ({ open, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const sidebarContent = (
    <aside className="sidebar" style={{
      width: 240,
      height: "100vh",
      // background: "rgba(10,10,18,0.98)",
      borderRight: "1px solid var(--border-subtle)",
      display: "flex",
      flexDirection: "column",
      padding: "1.5rem 0",
      position: "sticky",
      top: 0,
      overflowY: "auto",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem",
          }}>⇄</div>
          <div>
            <p style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", lineHeight: 1.1 }}>SkillSwap</p>
            <p style={{ margin: 0, fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.1em" }}>CIRCLE</p>
          </div>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "0 1rem 1rem" }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 0.75rem" }}>
        <p className="section-label" style={{ padding: "0 0.75rem", marginBottom: 8 }}>Menu</p>
        {navItems.map(({ to, icon, label }) => (
          <NavLink className="nav-item"
            key={to}
            to={to}
            end={to === "/skills"}
            onClick={onClose}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0.6rem 0.75rem",
              borderRadius: 10,
              textDecoration: "none",
              marginBottom: 2,
              fontSize: "0.875rem",
              fontWeight: isActive ? 600 : 400,
             color: isActive ? "#0d6e8e" : "var(--text)",
              background: isActive ? "linear-gradient(135deg, rgba(108,71,255,0.3), rgba(108,71,255,0.1))" : "transparent",
              border: isActive ? "1px solid rgba(108,71,255,0.3)" : "1px solid transparent",
              transition: "all 0.2s",
            })}
          >
            <span style={{ fontSize: "1rem", width: 20, textAlign: "center" }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "1rem 1.25rem 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.75rem", fontWeight: 700, color: "white",
          }}>
            {(user?.name || "U").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "black" }}>{user?.name}</p>
            <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--text-dim)" }}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 8, padding: "0.5rem", color: "#f87171", fontSize: "0.8rem",
            cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 600,
          }}
        >
          ⤫ Logout
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="d-none d-lg-block">{sidebarContent}</div>

      {/* Mobile Drawer */}
      {open && (
        <>
          <div className="overlay d-lg-none" onClick={onClose} />
          <div className="d-lg-none" style={{ position: "fixed", left: 0, top: 0, zIndex: 1050, height: "100vh" }}>
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
