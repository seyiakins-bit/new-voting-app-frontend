import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VoteButton from "./VoteButton";

const API_BASE = "https://new-backend-voting-app.vercel.app";

const ElectionCard = ({ election, token }) => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState(election.candidates || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isActive = election.status === "active";

  const fetchCandidates = async () => {
    if (!token) {
      setError("No token found. Showing default candidates.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/vote/candidates?electionId=${election.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
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
      setCandidates(election.candidates || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isActive) fetchCandidates();
  }, [election.id, token, isActive]);

  const handleVote = async (candidate) => {
    if (!token) {
      alert("No token found. Please verify first.");
      throw new Error("No token");
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

        {loading ? (
          <p className="text-gray-600 mt-4">Loading candidates...</p>
        ) : candidates.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-6">
            {candidates.slice(0, 3).map((c, idx) => (
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
            {candidates.length > 3 && (
              <div className="flex items-center justify-center text-sm font-semibold text-gray-700">
                +{candidates.length - 3} more
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
