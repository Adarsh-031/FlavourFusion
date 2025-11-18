import React, { useEffect, useState } from "react";
import { getRecipes } from "../api";
import { Link } from "react-router-dom";
import { Clock, Flame, Utensils } from "lucide-react";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getRecipes();
      setRecipes(res.recipes || []);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading delicious dishes...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-orange-600">
        🍴 Company Recipes
      </h1>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-500">No recipes available yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {recipes.map((r) => (
            <Link
              to={`/recipes/${r._id}`}
              key={r._id}
              className="bg-white shadow-md hover:shadow-lg rounded-2xl p-5 transition transform hover:-translate-y-1"
            >
              <div className="text-center text-7xl">{r.image || "🍽️"}</div>
              <h3 className="text-xl font-bold text-center mt-3 mb-2 text-gray-800">
                {r.name}
              </h3>
              <p className="text-center text-sm text-gray-600 mb-4">
                {r.cuisine} • {r.difficulty}
              </p>

              <div className="flex justify-around text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {r.time} min
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4" /> {r.calories} kcal
                </div>
                <div className="flex items-center gap-1">
                  <Utensils className="w-4 h-4" /> {r.rating.toFixed(1)}⭐
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
