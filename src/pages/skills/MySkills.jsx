import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { skillService } from "../../services/skillService";
import SkillCard from "../../components/cards/SkillCard";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

const CATS = ["tech", "music", "design", "language"];
const LEVELS = ["rookie", "intermediate", "expert"];

const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await skillService.getMy().catch(() => ({ skills: [] }));
    setSkills(data.skills || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (skill) => {
    setEditForm({ title: skill.title, description: skill.description, category: skill.category, level: skill.level });
    setEditModal(skill);
  };

  const saveEdit = async () => {
    setSaving(true);
    await skillService.update(editModal._id, editForm).catch(() => {});
    await load();
    setEditModal(null);
    setSaving(false);
  };

  const deleteSkill = async (id) => {
    if (!confirm("Delete this skill?")) return;
    await skillService.delete(id).catch(() => {});
    await load();
  };

  return (
    <div className="content-area">
      <div className="animate-fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p className="section-label">Your Skills</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 0 }}>My Skills</h2>
        </div>
        <Link to="/skills/add">
          <Button variant="primary">+ Add Skill</Button>
        </Link>
      </div>

      {loading ? <Loader /> : skills.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <p style={{ fontSize: "3rem", marginBottom: 12 }}>✦</p>
          <h4 style={{ fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>No skills yet</h4>
          <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>Share what you know with the circle</p>
          <Link to="/skills/add"><Button variant="primary">Add Your First Skill</Button></Link>
        </div>
      ) : (
        <div className="row g-3 animate-fade-up">
          {skills.map(skill => (
            <div key={skill._id} className="col-sm-6 col-lg-4 col-xl-3">
              <SkillCard skill={skill} showOwner={false} onEdit={openEdit} onDelete={deleteSkill} />
            </div>
          ))}
        </div>
      )}

      <Modal
        show={!!editModal}
        onClose={() => setEditModal(null)}
        title="Edit Skill"
        footer={
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="outline" onClick={() => setEditModal(null)}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={saveEdit}>Save Changes</Button>
          </div>
        }
      >
        {editModal && (
          <>
            <Input label="Title" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
            <Input label="Description" as="textarea" rows={3} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
            <div className="mb-3">
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)" }}>Category</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CATS.map(c => (
                  <button key={c} type="button" onClick={() => setEditForm({ ...editForm, category: c })}
                    style={{ padding: "0.35rem 0.8rem", borderRadius: 8, cursor: "pointer", textTransform: "capitalize", fontSize: "0.8rem", border: editForm.category === c ? "1px solid var(--primary)" : "1px solid var(--border-subtle)", background: editForm.category === c ? "rgba(108,71,255,0.2)" : "transparent", color: editForm.category === c ? "var(--primary-light)" : "var(--text-muted)" }}
                  >{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "var(--text-muted)" }}>Level</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {LEVELS.map(l => (
                  <button key={l} type="button" onClick={() => setEditForm({ ...editForm, level: l })}
                    style={{ padding: "0.35rem 0.8rem", borderRadius: 8, cursor: "pointer", textTransform: "capitalize", fontSize: "0.8rem", border: editForm.level === l ? "1px solid var(--accent)" : "1px solid var(--border-subtle)", background: editForm.level === l ? "rgba(255,107,53,0.15)" : "transparent", color: editForm.level === l ? "var(--accent-light)" : "var(--text-muted)" }}
                  >{l}</button>
                ))}
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MySkills;
