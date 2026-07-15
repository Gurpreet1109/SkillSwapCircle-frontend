import { useState, useEffect } from "react";
import { exchangeService } from "../../services/exchangeService";
import { useAuth } from "../../hooks/useAuth";
import RequestCard from "../../components/cards/RequestCard";
import Loader from "../../components/common/Loader";

const TABS = ["all", "pending", "accepted", "completed", "declined"];

const Requests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [toast, setToast] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await exchangeService.getMy().catch(() => []);
    setRequests(Array.isArray(data) ? data : data.requests || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const accept = async (id) => {
    await exchangeService.accept(id).catch(e => showToast("Error: " + e.message));
    showToast("Request accepted! 🎉"); load();
  };

  const decline = async (id) => {
    await exchangeService.decline(id).catch(e => showToast("Error: " + e.message));
    showToast("Request declined."); load();
  };

  const complete = async (id) => {
    await exchangeService.complete(id).catch(e => showToast("Error: " + e.message));
    showToast("Marked as completed ✓"); load();
  };

  const filtered = tab === "all" ? requests : requests.filter(r => r.status === tab);

  return (
    <div className="content-area">
      {toast && (
        <div style={{ position: "fixed", top: 80, right: 20, zIndex: 2000, background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.75rem 1rem", color: "var(--text)", fontSize: "0.875rem", boxShadow: "var(--shadow)" }}>
          {toast}
        </div>
      )}

      <div className="animate-fade-up" style={{ marginBottom: "1.5rem" }}>
        <p className="section-label">Exchange</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>Requests</h2>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: "0.4rem 0.9rem", borderRadius: 100, cursor: "pointer", fontSize: "0.8rem",
              fontFamily: "'Syne', sans-serif", fontWeight: 600, textTransform: "capitalize",
              border: tab === t ? "1px solid var(--primary)" : "1px solid var(--border-subtle)",
              background: tab === t ? "rgba(108,71,255,0.2)" : "transparent",
              color: tab === t ? "var(--primary-light)" : "var(--text-muted)",
              transition: "all 0.2s",
            }}
          >
            {t}
            {t !== "all" && (
              <span style={{ marginLeft: 5, background: "rgba(255,255,255,0.1)", borderRadius: 100, padding: "0 5px", fontSize: "0.7rem" }}>
                {requests.filter(r => r.status === t).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "2rem" }}>⇄</p>
          <p>No {tab === "all" ? "" : tab} requests yet</p>
        </div>
      ) : (
        <div className="row g-3 animate-fade-up">
          {filtered.map(req => (
            <div key={req._id} className="col-md-6 col-xl-4">
              <RequestCard
                request={req}
                currentUserId={user?._id}
                onAccept={accept}
                onDecline={decline}
                onComplete={complete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
