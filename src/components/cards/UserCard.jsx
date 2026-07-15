import { getInitials } from "../../utils/helpers";

const Stars = ({ rating }) => (
  <span>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.round(rating) ? "#fbbf24" : "var(--text-dim)", fontSize: "0.85rem" }}>★</span>
    ))}
  </span>
);

const UserCard = ({ user, compact = false }) => (
  <div className="glass-card p-3" style={{ display: "flex", alignItems: compact ? "center" : "flex-start", gap: 12 }}>
    <div className="avatar-initials" style={{ width: compact ? 36 : 48, height: compact ? 36 : 48, fontSize: compact ? "0.8rem" : "1rem", flexShrink: 0 }}>
      {getInitials(user.name)}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: compact ? "0.875rem" : "1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {user.name}
      </p>
      {!compact && user.bio && (
        <p style={{ margin: "4px 0 8px", color: "var(--text-muted)", fontSize: "0.78rem", lineHeight: 1.4 }}>
          {user.bio.slice(0, 80)}{user.bio.length > 80 ? "…" : ""}
        </p>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Stars rating={user.rating?.average || 0} />
        <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>({user.rating?.count || 0})</span>
        <span className="coin-chip" style={{ fontSize: "0.7rem", padding: "1px 7px" }}>🪙 {user.skillCoins}</span>
        <span style={{ fontSize: "0.72rem", color: user.reliabilityScore >= 80 ? "#4ade80" : user.reliabilityScore >= 50 ? "#fbbf24" : "#f87171" }}>
          ⚡ {user.reliabilityScore}%
        </span>
      </div>
    </div>
  </div>
);

export default UserCard;
