import React, { useState, useEffect } from "react";

const VoteButton = ({ candidate, onVote }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [votes, setVotes] = useState(candidate.votes || 0);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    setVotes(candidate.votes || 0); // keep votes synced with parent
  }, [candidate.votes]);

  const handleConfirm = async () => {
    try {
      const newVoteCount = await onVote(candidate); // parent returns updated votes
      setVotes(newVoteCount);
      setVoted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit vote. Try again.");
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        className={`px-4 py-2 rounded-lg transition ${
          voted
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        onClick={() => setIsOpen(true)}
        disabled={voted}
      >
        {voted ? "Voted" : "Vote"}
      </button>

      <p className="mt-2 text-gray-600">Votes: {votes}</p>

      {isOpen && !voted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Your Vote</h2>
            <p className="mb-4">
              Are you sure you want to vote for{" "}
              <span className="font-semibold">{candidate.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={handleConfirm}
              >
                Yes, Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoteButton;
