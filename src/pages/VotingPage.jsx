// src/pages/VotingPage.jsx
import React, { useEffect, useState } from "react";
import CandidateCard from "../components/CandidateCard";
import VoterForm from "../components/VoterForm";

const API_BASE = "https://voting-app-backend-kz3fibs57-akinsulure-seyis-projects.vercel.app"; // your backend URL

const VotingPage = ({ token }) => {
  const [verified, setVerified] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch candidates from backend
  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/vote/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch: ${res.status} - ${text}`);
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
  }, [verified]);

  // Handle voter verification
  const handleVoterSubmit = (formData) => {
    console.log("Voter verified:", formData);
    setVerified(true);
  };

  // Handle vote submission
  const handleVote = async (candidate) => {
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

      alert(`You voted for ${candidate.name} (${candidate.party})`);

      // Refresh candidate list (or just vote counts if available)
      fetchCandidates();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="text-center p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Cast Your Vote</h2>

      {!verified ? (
        <VoterForm onSubmit={handleVoterSubmit} />
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
