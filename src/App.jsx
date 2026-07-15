import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ExploreSkills from "./pages/skills/ExploreSkills";
import SkillDetails from "./pages/skills/SkillDetails";
import AddSkill from "./pages/skills/AddSkill";
import MySkills from "./pages/skills/MySkills";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import Requests from "./pages/exchange/Requests";
import RequestDetails from "./pages/exchange/RequestDetails";
import Reviews from "./pages/reviews/Reviews";
import Coins from "./pages/wallet/Coins";
import Verify from "./pages/verification/Verify";

import "./assets/style.css";

/* ── Protected layout: requires auth ── */
const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(108,71,255,0.2)", borderTop: "3px solid var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "hidden" }}>
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main style={{ flex: 1, position: "relative", zIndex: 1 }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

/* ── Guest layout: redirects to dashboard if already logged in ── */
const GuestLayout = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public landing page — always accessible */}
          <Route path="/" element={<Landing />} />

          {/* Auth pages — redirect away if already logged in */}
          <Route element={<GuestLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected app pages — require login */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/skills" element={<ExploreSkills />} />
            <Route path="/skills/my" element={<MySkills />} />
            <Route path="/skills/add" element={<AddSkill />} />
            <Route path="/skills/:id" element={<SkillDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/exchange" element={<Requests />} />
            <Route path="/exchange/:id" element={<RequestDetails />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/wallet" element={<Coins />} />
            <Route path="/verify" element={<Verify />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;