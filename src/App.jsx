import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import VotingPage from "./pages/VotingPage";
import ResultsPage from "./pages/ResultsPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  // Auth state
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  // Login handler (voter/admin)
  const handleLogin = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Voting handler
  const handleVote = (candidate) => {
    console.log("Voted for:", candidate);
    alert(`You voted for ${candidate.user.name}!`);
  };

  return (
    <BrowserRouter>
      <Header token={token} user={user} onLogout={handleLogout} />
      <main className="min-h-[80vh] p-4">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />

          {/* Voter Login/Register */}
          <Route
            path="/login"
            element={
              token && user?.role === "VOTER" ? <Navigate to="/vote" /> : <LoginPage onLogin={handleLogin} />
            }
          />
          <Route
            path="/register"
            element={
              token && user?.role === "VOTER" ? <Navigate to="/vote" /> : <RegisterPage onLogin={handleLogin} />
            }
          />

          {/* Admin Login */}
          <Route
            path="/admin/login"
            element={
              token && user?.role === "ADMIN" ? <Navigate to="/admin" /> : <AdminLoginPage onLogin={handleLogin} />
            }
          />

          {/* Protected Voter Routes */}
          <Route
            path="/vote"
            element={token && user?.role === "VOTER" ? <VotingPage token={token} onVote={handleVote} /> : <Navigate to="/login" />}
          />
          <Route
            path="/results"
            element={token ? <ResultsPage token={token} /> : <Navigate to="/login" />}
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={token && user?.role === "ADMIN" ? <AdminDashboard token={token} /> : <Navigate to="/admin/login" />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
