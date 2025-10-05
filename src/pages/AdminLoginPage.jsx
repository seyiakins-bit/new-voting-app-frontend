import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("https://voting-app-backend-kz3fibs57-akinsulure-seyis-projects.vercel.app", {
        email,
        password,
      });

      const { token, user } = res.data;

      // ✅ Save token in localStorage (same key everywhere)
      localStorage.setItem("token", token);

      // ✅ Save user info if you need it later
      localStorage.setItem("user", JSON.stringify(user));

      if (onLogin) onLogin(token, user);

      // Redirect to admin dashboard
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-700 hover:bg-red-800"
          }`}
        >
          {loading ? "Logging in..." : "Admin Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
