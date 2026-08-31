import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./Landing.css"

/* ─── tiny hook: is element in viewport? ─── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

/* ─── Animated counter ─── */
const Counter = ({ to, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(t); }
      else setCount(start);
    }, 16);
    return () => clearInterval(t);
  }, [visible, to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── Floating skill pill ─── */
const FloatingPill = ({ label, icon, style }) => (
  <div style={{
    position: "absolute",
    display: "inline-flex", alignItems: "center", gap: 7,
    background: "rgba(15,15,28,0.85)",
    border: "1px solid rgba(108,71,255,0.35)",
    borderRadius: 100,
    padding: "8px 16px",
    backdropFilter: "blur(12px)",
    fontSize: "0.8rem", fontWeight: 600,
    fontFamily: "'Syne', sans-serif",
    color: "#c8c8e8",
    boxShadow: "0 4px 24px rgba(108,71,255,0.2)",
    whiteSpace: "nowrap",
    animation: "float 4s ease-in-out infinite",
    ...style,
  }}>
    <span>{icon}</span>{label}
  </div>
);

/* ─── Feature card ─── */
const FeatureCard = ({ icon, title, desc, delay, accent }) => {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `all 0.65s ease ${delay}`,
      background: "rgba(14,14,26,0.8)",
      border: `1px solid rgba(${accent},0.2)`,
      borderRadius: 20,
      padding: "2rem",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(${accent},0.08), transparent)`,
        pointerEvents: "none",
      }} />
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `rgba(${accent},0.15)`,
        border: `1px solid rgba(${accent},0.3)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.4rem", marginBottom: "1.25rem",
      }}>{icon}</div>
      <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 8, fontSize: "1.05rem" }}>{title}</h4>
      <p style={{ color: "#8888aa", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  );
};

/* ─── Step card ─── */
const StepCard = ({ num, title, desc, delay }) => {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `all 0.6s ease ${delay}`,
      display: "flex", gap: "1.25rem", alignItems: "flex-start",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #6c47ff, #ff6b35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem",
        boxShadow: "0 0 20px rgba(108,71,255,0.35)",
      }}>{num}</div>
      <div>
        <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 4 }}>{title}</h5>
        <p style={{ color: "#8888aa", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
};

/* ─── Testimonial ─── */
const TestiCard = ({ name, role, text, rating, delay }) => {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `all 0.6s ease ${delay}`,
      background: "rgba(14,14,26,0.8)",
      border: "1px solid rgba(108,71,255,0.18)",
      borderRadius: 18, padding: "1.5rem",
    }}>
      <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ color: i < rating ? "#fbbf24" : "#333355", fontSize: "0.9rem" }}>★</span>
        ))}
      </div>
      <p style={{ color: "#c8c8e8", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.25rem", fontStyle: "italic" }}>"{text}"</p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #6c47ff, #ff6b35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.8rem",
        }}>{name[0]}</div>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "0.85rem", fontFamily: "'Syne', sans-serif" }}>{name}</p>
          <p style={{ margin: 0, color: "#666688", fontSize: "0.75rem" }}>{role}</p>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN LANDING PAGE
