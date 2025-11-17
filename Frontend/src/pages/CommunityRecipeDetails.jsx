import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommunityRecipeById } from "../api";
import { Clock, Heart, MessageCircle, TrendingUp } from "lucide-react";

export default function CommunityRecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getCommunityRecipeById(id);
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
        <div className="text-8xl text-center py-10 bg-linear-to-br from-yellow-100 to-orange-100">
          {recipe.image || "🍽️"}
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-4xl font-bold">{recipe.name}</h1>
            <div className="text-sm text-gray-600">
              Shared by{" "}
              <span className="font-semibold">
                {recipe.author?.name || "Anonymous Chef"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {recipe.time} min
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> {recipe.difficulty}
            </span>
            <span className="flex items-center gap-1 text-red-500">
              <Heart className="w-4 h-4" /> {recipe.likes?.length || 0}
            </span>
            <span className="flex items-center gap-1 text-blue-500">
              <MessageCircle className="w-4 h-4" />{" "}
              {recipe.comments?.length || 0}
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

          {recipe.comments && recipe.comments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Top Comment</h3>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-700">
                <strong>{recipe.comments[0].user?.name || "User"}:</strong>{" "}
                {recipe.comments[0].text}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
