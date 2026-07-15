import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
  e.preventDefault();

  console.log("Submitting...");
  console.log(form);

  if (form.password.length < 6) {
    return setError("Password must be at least 6 characters");
  }

  setError("");
  setLoading(true);

  try {
    const response = await register(form);

    console.log(response);

    navigate("/dashboard");
  } catch (err) {
    console.error(err);

    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "8%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(108,71,255,0.12), transparent)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 440 }}>
        <div
          style={{ textAlign: "center", marginBottom: "2rem" }}
          className="animate-fade-up"
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              margin: "0 auto 1rem",
              background:
                "linear-gradient(135deg, var(--primary), var(--accent))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              boxShadow: "var(--glow)",
            }}
          >
            ✦
          </div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "2rem",
              marginBottom: 4,
            }}
          >
            Join the <span className="gradient-text">Circle</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Start with 10 free SkillCoins 🪙
          </p>
        </div>

        <div className="glass-card p-4 animate-fade-up-delay">
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10,
                padding: "0.75rem",
                marginBottom: "1rem",
                color: "#f87171",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Perks strip */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            {["🪙 10 Free Coins", "✓ Peer Verified", "⇄ Skill Exchange"].map(
              (p) => (
                <span
                  key={p}
                  className="badge-pill badge-muted"
                  style={{ fontSize: "0.7rem" }}
                >
                  {p}
                </span>
              ),
            )}
          </div>

          <form onSubmit={submit}>
            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handle}
              placeholder="John Doe"
              icon="👤"
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handle}
              placeholder="you@example.com"
              icon="✉"
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handle}
              placeholder="Min. 6 characters"
              icon="🔒"
              hint="At least 6 characters"
              required
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="mt-1"
            >
              Create Account
            </Button>
          </form>
          <p
            style={{
              textAlign: "center",
              marginTop: "1.25rem",
              color: "var(--text-muted)",
              fontSize: "0.875rem",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "var(--primary-light)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
