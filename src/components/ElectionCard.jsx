// src/components/ElectionCard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- IMPORTANT
import VoteButton from "./VoteButton";

const API_BASE = "https://voting-app-backend-kz3fibs57-akinsulure-seyis-projects.vercel.app"; // backend URL

const ElectionCard = ({ election, token: propToken }) => {
  const isActive = election.status === "active";
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);

    const token = propToken || localStorage.getItem("token");
    if (!token) {
      setError("No token found. Showing default candidates.");
      setLoading(false);
      return; // fallback will use election.candidates
    }

    try {
      const res = await fetch(
        `${API_BASE}/vote/candidates?electionId=${election.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch candidates: ${text}`);
      }

      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error(err);
      setError("Could not fetch live candidates. Showing default candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isActive) fetchCandidates();
  }, [election.id]);

  const handleVote = async (candidate) => {
    const token = propToken || localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ candidateId: candidate.id }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to vote: ${text}`);
      }

      const data = await res.json();
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidate.id ? { ...c, votes: data.votes } : c
        )
      );

      return data.votes;
    } catch (err) {
      console.error(err);
      alert(err.message);
      throw err;
    }
  };

  const displayedCandidates =
    candidates.length > 0 ? candidates : election.candidates || [];

  return (
    <div className="border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition bg-white overflow-hidden">
      {election.image && (
        <img
          src={election.image}
          alt={election.title}
          className="w-full h-90 object-cover"
        />
      )}

      <div className="p-6">
        <h4 className="text-xl font-bold mb-2 text-blue-700">{election.title}</h4>

        <p className="text-gray-600 text-sm">
          <span className="font-semibold">Start:</span>{" "}
          {new Date(election.startDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-semibold">End:</span>{" "}
          {new Date(election.endDate).toLocaleDateString()}
        </p>

        {election.electionDate && (
          <p className="text-gray-600 text-sm mb-3">
            <span className="font-semibold">Election Day:</span>{" "}
            {new Date(election.electionDate).toLocaleDateString()}
          </p>
        )}

        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
          }`}
        >
          {election.status.toUpperCase()}
        </span>

        {election.description && (
          <p className="mt-3 text-gray-700 text-sm">{election.description}</p>
        )}

        {/* Candidates */}
        {loading ? (
          <p className="text-gray-600 mt-4">Loading candidates...</p>
        ) : displayedCandidates.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-6">
            {displayedCandidates.slice(0, 3).map((c, idx) => (
              <div key={c.id || idx} className="flex flex-col items-center text-center">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-20 h-20 rounded-full border-2 border-white shadow-md object-cover mb-2"
                />
                <p className="text-sm font-medium text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-600">{c.votes || 0} votes</p>
                {isActive && <VoteButton candidate={c} onVote={handleVote} />}
              </div>
            ))}
            {displayedCandidates.length > 3 && (
              <div className="flex items-center justify-center text-sm font-semibold text-gray-700">
                +{displayedCandidates.length - 3} more
              </div>
            )}
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No candidates available</p>
        )}

        {isActive && (
          <button
            onClick={() => navigate(`/vote/${election.id}`)}
            className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Vote Now
          </button>
        )}
      </div>
    </div>
  );
};

export default ElectionCard;
