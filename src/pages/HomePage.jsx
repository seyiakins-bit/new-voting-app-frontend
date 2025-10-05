// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState } from "react";
import ElectionCard from "../components/ElectionCard";
import votingVideo from "../assets/voting.mp4";

const HomePage = () => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(false);

  // Get user token from localStorage (voter/candidate token)
  const token = localStorage.getItem("token");

  const elections = [
    {
      id: 1,
      title: "Presidential Election 2025",
      startDate: "2025-10-01",
      endDate: "2025-10-10",
      electionDate: "2025-10-05",
      status: "active",
      description: "Vote wisely for your preferred candidate.",
      image: "/images/vote.jpg",
      candidates: [
        {
          name: "Peter Obi",
          image:
            "https://res.cloudinary.com/dlu8e511s/image/upload/v1759483217/Peter-Obi-2-1_ujcqsi.jpg",
        },
        {
          name: "Atiku Abubakar",
          image:
            "https://res.cloudinary.com/dlu8e511s/image/upload/v1759483178/-1x-1_uo5oja.webp",
        },
        {
          name: "Bola Ahmed Tinubu",
          image:
            "https://res.cloudinary.com/dlu8e511s/image/upload/v1759483202/Bola-tinubu_k7bo0f.jpg",
        },
      ],
    },
  ];

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) =>
          console.log("Autoplay issue:", error)
        );
      }
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="home-page p-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-blue-700">
          Welcome to the Voting App
        </h2>
        <p className="text-gray-600 mb-6">
          A secure, transparent, and fair platform to cast your vote online.
        </p>
      </section>

      {/* Active Elections Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-6 text-left">
          Active Elections
        </h3>

        {/* Instruction / Process Video */}
        <div className="relative w-full mb-6 overflow-hidden rounded-lg">
          <video
            ref={videoRef}
            src={votingVideo}
            className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] object-cover"
            loop
            playsInline
            autoPlay
            muted={muted}
          />

          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg shadow hover:bg-opacity-70 transition"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>

        {/* Election Cards */}
        {elections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                token={token} // ✅ pass token to ElectionCard
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No active elections at the moment.</p>
        )}
      </section>

      {/* How It Works Section */}
      <section className="text-center bg-gray-50 p-8 rounded">
        <h3 className="text-2xl font-semibold mb-6">How It Works</h3>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div>
            <h4 className="font-bold mb-2">1. Register/Login</h4>
            <p>Create an account to participate in elections.</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">2. Vote Securely</h4>
            <p>Choose your candidate safely and anonymously.</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">3. View Results</h4>
            <p>Check live results in real-time after voting.</p>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="text-center">
        <h3 className="text-2xl font-semibold mb-6">Quick Stats</h3>
        <div className="flex flex-col md:flex-row justify-center gap-12">
          <div>
            <p className="text-3xl font-bold">12</p>
            <p>Elections</p>
          </div>
          <div>
            <p className="text-3xl font-bold">250</p>
            <p>Voters</p>
          </div>
          <div>
            <p className="text-3xl font-bold">30</p>
            <p>Candidates</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
