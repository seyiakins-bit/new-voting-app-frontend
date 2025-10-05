import React, { useEffect, useState } from "react";
import CandidateCard from "../components/CandidateCard";
import VoterForm from "../components/VoterForm";

const API_BASE = "https://new-backend-voting-app.vercel.app";

const VotingPage = () => {
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCandidates = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/vote/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch candidates: ${res.status} - ${text}`);
      }

      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (verified) fetchCandidates();
  }, [verified, token]);

  const handleVoterVerified = (data) => {
    setToken(data.token || "");
    localStorage.setItem("token", data.token || "");
    setVerified(true);
  };

  const handleVote = async (candidate) => {
    if (!token) {
      alert("No voter token found. Please verify first.");
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
      alert(`You voted for ${candidate.name} (${candidate.party})`);

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidate.id ? { ...c, votes: data.votes } : c
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="text-center p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Cast Your Vote</h2>

      {!verified ? (
        <VoterForm onVerified={handleVoterVerified} />
      ) : loading ? (
        <p className="text-gray-600">Loading candidates...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : candidates.length === 0 ? (
        <p className="text-gray-600">No candidates available</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onVote={() => handleVote(candidate)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VotingPage;
