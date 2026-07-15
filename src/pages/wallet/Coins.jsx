import { useState, useEffect } from "react";
import { coinService } from "../../services/coinService";
import { exchangeService } from "../../services/exchangeService";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";

const Coins = () => {
  const { user, updateUser } = useAuth();
  const [balance, setBalance] = useState(user?.skillCoins ?? 0);
  const [accepted, setAccepted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    Promise.all([
      coinService.getBalance().catch(() => ({ skillCoins: user?.skillCoins })),
      exchangeService.getMy().catch(() => []),
    ]).then(([c, ex]) => {
      setBalance(c.skillCoins ?? user?.skillCoins ?? 0);
      const reqs = Array.isArray(ex) ? ex : ex.requests || [];
      setAccepted(reqs.filter(r => r.status === "accepted"));
      setLoading(false);
    });
  }, []);

  const claim = async (exchangeId) => {
    setClaiming(exchangeId);
    try {
      const data = await coinService.claim(exchangeId);
      setBalance(data.skillCoins);
      updateUser({ skillCoins: data.skillCoins });
      setToast("🪙 1 SkillCoin claimed!");
    } catch (err) {
      setToast("Error: " + err.message);
    } finally {
      setClaiming(null);
      setTimeout(() => setToast(""), 3000);
    }
  };

  return (
    <div className="content-area">
      {toast && <div style={{ position: "fixed", top: 80, right: 20, zIndex: 2000, background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.75rem 1rem", color: "var(--text)", fontSize: "0.875rem" }}>{toast}</div>}

      <div className="animate-fade-up" style={{ marginBottom: "1.5rem" }}>
        <p className="section-label">Economy</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>SkillCoin Wallet</h2>
      </div>

      {/* Balance card */}
      <div className="row g-3 mb-4">
        <div className="col-md-5 col-lg-4">
          <div className="glass-card p-4 text-center animate-fade-up" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(108,71,255,0.1))", border: "1px solid rgba(245,158,11,0.3)" }}>
            <p style={{ fontSize: "3rem", margin: "0 0 8px" }}>🪙</p>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "3.5rem", margin: 0, color: "#fbbf24" }}>{balance}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>SkillCoins</p>
          </div>
        </div>
        <div className="col-md-7 col-lg-8">
          <div className="glass-card p-4 animate-fade-up-delay">
            <p className="section-label mb-3">How SkillCoins Work</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "🎁", text: "Get 10 coins when you join" },
                { icon: "🔄", text: "Claim 1 coin per accepted exchange session" },
                { icon: "⏳", text: "1 hour cooldown between claims" },
                { icon: "🔒", text: "Coins can be used for coin-exchange requests" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "1.1rem" }}>{icon}</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Claim section */}
      <div className="animate-fade-up">
        <p className="section-label mb-3">Claim Coins from Accepted Sessions</p>
        {loading ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading...</p>
        ) : accepted.length === 0 ? (
          <div className="glass-card p-4 text-center" style={{ color: "var(--text-muted)" }}>
            <p style={{ fontSize: "1.5rem" }}>🔄</p>
            <p>No accepted sessions to claim from. Accept or get accepted exchange requests first.</p>
          </div>
        ) : (
          <div className="row g-3">
            {accepted.map(req => (
              <div key={req._id} className="col-md-6 col-lg-4">
                <div className="glass-card p-3" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>Exchange #{req._id.slice(-6)}</p>
                    <span className="badge-pill badge-primary">Accepted</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600 }}>
                    {req.senderSkill?.title || "?"} ⇄ {req.recieverSkill?.title || "?"}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    loading={claiming === req._id}
                    onClick={() => claim(req._id)}
                  >
                    🪙 Claim 1 Coin
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Coins;
