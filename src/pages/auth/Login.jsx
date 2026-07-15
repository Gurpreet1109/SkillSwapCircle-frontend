import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

/* Mock user injected directly — no API call needed */
const MOCK_USER = {
  _id: "mock_user_dev_001",
  name: "Dev User",
  email: "dev@skillswap.com",
  role: "user",
  skillCoins: 25,
  reliabilityScore: 92,
  rating: { average: 4.3, count: 7 },
  totalSessions: 5,
  noShowCount: 0,
  bio: "Mock user for local development. All features work without a real backend.",
};

const Login = () => {
  const { login, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mockLoading, setMockLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Mock login: bypasses API entirely ── */
  const mockLogin = () => {
    setMockLoading(true);
    setTimeout(() => {
      /* Inject mock user into context + localStorage */
      updateUser(MOCK_USER);
      localStorage.setItem("ssc_user", JSON.stringify(MOCK_USER));
      localStorage.setItem("ssc_token", "mock_token_dev_only");
      navigate("/dashboard");
    }, 700);
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
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(108,71,255,0.15), transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "5%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,107,53,0.1), transparent)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Back to home */}
        <div
          style={{ textAlign: "center", marginBottom: "1rem" }}
          className="animate-fade-up"
        >
          <Link
            to="/"
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: "0.82rem",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            ← Back to home
          </Link>
        </div>

        {/* Logo */}
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
            ⇄
          </div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "2rem",
              marginBottom: 4,
            }}
          >
            Skill<span className="gradient-text">Swap</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Welcome back — sign in to your circle
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: "1rem",
          }}
          className="animate-fade-up"
        >
          <div
            style={{ flex: 1, height: 1, background: "var(--border-subtle)" }}
          />
          <span style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>
            or sign in with credentials
          </span>
          <div
            style={{ flex: 1, height: 1, background: "var(--border-subtle)" }}
          />
        </div>

        {/* Form */}
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
          <form onSubmit={submit}>
            <Input
              label="Email Address"
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
              placeholder="••••••••"
              icon="🔒"
              required
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="mt-2"
            >
              Sign In
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
            New here?{" "}
            <Link
              to="/register"
              style={{
                color: "var(--primary-light)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
