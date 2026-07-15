const Loader = ({ size = 40, text = "Loading..." }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "3rem" }}>
    <div style={{
      width: size, height: size,
      border: `3px solid rgba(108,71,255,0.2)`,
      borderTop: `3px solid var(--primary)`,
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
    {text && <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.875rem" }}>{text}</p>}
  </div>
);

export const SkeletonCard = () => (
  <div className="glass-card p-3" style={{ opacity: 0.5 }}>
    {[70, 50, 90, 40].map((w, i) => (
      <div key={i} style={{
        height: i === 0 ? 20 : 14,
        width: `${w}%`,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 6,
        marginBottom: 12,
        animation: "pulse 1.5s ease infinite",
      }} />
    ))}
  </div>
);

export default Loader;
