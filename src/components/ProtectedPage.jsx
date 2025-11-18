// src/components/ProtectedPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProtectedPage({ user, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Please login to continue");
      const timeout = setTimeout(() => navigate("/login"), 1500);
      return () => clearTimeout(timeout);
    }
  }, [user, navigate]);

  // Optionally show placeholder while redirecting
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
        <p className="text-lg font-medium mb-2">🔒 Access restricted</p>
        <p>Please login to continue.</p>
      </div>
    );
  }

  return children;
}
