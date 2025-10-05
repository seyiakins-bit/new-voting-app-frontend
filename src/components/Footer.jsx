// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-6 mt-10">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6 text-center md:text-left">
        
        {/* Branding */}
        <div>
          <h2 className="text-lg font-bold text-white">Voting App</h2>
          <p className="text-sm mt-2">
            A secure, transparent, and fair online voting platform.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-white mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/vote" className="hover:underline">Vote</Link></li>
            <li><Link to="/results" className="hover:underline">Results</Link></li>
            <li><Link to="/admin" className="hover:underline">Admin</Link></li>
          </ul>
        </div>

        {/* Contact / Info */}
        <div>
          <h3 className="font-semibold text-white mb-2">Get in Touch</h3>
          <p className="text-sm">Email: support@votingapp.com</p>
          <p className="text-sm">Phone: +123 456 789</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Voting App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
