const Footer = () => (
  <footer style={{
    borderTop: "1px solid var(--border-subtle)",
    padding: "1rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  }}>
    <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-dim)" }}>
      © 2025 <span style={{ color: "var(--primary-light)", fontFamily: "'Syne', sans-serif" }}>SkillSwap Circle</span> — Share skills, grow together.
    </p>
    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-dim)" }}>v1.0.0</p>
  </footer>
);

export default Footer;
