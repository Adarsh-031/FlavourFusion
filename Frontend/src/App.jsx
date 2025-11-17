import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedPage from "./components/ProtectedPage";

import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetails from "./pages/RecipeDetails";
import CommunityRecipeDetails from "./pages/CommunityRecipeDetails";
import MealPlan from "./pages/MealPlan";
import Pantry from "./pages/Pantry";
import ShoppingList from "./pages/ShoppingList";
import Community from "./pages/Community";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import { getCurrentUser } from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getCurrentUser(token);
        if (res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem("token");
          toast.error("Session expired. Please log in again.");
        }
      } catch (err) {
        console.error("Session restore failed:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading your kitchen...
      </div>
    );

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />


        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedPage user={user}>
              <Dashboard user={user} />
            </ProtectedPage>
          }
        />

        <Route
          path="/mealplan"
          element={
            <ProtectedPage user={user}>
              <MealPlan />
            </ProtectedPage>
          }
        />
        <Route
          path="/pantry"
          element={
            <ProtectedPage user={user}>
              <Pantry />
            </ProtectedPage>
          }
        />
        <Route
          path="/shopping"
          element={
            <ProtectedPage user={user}>
              <ShoppingList />
            </ProtectedPage>
          }
        />
        <Route path="/community/:id" element={<CommunityRecipeDetails />} />
        <Route
          path="/community"
          element={
            <ProtectedPage user={user}>
              <Community user={user} />
            </ProtectedPage>
          }
        />

        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
}
