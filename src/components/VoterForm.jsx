// src/components/VoterForm.jsx
import React, { useState } from "react";

const API_BASE = "https://new-backend-voting-app.vercel.app"; // your backend URL

const VoterForm = ({ onVerified }) => {
  const [formData, setFormData] = useState({
    name: "",
    voterId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/vote/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Verification failed: ${text}`);
      }

      const data = await res.json(); // e.g., { token: "...", voterId: "123" }

      // Notify parent that verification succeeded
      onVerified(data);

      // Reset form
      setFormData({ name: "", voterId: "" });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Voter Verification</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-3"
        required
        disabled={loading}
      />
      <input
        type="text"
        name="voterId"
        placeholder="Voter ID"
        value={formData.voterId}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-3"
        required
        disabled={loading}
      />

      <button
        type="submit"
        className={`w-full py-2 rounded ${
          loading ? "bg-gray-400" : "bg-blue-700 hover:bg-green-600 text-white"
        }`}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify & Proceed"}
      </button>
    </form>
  );
};

export default VoterForm;
