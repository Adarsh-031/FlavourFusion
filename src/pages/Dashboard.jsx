import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMealPlan, getPantry, getShoppingList } from "../api";
import { Utensils, ShoppingCart, BookOpen, Users } from "lucide-react";

export default function Dashboard({ user }) {
  const [mealPlan, setMealPlan] = useState(null);
  const [pantry, setPantry] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const mealData = await getMealPlan();
        const pantryData = await getPantry();
        const shoppingData = await getShoppingList();

        setMealPlan(mealData.mealPlan);
        setPantry(pantryData.pantry?.items || []);
        setShoppingList(shoppingData.shoppingList?.items || []);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center text-gray-600">
        <h2 className="text-3xl font-bold mb-2">Login to Access Dashboard</h2>
        <p className="mb-6">You need to be logged in to view your personalized data.</p>
        <Link
          to="/login"
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6">
        Welcome back, <span className="text-orange-500">{user.name}</span> 👋
      </h1>
      <p className="text-gray-600 mb-10">
        Here’s a snapshot of your cooking life today.
      </p>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="This Week’s Meals"
          value={mealPlan ? Object.keys(mealPlan.meals || {}).length : 0}
          icon={<Utensils className="w-8 h-8 text-orange-500" />}
          link="/mealplan"
        />
        <StatCard
          title="Pantry Items"
          value={pantry.length}
          icon={<BookOpen className="w-8 h-8 text-green-500" />}
          link="/pantry"
        />
        <StatCard
          title="Shopping List"
          value={shoppingList.length}
          icon={<ShoppingCart className="w-8 h-8 text-blue-500" />}
          link="/shopping"
        />
      </div>

      {/* Quick Links */}
      <h2 className="text-2xl font-semibold mb-6">Quick Links</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <QuickLink
          to="/recipes"
          icon="🍲"
          title="Explore Recipes"
          color="bg-orange-100"
        />
        <QuickLink
          to="/community"
          icon="👩‍🍳"
          title="Community"
          color="bg-pink-100"
        />
        <QuickLink
          to="/mealplan"
          icon="🗓️"
          title="Meal Planner"
          color="bg-yellow-100"
        />
        <QuickLink
          to="/contact"
          icon="📩"
          title="Contact Us"
          color="bg-blue-100"
        />
      </div>
    </div>
  );
}

// ========== Components ==========

function StatCard({ title, value, icon, link }) {
  return (
    <Link
      to={link}
      className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 flex items-center justify-between"
    >
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      {icon}
    </Link>
  );
}

function QuickLink({ to, icon, title, color }) {
  return (
    <Link
      to={to}
      className={`${color} p-6 rounded-xl shadow hover:shadow-lg flex flex-col items-center justify-center transition`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h4 className="font-semibold text-gray-700">{title}</h4>
    </Link>
  );
}
