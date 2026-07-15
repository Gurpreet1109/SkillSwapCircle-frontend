import { getInitials, timeAgo } from "../../utils/helpers";

const ReviewCard = ({ review }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i < review.rating);
  return (
    <div className="glass-card p-3">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="avatar-initials" style={{ width: 32, height: 32, fontSize: "0.7rem" }}>
            {getInitials(review.reviewer?.name || "A")}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.85rem" }}>{review.reviewer?.name || "Anonymous"}</p>
            <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--text-dim)" }}>{timeAgo(review.createdAt)}</p>
          </div>
        </div>
        <span style={{ display: "flex", gap: 2 }}>
          {stars.map((f, i) => (
            <span key={i} style={{ color: f ? "#fbbf24" : "var(--text-dim)", fontSize: "0.875rem" }}>★</span>
          ))}
        </span>
      </div>
      {review.comment && (
        <p style={{ margin: "0 0 8px", color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.5 }}>
          "{review.comment}"
        </p>
      )}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {review.didKnowSubject !== undefined && (
          <span className={`badge-pill ${review.didKnowSubject ? "badge-success" : "badge-danger"}`}>
            {review.didKnowSubject ? "✓ Knew subject" : "✗ Didn't know subject"}
          </span>
        )}
        {review.explainedClearly !== undefined && (
          <span className={`badge-pill ${review.explainedClearly ? "badge-success" : "badge-muted"}`}>
            {review.explainedClearly ? "✓ Explained clearly" : "Unclear explanation"}
          </span>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
