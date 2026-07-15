import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "" });
  const [skillWanted, setSkillWanted] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.put("/users/profile", form);
      updateUser(updated.user || updated);
      setToast("Profile updated ✓");
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      setError(err.message);
    } finally { setSaving(false); }
  };

  return (
    <div className="content-area">
      {toast && <div style={{ position: "fixed", top: 80, right: 20, zIndex: 2000, background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.75rem 1rem", color: "#4ade80", fontSize: "0.875rem" }}>{toast}</div>}

      <div className="animate-fade-up" style={{ marginBottom: "1.5rem" }}>
        <p className="section-label">Account</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>Edit Profile</h2>
      </div>

      <div style={{ maxWidth: 520 }}>
        <div className="glass-card p-4 animate-fade-up-delay">
          {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "0.75rem", marginBottom: "1rem", color: "#f87171", fontSize: "0.85rem" }}>{error}</div>}
          <form onSubmit={save}>
            <Input label="Full Name" name="name" value={form.name} onChange={handle} required />
            <Input label="Bio" name="bio" as="textarea" rows={3} value={form.bio} onChange={handle} placeholder="Tell the circle about yourself…" hint="Max 300 characters" />
            <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", marginTop: -8, marginBottom: 16 }}>{form.bio.length}/300</p>

            <div style={{ display: "flex", gap: 10 }}>
              <Button type="button" variant="outline" onClick={() => navigate("/profile")}>Cancel</Button>
              <Button type="submit" variant="primary" loading={saving} className="flex-fill">Save Changes</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
