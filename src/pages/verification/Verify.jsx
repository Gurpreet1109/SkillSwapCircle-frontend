import { useState, useEffect } from "react";
import { skillService } from "../../services/skillService";
import { api } from "../../services/api";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";

const Verify = () => {
  const [mySkills, setMySkills] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    skillService.getMy().then(d => {
      setMySkills(d.skills || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!selected || !answer.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/verify/${selected._id}`, { answer });
      setToast("Answers submitted for verification ✓");
      setSelected(null); setAnswer("");
    } catch (err) { setToast("Error: " + err.message); }
    finally { setSubmitting(false); setTimeout(() => setToast(""), 3000); }
  };

  return (
    <div className="content-area">
      {toast && <div style={{ position: "fixed", top: 80, right: 20, zIndex: 2000, background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.75rem 1rem", color: "var(--text)", fontSize: "0.875rem" }}>{toast}</div>}

      <div className="animate-fade-up" style={{ marginBottom: "1.5rem" }}>
        <p className="section-label">Trust</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>Skill Verification</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Get peer-verified to build trust in the circle</p>
      </div>

      {/* How it works */}
      <div className="glass-card p-4 mb-4 animate-fade-up">
        <p className="section-label mb-3">How Verification Works</p>
        <div className="row g-3">
          {[
            { step: "1", text: "Submit answers to skill quiz questions" },
            { step: "2", text: "Get rated by 3+ peers via reviews (didKnowSubject)" },
            { step: "3", text: "Achieve avg rating ≥ 3.5 and 70% positive peer confirmations" },
            { step: "4", text: "Your skill gets the ✓ Verified badge" },
          ].map(({ step, text }) => (
            <div key={step} className="col-sm-6 col-lg-3">
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>{step}</div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills list */}
      {loading ? <Loader /> : (
        <div className="animate-fade-up">
          <p className="section-label mb-3">Your Skills</p>
          <div className="row g-3">
            {mySkills.map(skill => (
              <div key={skill._id} className="col-md-6 col-lg-4">
                <div className={`glass-card p-3 ${selected?._id === skill._id ? "border-primary" : ""}`}
                  style={{ borderColor: selected?._id === skill._id ? "var(--primary)" : undefined, cursor: skill.isVerified ? "default" : "pointer" }}
                  onClick={() => !skill.isVerified && setSelected(skill)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <h6 style={{ fontFamily: "'Syne', sans-serif", margin: 0 }}>{skill.title}</h6>
                    {skill.isVerified ? (
                      <span className="badge-pill badge-success">✓ Verified</span>
                    ) : (
                      <span className="badge-pill badge-muted">Unverified</span>
                    )}
                  </div>
                  <p style={{ margin: "0 0 10px", fontSize: "0.78rem", color: "var(--text-muted)" }}>{skill.category} · {skill.level}</p>
                  {skill.verificationScore > 0 && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>Verification progress</span>
                        <span style={{ fontSize: "0.72rem", color: "var(--primary-light)" }}>{skill.verificationScore}%</span>
                      </div>
                      <div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: `${skill.verificationScore}%` }} /></div>
                    </div>
                  )}
                  {!skill.isVerified && (
                    <button style={{ marginTop: 8, fontSize: "0.75rem", background: "rgba(108,71,255,0.1)", border: "1px solid var(--border)", borderRadius: 6, padding: "0.3rem 0.7rem", color: "var(--primary-light)", cursor: "pointer" }}>
                      Submit quiz answers →
                    </button>
                  )}
                </div>
              </div>
            ))}
            {mySkills.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                <p>Add skills first to start verification.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit answers */}
      {selected && (
        <div className="glass-card p-4 mt-4 animate-fade-up">
          <p className="section-label mb-2">Submit Answers for: {selected.title}</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Answer a few questions about your skill. Your responses will be used by peer reviewers to verify your knowledge.
          </p>
          <Input
            label="Your answers / demonstration"
            as="textarea"
            rows={5}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Describe your experience, key concepts you know, and how you'd teach this skill…"
          />
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button variant="primary" loading={submitting} onClick={submit}>Submit for Verification</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verify;
