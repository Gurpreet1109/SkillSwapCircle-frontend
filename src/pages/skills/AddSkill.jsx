import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { skillService } from "../../services/skillService";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const CATS = ["tech", "music", "design", "language"];
const LEVELS = ["rookie", "intermediate", "expert"];

const AddSkill = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", category: "tech", level: "rookie" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return setError("Title and description are required");
    setError(""); setLoading(true);
    try {
      await skillService.create(form);
      navigate("/skills/my");
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="content-area">
      <div className="animate-fade-up" style={{ marginBottom: "1.5rem" }}>
        <p className="section-label">Skills</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>Add a New Skill</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Share what you can teach with the circle</p>
      </div>

      <div style={{ maxWidth: 560 }}>
        <div className="glass-card p-4 animate-fade-up-delay">
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "0.75rem", marginBottom: "1rem", color: "#f87171", fontSize: "0.85rem" }}>
              {error}
            </div>
          )}
          <form onSubmit={submit}>
            <Input label="Skill Title *" name="title" value={form.title} onChange={handle} placeholder="e.g. Guitar for Beginners" required />
            <Input label="Description *" name="description" as="textarea" rows={4} value={form.description} onChange={handle} placeholder="Describe what you'll teach, your experience, etc." required />

            <div className="mb-3">
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)" }}>Category *</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CATS.map(c => (
                  <button
                    key={c} type="button"
                    onClick={() => setForm({ ...form, category: c })}
                    style={{
                      padding: "0.4rem 0.9rem", borderRadius: 8, cursor: "pointer",
                      border: form.category === c ? "1px solid var(--primary)" : "1px solid var(--border-subtle)",
                      background: form.category === c ? "rgba(108,71,255,0.2)" : "transparent",
                      color: form.category === c ? "var(--primary-light)" : "var(--text-muted)",
                      fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "0.8rem",
                      textTransform: "capitalize", transition: "all 0.2s",
                    }}
                  >{c}</button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)" }}>Level *</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {LEVELS.map(l => (
                  <button
                    key={l} type="button"
                    onClick={() => setForm({ ...form, level: l })}
                    style={{
                      padding: "0.4rem 0.9rem", borderRadius: 8, cursor: "pointer",
                      border: form.level === l ? "1px solid var(--accent)" : "1px solid var(--border-subtle)",
                      background: form.level === l ? "rgba(255,107,53,0.15)" : "transparent",
                      color: form.level === l ? "var(--accent-light)" : "var(--text-muted)",
                      fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "0.8rem",
                      textTransform: "capitalize", transition: "all 0.2s",
                    }}
                  >{l}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Button type="button" variant="outline" onClick={() => navigate("/skills/my")}>Cancel</Button>
              <Button type="submit" variant="primary" loading={loading} className="flex-fill">Add Skill</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSkill;
