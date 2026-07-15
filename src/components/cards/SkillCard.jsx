import { categoryColors, levelLabels, getInitials } from "../../utils/helpers";
import Button from "../common/Button";

const SkillCard = ({ skill, onRequest, onEdit, onDelete, showOwner = true }) => {
  const catClass = categoryColors[skill.category] || "badge-muted";
  const lvl = levelLabels[skill.level] || {};

  return (
    <div className="glass-card p-3 h-100" style={{ display: "flex", flexDirection: "column" }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            <span className={`badge-pill ${catClass}`}>{skill.category}</span>
            {skill.isVerified && <span className="badge-pill badge-success">✓ Verified</span>}
            <span className={`badge-pill badge-muted`} style={{ color: `var(--${lvl.cls === "lvl-rookie" ? "success" : lvl.cls === "lvl-expert" ? "accent-light" : "warning"})` }}>
              {lvl.label}
            </span>
          </div>
          <h6 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>{skill.title}</h6>
        </div>
        {!skill.isAvailable && (
          <span className="badge-pill badge-muted" style={{ fontSize: "0.65rem" }}>Unavailable</span>
        )}
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", flex: 1, lineHeight: 1.5, marginBottom: 12 }}>
        {skill.description}
      </p>

      {/* Owner */}
      {showOwner && skill.owner && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div className="avatar-initials" style={{ width: 26, height: 26, fontSize: "0.65rem" }}>
            {getInitials(skill.owner?.name || "U")}
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{skill.owner?.name}</span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        {onRequest && (
          <Button variant="primary" size="sm" onClick={() => onRequest(skill)} className="flex-fill">
            Request
          </Button>
        )}
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(skill)}>Edit</Button>
        )}
        {onDelete && (
          <Button variant="danger" size="sm" onClick={() => onDelete(skill._id)}>Del</Button>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
