import { statusColors, timeAgo, getInitials } from "../../utils/helpers";
import Button from "../common/Button";

const RequestCard = ({ request, currentUserId, onAccept, onDecline, onComplete, onReport }) => {
  const isReceiver = request.reciever?._id?.toString() === currentUserId?.toString() || request.reciever?.toString() === currentUserId?.toString();

  const isSender = request.sender?._id?.toString() === currentUserId?.toString() || request.sender?.toString() === currentUserId?.toString();

  const other = isReceiver ? request.sender?.name || "User" : request.reciever?.name || "User";

  const statusClass = statusColors[request.status] || "badge-muted";

  return (
    <div className="glass-card p-3">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            className="avatar-initials"
            style={{
              width: 34,
              height: 34,
              fontSize: "0.75rem",
            }}
          >
            {getInitials(other)}
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: "0.875rem",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {isReceiver ? "From" : "To"}: {other}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.72rem",
                color: "var(--text-dim)",
              }}
            >
              {timeAgo(request.createdAt)}
            </p>
          </div>
        </div>
        <span className={`badge-pill ${statusClass}`} style={{ textTransform: "capitalize" }}>
          {request.status}
        </span>
      </div>

      {/* Skills */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            background: "rgba(108,71,255,0.1)",
            borderRadius: 8,
            padding: "0.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.65rem",
              color: "var(--text-dim)",
            }}
          >
            Offered
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {request.senderSkill?.title || "—"}
          </p>
        </div>
        <span
          style={{
            color: "var(--primary-light)",
            fontSize: "1.2rem",
          }}
        >
          ⇄
        </span>
        <div
          style={{
            background: "rgba(255,107,53,0.08)",
            borderRadius: 8,
            padding: "0.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.65rem",
              color: "var(--text-dim)",
            }}
          >
            Wanted
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {request.recieverSkill?.title || "—"}
          </p>
        </div>
      </div>

      {request.message && (
        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            fontStyle: "italic",
            marginBottom: 12,
            overflowWrap: "anywhere",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
          }}
        >
          "{request.message}"
        </p>
      )}

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {request.status === "pending" && isReceiver && (
          <>
            <Button variant="primary" size="sm" onClick={() => onAccept(request._id)}>
              Accept
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDecline(request._id)}>
              Decline
            </Button>
          </>
        )}
        {request.status === "accepted" && (
          <>
            {onComplete && (
              <Button variant="primary" size="sm" onClick={() => onComplete(request._id)}>
                Mark Complete
              </Button>
            )}
            {request.roomId && (
              <a href={`/room/${request.roomId}`} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  🎥 Join Room
                </Button>
              </a>
            )}
            {onReport && (
              <Button variant="outline" size="sm" onClick={() => onReport(request._id)}>
                Report No-Show
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
