import { useState, useEffect } from "react";
import { skillService } from "../../services/skillService";
import { exchangeService } from "../../services/exchangeService";
import { useAuth } from "../../hooks/useAuth";
import SkillCard from "../../components/cards/SkillCard";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

const CATS = ["", "tech", "music", "design", "language"];
const LEVELS = ["", "rookie", "intermediate", "expert"];

const ExploreSkills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", level: "", search: "" });
  const [requestModal, setRequestModal] = useState(null);
  const [reqForm, setReqForm] = useState({ senderSkill: "", message: "", scheduledAt: "" });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");

  const load = async () => {
    setLoading(true);
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.level) params.level = filters.level;
    if (filters.search) params.search = filters.search;
    const [s, my] = await Promise.all([
      skillService.getAll(params).catch(() => ({ skills: [] })),
      skillService.getMy().catch(() => ({ skills: [] })),
    ]);
    setSkills((s.skills || []).filter(sk => sk.owner?._id !== user?._id));
    setMySkills(my.skills || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filters.category, filters.level]);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const sendRequest = async () => {
    if (!reqForm.senderSkill) return;
    setSending(true);
    try {
      await exchangeService.send({
        reciever: requestModal.owner?._id,
        senderSkill: reqForm.senderSkill,
        recieverSkill: requestModal._id,
        message: reqForm.message,
        scheduledAt: reqForm.scheduledAt || undefined,
      });
      setToast("Request sent! 🎉");
      setRequestModal(null);
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      setToast("Error: " + err.message);
    } finally { setSending(false); }
  };

  return (
    <div className="content-area">
      {toast && (
        <div style={{ position: "fixed", top: 80, right: 20, zIndex: 2000, background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.75rem 1rem", color: "var(--text)", fontSize: "0.875rem", boxShadow: "var(--shadow)" }}>
          {toast}
        </div>
      )}

      <div className="animate-fade-up" style={{ marginBottom: "1.5rem" }}>
        <p className="section-label">Discover</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>Explore Skills</h2>
      </div>

      {/* Filters */}
      <div className="glass-card p-3 mb-4 animate-fade-up">
        <form onSubmit={handleSearch}>
          <div className="row g-2">
            <div className="col-12 col-md-4">
              <Input
                placeholder="Search skills..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                icon="🔍"
              />
            </div>
            <div className="col-6 col-md-3">
              <select
                className="input-dark"
                value={filters.category}
                onChange={e => setFilters({ ...filters, category: e.target.value })}
              >
                {CATS.map(c => <option key={c} value={c}>{c || "All Categories"}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-3">
              <select
                className="input-dark"
                value={filters.level}
                onChange={e => setFilters({ ...filters, level: e.target.value })}
              >
                {LEVELS.map(l => <option key={l} value={l}>{l || "All Levels"}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-2">
              <Button type="submit" variant="primary" fullWidth>Search</Button>
            </div>
          </div>
        </form>
      </div>

      {/* Count */}
      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "1rem" }}>
        {loading ? "Loading..." : `${skills.length} skill${skills.length !== 1 ? "s" : ""} found`}
      </p>

      {loading ? <Loader /> : (
        <div className="row g-3 animate-fade-up">
          {skills.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "2rem" }}>✦</p>
              <p>No skills found. Try adjusting filters.</p>
            </div>
          ) : skills.map(skill => (
            <div key={skill._id} className="col-sm-6 col-lg-4 col-xl-3">
              <SkillCard skill={skill} onRequest={mySkills.length > 0 ? setRequestModal : undefined} />
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      <Modal
        show={!!requestModal}
        onClose={() => setRequestModal(null)}
        title="Send Exchange Request"
        footer={
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="outline" onClick={() => setRequestModal(null)}>Cancel</Button>
            <Button variant="primary" loading={sending} onClick={sendRequest}>Send Request</Button>
          </div>
        }
      >
        {requestModal && (
          <>
            <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "rgba(108,71,255,0.1)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>Requesting skill</p>
              <p style={{ margin: 0, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{requestModal.title}</p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>from {requestModal.owner?.name}</p>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Offer your skill in return *
              </label>
              <select
                className="input-dark"
                value={reqForm.senderSkill}
                onChange={e => setReqForm({ ...reqForm, senderSkill: e.target.value })}
              >
                <option value="">Select a skill you offer…</option>
                {mySkills.map(s => <option key={s._id} value={s._id}>{s.title} ({s.level})</option>)}
              </select>
              {mySkills.length === 0 && <p style={{ color: "#fbbf24", fontSize: "0.78rem", marginTop: 4 }}>Add your skills first to send requests.</p>}
            </div>

            <Input
              label="Message (optional)"
              as="textarea"
              rows={3}
              value={reqForm.message}
              onChange={e => setReqForm({ ...reqForm, message: e.target.value })}
              placeholder="Introduce yourself and why you want to swap..."
            />
            <Input
              label="Schedule (optional)"
              type="datetime-local"
              value={reqForm.scheduledAt}
              onChange={e => setReqForm({ ...reqForm, scheduledAt: e.target.value })}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default ExploreSkills;
