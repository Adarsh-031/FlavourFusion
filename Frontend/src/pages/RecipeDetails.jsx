import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../api";
import { Clock, Star, Leaf, TrendingUp } from "lucide-react";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getRecipeById(id);
      setRecipe(res.recipe || null);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!recipe)
    return <p className="text-center py-10 text-gray-500">Recipe not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="text-8xl text-center py-10 bg-linear-to-br from-orange-100 to-red-100">
          {recipe.image || "🍽️"}
        </div>
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{recipe.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {recipe.time} min
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> {recipe.difficulty}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" /> {recipe.rating}
            </span>
            <span className="flex items-center gap-1">
              <Leaf className="w-4 h-4 text-green-500" /> {recipe.carbon} kg CO₂
            </span>
          </div>

          <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-semibold mb-3">Instructions</h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