══════════════════════════════════════════ */
const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div style={{ background: "#07070f", color: "#e8e8f0", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>

      {/* ════════════════════════════════
          NAVBAR
      ════════════════════════════════ */}
      <nav className={`landingNav ${scrolled ? "scrolled" : ""}`}>
        <div className="landingNavDiv">
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #6c47ff, #ff6b35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", boxShadow: "0 0 16px rgba(108,71,255,0.4)",
            }}>⇄</div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>
              Skill<span style={{ color: "#a08fff" }}>Swap</span>
              <span style={{ color: "#666688", fontSize: "0.6rem", letterSpacing: "0.15em", marginLeft: 4, verticalAlign: "middle" }}>CIRCLE</span>
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {[["Features", "features"], ["How It Works", "how"], ["Stats", "stats"], ["Testimonials", "testimonials"]].map(([label, id]) => (
              <span key={id} className="nav-link-l" onClick={() => scrollTo(id)}>{label}</span>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link to="/login" className="btn-ghost-l hide-mobile">Sign In</Link>
            <Link to="/register" className="btn-primary-l">
              Get Started <span>→</span>
            </Link>
            {/* Mobile hamburger */}
            <button
              className="hide-mobile"
              style={{ display: "none" }}
              onClick={() => setMenuOpen(!menuOpen)}
            >☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: "rgba(10,10,20,0.98)", borderBottom: "1px solid rgba(108,71,255,0.2)",
            padding: "1rem 5%",
          }}>
            {[["Features", "features"], ["How It Works", "how"], ["Stats", "stats"]].map(([label, id]) => (
              <p key={id} className="nav-link-l" onClick={() => scrollTo(id)} style={{ padding: "0.6rem 0", display: "block" }}>{label}</p>
            ))}
          </div>
        )}
      </nav>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
        padding: "120px 5% 80px",
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(108,71,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108,71,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "gridPulse 6s ease-in-out infinite",
        }} />

        {/* Glow orbs */}
        <div style={{
          position: "absolute", top: "15%", left: "8%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(108,71,255,0.18) 0%, transparent 70%)",
          animation: "orb1 12s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)",
          animation: "orb2 15s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Floating pills */}
        {/* <FloatingPill className="floating-pill" label="Guitar Lessons" icon="🎸" style={{ top: "22%", left: "4%", animationDelay: "0s" }} />
        <FloatingPill className="floating-pill" label="React Development" icon="⚛️" style={{ top: "35%", right: "3%", animationDuration: "5s", animationDelay: "1s" }} />
        <FloatingPill className="floating-pill" label="Graphic Design" icon="🎨" style={{ bottom: "30%", left: "2%", animationDuration: "4.5s", animationDelay: "0.5s" }} />
        <FloatingPill className="floating-pill" label="Spanish Language" icon="🇪🇸" style={{ bottom: "22%", right: "4%", animationDuration: "5.5s", animationDelay: "1.5s" }} />
        <FloatingPill className="floating-pill" label="Piano ✓ Verified" icon="🎹" style={{ top: "18%", right: "18%", animationDuration: "4s", animationDelay: "2s" }} /> */}

        {/* Hero content */}
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(108,71,255,0.12)", border: "1px solid rgba(108,71,255,0.3)",
            borderRadius: 100, padding: "6px 16px", marginBottom: "2rem",
            animation: "heroReveal 0.6s ease forwards",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6c47ff", boxShadow: "0 0 8px #6c47ff", display: "inline-block" }} />
            <span style={{ fontSize: "0.78rem", fontFamily: "'Syne', sans-serif", fontWeight: 600, color: "#a08fff", letterSpacing: "0.05em" }}>
              Skill-sharing economy, reimagined
            </span>
          </div>

          <h1 className="hero-title" style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 900,
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            lineHeight: 1.08, marginBottom: "1.5rem",
            animation: "heroReveal 0.7s ease 0.1s both",
          }}>
            Swap Skills,<br />
            <span className="gradient-text-l">Grow Together</span>
          </h1>

          <p className="hero-sub" style={{
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: "#8888aa", lineHeight: 1.75, maxWidth: 620, margin: "0 auto 2.5rem",
            animation: "heroReveal 0.7s ease 0.2s both",
          }}>
            SkillSwap Circle is a peer-to-peer skill exchange platform where you teach what you know,
            learn what you want — powered by <strong style={{ color: "#fbbf24" }}>SkillCoins</strong> and
            peer <strong style={{ color: "#a08fff" }}>verification</strong>.
          </p>

          {/* CTA buttons */}
          <div style={{
            display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
            animation: "heroReveal 0.7s ease 0.3s both",
            marginBottom: "3.5rem",
          }}>
            <Link to="/register" className="btn-primary-l" style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}>
              Start Swapping Free 🚀
            </Link>
            <Link to="/login" className="btn-outline-l" style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}>
              Sign In
            </Link>
          </div>

          {/* Social proof strip */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 24, flexWrap: "wrap",
            animation: "heroReveal 0.7s ease 0.4s both",
          }}>
            {/* Avatar stack */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex" }}>
                {["#6c47ff","#ff6b35","#22c55e","#f59e0b","#ec4899"].map((c, i) => (
                  <div key={i} style={{
                    width: 30, height: 30, borderRadius: "50%", background: c,
                    border: "2px solid #07070f", marginLeft: i === 0 ? 0 : -8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.65rem", fontWeight: 700,
                  }}>
                    {["A","R","K","P","S"][i]}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: "0.82rem", color: "#8888aa" }}>
                <strong style={{ color: "#e8e8f0" }}>1,200+</strong> members
              </span>
            </div>
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: "0.82rem", color: "#8888aa" }}>
              <strong style={{ color: "#fbbf24" }}>★ 4.8</strong> avg rating
            </span>
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: "0.82rem", color: "#8888aa" }}>
              <strong style={{ color: "#4ade80" }}>Free</strong> to join
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SKILL TAGS MARQUEE
      ════════════════════════════════ */}
      <div style={{ overflow: "hidden", padding: "0 0 60px", position: "relative" }}>
        <div style={{ display: "flex", gap: 10, animation: "none", overflowX: "auto", padding: "0 5%", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            ["🎸","Guitar"], ["⚛️","React"], ["🎨","Design"], ["🇪🇸","Spanish"],
            ["🎹","Piano"], ["📷","Photography"], ["🐍","Python"], ["✍️","Copywriting"],
            ["🎬","Video Editing"], ["🎺","Trumpet"], ["🌐","Web Dev"], ["🧠","ML/AI"],
            ["🎭","Acting"], ["📊","Data Analysis"], ["🖋️","Calligraphy"],
          ].map(([icon, label]) => (
            <span key={label} className="skill-tag">{icon} {label}</span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          HOW IT WORKS — mini demo
      ════════════════════════════════ */}
      <section id="how" style={{ padding: "80px 5%", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ fontSize: "0.72rem", fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "0.18em", color: "#666688", textTransform: "uppercase" }}>How It Works</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginTop: 12 }}>
            Exchange in <span className="gradient-text-l">4 simple steps</span>
          </h2>
        </div>

        <div className="steps-cta-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {[
              { num: "1", title: "List Your Skill", desc: "Add what you can teach — guitar, coding, design, languages, or anything else. Set your level and availability.", delay: "0s" },
              { num: "2", title: "Browse & Request", desc: "Explore skills others offer. Find someone with what you want and send them an exchange request.", delay: "0.1s" },
              { num: "3", title: "Swap & Learn", desc: "Accept the request, schedule a session, join the video room and start teaching each other.", delay: "0.2s" },
              { num: "4", title: "Earn & Verify", desc: "Claim SkillCoins after each session. Get peer-verified when 3+ reviewers confirm your expertise.", delay: "0.3s" },
            ].map((s) => <StepCard key={s.num} {...s} />)}
          </div>

          {/* Mock exchange card */}
          <div style={{ position: "relative" }}>
            <div style={{
              background: "rgba(14,14,26,0.9)",
              border: "1px solid rgba(108,71,255,0.25)",
              borderRadius: 24, padding: "2rem",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 60px rgba(108,71,255,0.15)",
            }}>
              <p style={{ fontSize: "0.72rem", fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "0.12em", color: "#666688", marginBottom: "1rem" }}>EXCHANGE REQUEST</p>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #6c47ff, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>A</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem", fontFamily: "'Syne', sans-serif" }}>Arjun Mehta</p>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#fbbf24", fontSize: "0.75rem" }}>★</span>)}
                    <span style={{ color: "#666688", fontSize: "0.72rem" }}>4.9 · 12 sessions</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center", marginBottom: "1.5rem" }}>
                <div style={{ background: "rgba(108,71,255,0.12)", border: "1px solid rgba(108,71,255,0.2)", borderRadius: 12, padding: "0.75rem", textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: "0.65rem", color: "#666688" }}>OFFERING</p>
                  <p style={{ margin: "4px 0 0", fontWeight: 700, fontFamily: "'Syne', sans-serif", fontSize: "0.9rem" }}>🎸 Guitar</p>
                  <span style={{ fontSize: "0.65rem", color: "#a08fff" }}>Expert</span>
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6c47ff, #ff6b35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", flexShrink: 0,
                }}>⇄</div>
                <div style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 12, padding: "0.75rem", textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: "0.65rem", color: "#666688" }}>WANTS</p>
                  <p style={{ margin: "4px 0 0", fontWeight: 700, fontFamily: "'Syne', sans-serif", fontSize: "0.9rem" }}>⚛️ React</p>
                  <span style={{ fontSize: "0.65rem", color: "#ff8f66" }}>Intermediate</span>
                </div>
              </div>

              <p style={{ color: "#8888aa", fontSize: "0.82rem", fontStyle: "italic", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                "Hey! I've been playing guitar for 8 years, happy to teach basics. Looking for React help for my portfolio site 🙏"
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-primary-l" style={{ flex: 1, justifyContent: "center" }}>✓ Accept</button>
                <button className="btn-ghost-l" style={{ justifyContent: "center" }}>Decline</button>
              </div>

              <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <span>🪙</span>
                <span style={{ fontSize: "0.8rem", color: "#fbbf24" }}>Both earn <strong>1 SkillCoin</strong> after session completes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURES
      ════════════════════════════════ */}
      <section id="features" style={{ padding: "80px 5%", background: "rgba(108,71,255,0.03)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ fontSize: "0.72rem", fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "0.18em", color: "#666688", textTransform: "uppercase" }}>Features</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginTop: 12 }}>
              Everything you need to <span className="gradient-text-l">exchange skills</span>
            </h2>
          </div>

          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            <FeatureCard icon="⇄" title="Skill-for-Skill Exchange" desc="No money involved. Trade your expertise directly — offer guitar lessons, receive coding help. Pure knowledge economy." accent="108,71,255" delay="0s" />
            <FeatureCard icon="🪙" title="SkillCoin Economy" desc="Start with 10 free SkillCoins. Earn more by completing exchanges. Use coins for requests when you don't have a matching skill." accent="245,158,11" delay="0.1s" />
            <FeatureCard icon="✓" title="Peer Verification" desc="Get verified when 3+ reviewers confirm your expertise. Verified skills earn more trust and more exchange requests." accent="34,197,94" delay="0.2s" />
            <FeatureCard icon="★" title="Trust & Reviews" desc="Rate and review every exchange. Reliability scores, no-show reporting, and transparent feedback keep quality high." accent="236,72,153" delay="0.3s" />
            <FeatureCard icon="🎥" title="Integrated Video Rooms" desc="Accepted exchanges automatically generate a room ID for your session. No external tools needed." accent="14,165,233" delay="0.4s" />
            <FeatureCard icon="⚡" title="Reliability Scores" desc="Your score goes up with good reviews, down with bad ones. No-shows hurt your score. Consistent teachers rise to the top." accent="255,107,53" delay="0.5s" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          STATS
      ════════════════════════════════ */}
      <section id="stats" style={{ padding: "80px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {[
              { value: 1200, suffix: "+", label: "Active Members", icon: "👥", color: "#a08fff" },
              { value: 4800, suffix: "+", label: "Skills Exchanged", icon: "⇄", color: "#ff8f66" },
              { value: 98, suffix: "%", label: "Satisfaction Rate", icon: "★", color: "#fbbf24" },
              { value: 15000, suffix: "+", label: "SkillCoins Earned", icon: "🪙", color: "#4ade80" },
            ].map(({ value, suffix, label, icon, color }) => (
              <div key={label} className="exchange-card" style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <p style={{ fontSize: "2rem", marginBottom: 8 }}>{icon}</p>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "2.5rem", color, margin: "0 0 6px" }}>
                  <Counter to={value} suffix={suffix} />
                </h3>
                <p style={{ color: "#8888aa", fontSize: "0.85rem", margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════ */}
      <section id="testimonials" style={{ padding: "80px 5%", background: "rgba(108,71,255,0.03)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ fontSize: "0.72rem", fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "0.18em", color: "#666688", textTransform: "uppercase" }}>Testimonials</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginTop: 12 }}>
              Loved by <span className="gradient-text-l">the circle</span>
            </h2>
          </div>
          <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            <TestiCard name="Riya Sharma" role="Frontend Developer" rating={5} delay="0s" text="I learned guitar basics in exchange for teaching React. The SkillCoin system is genius — I've already done 6 swaps and my verification badge got me 3x more requests." />
            <TestiCard name="Karan Patel" role="Music Teacher" rating={5} delay="0.1s" text="Never thought I'd learn Photoshop without paying for a course. Found a designer willing to swap for piano lessons. The video room made sessions seamless." />
            <TestiCard name="Ananya Singh" role="Data Analyst" rating={4} delay="0.2s" text="The reliability score system keeps quality high. I've had 8 exchanges and every person was serious and prepared. Way better than random meetup groups." />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          COIN EXPLAINER
      ════════════════════════════════ */}
      <section style={{ padding: "80px 5%" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(108,71,255,0.12), rgba(255,107,53,0.08))",
            border: "1px solid rgba(108,71,255,0.25)",
            borderRadius: 28, padding: "3rem",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.15), transparent)", pointerEvents: "none" }} />
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)" }}>
                The <span className="gradient-text-l">SkillCoin</span> Economy 🪙
              </h2>
              <p style={{ color: "#8888aa", marginTop: 10, fontSize: "0.95rem" }}>A fair, transparent currency for skill exchange</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
              {[
                { icon: "🎁", title: "10 Free on Join", desc: "Every new member starts with 10 coins, no catch." },
                { icon: "🔄", title: "+1 Per Session", desc: "Claim 1 coin after each accepted exchange session." },
                { icon: "⏳", title: "1hr Cooldown", desc: "Anti-abuse cooldown keeps the economy fair." },
                { icon: "🔒", title: "Coin Exchanges", desc: "No matching skill? Use coins to request directly." },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "1.8rem", marginBottom: 8 }}>{icon}</p>
                  <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 4, fontSize: "0.9rem" }}>{title}</h5>
                  <p style={{ color: "#8888aa", fontSize: "0.8rem", lineHeight: 1.5 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FINAL CTA
      ════════════════════════════════ */}
      <section style={{ padding: "80px 5% 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 100, padding: "5px 14px", marginBottom: "1.5rem",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 8px #22c55e" }} />
            <span style={{ fontSize: "0.78rem", fontFamily: "'Syne', sans-serif", fontWeight: 600, color: "#4ade80" }}>Free to join · No credit card needed</span>
          </div>

          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "1rem" }}>
            Ready to join<br />the <span className="gradient-text-l">circle?</span>
          </h2>
          <p style={{ color: "#8888aa", fontSize: "1rem", marginBottom: "2.5rem", lineHeight: 1.7 }}>
            Start with 10 free SkillCoins. List your first skill in under 2 minutes. Your next teacher is already waiting.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" className="btn-primary-l" style={{ padding: "1rem 2.5rem", fontSize: "1rem" }}>
              Create Free Account 🚀
            </Link>
            <Link to="/login" className="btn-outline-l" style={{ padding: "1rem 2.5rem", fontSize: "1rem" }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "2rem 5%",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6c47ff, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>⇄</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>SkillSwap Circle</span>
        </div>
        <p style={{ color: "#444466", fontSize: "0.78rem", margin: 0 }}>© 2025 SkillSwap Circle — Share skills, grow together.</p>
        <div style={{ display: "flex", gap: 20 }}>
          <Link to="/login" style={{ color: "#666688", fontSize: "0.8rem", textDecoration: "none" }}>Sign In</Link>
          <Link to="/register" style={{ color: "#666688", fontSize: "0.8rem", textDecoration: "none" }}>Register</Link>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
