import React from "react";
import VoteButton from "./VoteButton";

const CandidateCard = ({ candidate, onVote }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition">
      <img
        src={candidate.imageUrl || "/default-candidate.png"}
        alt={candidate.name}
        className="w-full h-40 object-cover rounded mb-2"
      />
      <h3 className="text-xl font-bold text-blue-700">{candidate.name}</h3>
      <p className="text-gray-600 mb-2">Party: {candidate.party}</p>

      {/* Pass onVote callback to update vote count */}
      <VoteButton candidate={candidate} onVote={onVote} />
    </div>
  );
};

export default CandidateCard;
