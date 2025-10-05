// src/pages/ResultsPage.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API_BASE = "https://new-backend-voting-app.vercel.app";

const ResultsPage = ({ token, userRole }) => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }

    const url =
      userRole === "admin"
        ? `${API_BASE}/admin/candidates`
        : `${API_BASE}/vote/candidates`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch: ${res.status} - ${text}`);
      }

      const data = await res.json();
      setCandidates(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [token, userRole]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Election Results
      </h2>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {!error && candidates.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={candidates}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes" fill="#4f46e5" name="Votes" />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="border p-4 rounded shadow text-center"
              >
                <img
                  src={candidate.imageUrl || "/default-candidate.png"}
                  alt={candidate.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <p className="font-bold">{candidate.name}</p>
                <p className="text-gray-600">{candidate.party}</p>
                <p className="text-gray-500">Votes: {candidate.votes || 0}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {!error && candidates.length === 0 && (
        <p className="text-center">No results yet.</p>
      )}
    </div>
  );
};

export default ResultsPage;
