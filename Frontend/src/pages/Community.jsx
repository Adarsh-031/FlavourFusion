import React, { useEffect, useState } from "react";
import { getCommunityRecipes, shareCommunityRecipe } from "../api";
import { Heart, Plus, MessageCircle, } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";


export default function Community() {
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    image: "",
    time: "",
    difficulty: "Easy",
    cuisine: "Indian",
    ingredients: "",
    instructions: "",
    calories: "",
    carbon: "",
  });

  useEffect(() => {
    (async () => {
      const res = await getCommunityRecipes();
      setRecipes(res.recipes || []);
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await shareCommunityRecipe(newRecipe);
    if (res.recipe) {
      toast.success("Recipe shared successfully!");
      setRecipes((prev) => [res.recipe, ...prev]);
      setShowForm(false);
    } else toast.error(res.error || "Failed to share recipe");
  };

  // Mock avatars for demo — replace with actual user data later
  const getAvatar = (authorId) => {
    const avatars = [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=2",
      "https://i.pravatar.cc/150?img=3",
      "https://i.pravatar.cc/150?img=4",
      "https://i.pravatar.cc/150?img=5",
    ];
    return avatars[parseInt(authorId?.slice(-1), 16) % avatars.length];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Community Recipes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          <Plus className="w-5 h-5" /> Share Recipe
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow mb-10"
        >
          <h2 className="text-2xl font-semibold mb-4">Submit Your Recipe</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="border p-2 rounded"
              placeholder="Name"
              value={newRecipe.name}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, name: e.target.value })
              }
            />
            <input
              className="border p-2 rounded"
              placeholder="Emoji (🍛)"
              value={newRecipe.image}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, image: e.target.value })
              }
            />
            <input
              className="border p-2 rounded"
              placeholder="Time (min)"
              value={newRecipe.time}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, time: e.target.value })
              }
            />
            <input
              className="border p-2 rounded"
              placeholder="Difficulty"
              value={newRecipe.difficulty}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, difficulty: e.target.value })
              }
            />
            <input
              className="border p-2 rounded"
              placeholder="Cuisine"
              value={newRecipe.cuisine}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, cuisine: e.target.value })
              }
            />
            <input
              className="border p-2 rounded"
              placeholder="Calories"
              value={newRecipe.calories}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, calories: e.target.value })
              }
            />
            <textarea
              className="border p-2 rounded col-span-2"
              placeholder="Ingredients (comma separated)"
              value={newRecipe.ingredients}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, ingredients: e.target.value })
              }
            />
            <textarea
              className="border p-2 rounded col-span-2"
              placeholder="Instructions (comma separated)"
              value={newRecipe.instructions}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, instructions: e.target.value })
              }
            />
          </div>
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      )}

      {/* Social feed layout */}
      <div className="grid md:grid-cols-3 gap-6">
        {recipes.map((r) => (
          <Link
            to={`/community/${r._id}`}
            key={r._id}
            className="block bg-white shadow rounded-xl p-5 hover:shadow-lg transition"
          >
            <div
              key={r._id}
              className="bg-white shadow rounded-xl p-5 hover:shadow-lg transition"
            >
              {/* Top bar – author info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatar(r.author?._id || r.author)}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {r.author?.name || "Anonymous Chef"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString()} •{" "}
                      {r.cuisine || "Cuisine"}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">⋮</button>
              </div>

              {/* Recipe Content */}
              <div className="text-center text-7xl">{r.image || "🍽️"}</div>
              <h3 className="text-xl font-bold text-center mt-2">{r.name}</h3>
              <p className="text-sm text-center text-gray-600 mb-2">
                {r.difficulty} • {r.time} min • {r.calories} kcal
              </p>

              {/* Interaction Bar */}
              <div className="flex justify-around mt-3 border-t pt-2 text-gray-600">
                <div className="flex items-center gap-2 cursor-pointer hover:text-red-500">
                  <Heart className="w-5 h-5" />
                  <span>{r.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
                  <MessageCircle className="w-5 h-5" />
                  <span>{r.comments?.length || 0}</span>
                </div>
              </div>

              {/* Optional: Preview one comment */}
              {r.comments && r.comments.length > 0 && (
                <div className="mt-3 bg-gray-50 rounded-lg p-2 text-sm">
                  <p className="text-gray-800">
                    <span className="font-semibold">
                      {r.comments[0].user?.name || "User"}:
                    </span>{" "}
                    {r.comments[0].text}
                  </p>
                </div>
              )}
            </div>
            </Link>
        ))}
          </div>
    </div>
      );
}
