import React from "react";
import { Link } from "react-router-dom";

export default function Home({ user }) {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-linear-to-br from-fuchsia-800 via-orange-400 to-pink-300 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-6">Cook Smarter, Eat Better</h1>
          <p className="text-xl mb-8">
            Your AI-powered companion for delicious meals, smart planning, and sustainable cooking.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/recipes"
              className="px-8 py-3 bg-white text-orange-500 rounded-lg font-bold text-lg hover:bg-orange-50 transition"
            >
              Explore Recipes
            </Link>

            <Link
              to={user ? "/dashboard" : "/login"} // 🧠 if logged in, skip login
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-orange-500 transition"
            >
              {user ? "Go to Dashboard" : "Get Started"}
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why FlavorFusion?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="🎯"
            title="Smart Meal Planning"
            description="AI-powered weekly meal plans based on your preferences, dietary needs, and pantry inventory."
            link="/mealplan"
          />
          <FeatureCard
            icon="🛒"
            title="Auto Shopping Lists"
            description="Generate shopping lists automatically from your meal plans and track what you already have."
            link="/shopping"
          />
          <FeatureCard
            icon="🌱"
            title="Sustainability Tracking"
            description="Monitor your carbon footprint and reduce food waste with smart ingredient substitutions."
            link="/community"
          />
        </div>
      </div>
    </div>
  );
}

// Reusable Feature Card with clickable link
const FeatureCard = ({ icon, title, description, link }) => (
  <Link
    to={link}
    className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition text-center block"
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Link>
);
