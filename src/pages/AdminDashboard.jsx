import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const [candidateRes, votersRes] = await Promise.all([
        axios.get("https://voting-app-backend-kz3fibs57-akinsulure-seyis-projects.vercel.app", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://voting-app-backend-kz3fibs57-akinsulure-seyis-projects.vercel.app", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCandidates(candidateRes.data || []);

      // Generate voter IDs if missing
      const updatedVoters = (votersRes.data || []).map((v) => ({
        ...v,
        voterId:
          v.voterId ||
          `VOTER-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      }));
      setVoters(updatedVoters);
    } catch (err) {
      console.error("Admin fetch error:", err);
      setError(err.response?.data?.error || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-600">Loading dashboard...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Refresh button */}
      <button
        onClick={fetchAdminData}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Refresh Data
      </button>

      {/* Candidates Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Candidates</h3>
        {candidates.length > 0 ? (
          <ul className="list-disc list-inside">
            {candidates.map((c) => (
              <li key={c.id}>
                <span className="font-medium">{c.user?.name || c.name}</span>{" "}
                ({c.party || "N/A"}) - Votes:{" "}
                <span className="font-bold">{c.votes || 0}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No candidates found.</p>
        )}
      </div>

      {/* Voters Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Voters</h3>
        {voters.length > 0 ? (
          <ul className="list-disc list-inside">
            {voters.map((v) => (
              <li key={v.id}>
                <span className="font-medium">{v.name}</span> - {v.email} -{" "}
                <span className="italic">Voter ID: {v.voterId}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No voters found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
