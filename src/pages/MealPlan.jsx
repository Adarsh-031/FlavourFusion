import React, { useEffect, useState } from 'react';
import { getMealPlan, addMealToPlan, removeMealFromPlan, getRecipes } from '../api';
import { Plus, X } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner'];

export default function MealPlan() {
  const [week, setWeek] = useState(''); // optional; server defaults to current week
  const [plan, setPlan] = useState({}); // { "Monday-Breakfast": recipeObjOrId, ... }
  const [recipes, setRecipes] = useState([]);
  const [selecting, setSelecting] = useState(null); // { day, mealType } or null
  const [loading, setLoading] = useState(false);

  // load plan & recipes
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [mpRes, rRes] = await Promise.all([getMealPlan(), getRecipes()]);
      setPlan(mpRes.mealPlan?.meals || {});
      setRecipes(rRes.recipes || []);
      setLoading(false);
    })();
  }, []);

  const labelForCell = (value) => {
    // value could be a populated recipe object or an ID string
    if (!value) return '';
    if (typeof value === 'string') {
      // try to resolve name
      const r = recipes.find(rr => rr._id === value);
      return r ? r.name : `#${value.slice(-6)}`;
    }
    // object
    return value.name || (value._id ? `#${value._id.slice(-6)}` : 'Recipe');
  };

  const openSelect = (day, mealType) => setSelecting({ day, mealType });
  const closeSelect = () => setSelecting(null);

  const assignRecipe = async (recipeId) => {
    if (!selecting) return;
    const res = await addMealToPlan({
      recipeId,
      day: selecting.day,
      mealType: selecting.mealType,
      week: week || undefined,
    });
    setPlan(res.mealPlan.meals);
    closeSelect();
  };

  const removeRecipe = async (day, mealType) => {
    const res = await removeMealFromPlan(day, mealType, week || undefined);
    setPlan(res.mealPlan.meals);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Weekly Meal Plan</h1>
        {/* Optional: manual week input (server defaults if left blank) */}
        {/* <input className="border p-2 rounded" placeholder="YYYY-WW (optional)" value={week} onChange={(e)=>setWeek(e.target.value)} /> */}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-2">
              <div className="font-bold"></div>
              {DAYS.map((d) => (
                <div key={d} className="text-center font-bold">{d}</div>
              ))}

              {MEALS.map((meal) => (
                <React.Fragment key={meal}>
                  <div className="font-semibold">{meal}</div>
                  {DAYS.map((day) => {
                    const key = `${day}-${meal}`;
                    const value = plan[key];
                    return (
                      <div key={key} className="p-3 bg-white rounded border flex items-center justify-between">
                        {value ? (
                          <>
                            <span className="truncate">{labelForCell(value)}</span>
                            <button
                              onClick={() => removeRecipe(day, meal)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => openSelect(day, meal)}
                            className="text-orange-600 flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" /> Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recipe selector modal */}
      {selecting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Select Recipe for {selecting.day} — {selecting.mealType}
              </h2>
              <button onClick={closeSelect} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {recipes.map((r) => (
                <button
                  key={r._id}
                  onClick={() => assignRecipe(r._id)}
                  className="p-4 border rounded hover:border-orange-500 hover:bg-orange-50 text-left"
                >
                  <div className="text-3xl">{r.image || '🍽️'}</div>
                  <div className="font-semibold mt-1">{r.name}</div>
                  <div className="text-sm text-gray-500">{r.cuisine} • {r.difficulty} • {r.time}m</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
