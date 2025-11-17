const API_URL = import.meta.env.VITE_API_URL;

// ---------- AUTH HEADER HELPER ----------
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------- AUTH ----------
export const register = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const login = async (credentials) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json();
};

//RESTORES USER USING TOKEN (for persistent login)
export async function getCurrentUser(token) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return await res.json();
}

// ---------- RECIPES ----------
export const getRecipes = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const url = params.toString()
    ? `${API_URL}/recipes?${params}`
    : `${API_URL}/recipes`;

  const res = await fetch(url);
  return res.json();
};

export const getRecipeById = async (id) => {
  const res = await fetch(`${API_URL}/recipes/${id}`);
  return res.json();
};

// ---------- MEAL PLAN ----------
export const getMealPlan = async (week) => {
  const url = week
    ? `${API_URL}/mealplan?week=${encodeURIComponent(week)}`
    : `${API_URL}/mealplan`;
  const res = await fetch(url, { headers: getAuthHeader() });
  return res.json();
};

export const addMealToPlan = async (body) => {
  const res = await fetch(`${API_URL}/mealplan/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(body),
  });
  return res.json();
};

export const removeMealFromPlan = async (day, mealType, week) => {
  const params = new URLSearchParams({ day, mealType });
  if (week) params.set("week", week);
  const res = await fetch(`${API_URL}/mealplan/remove?${params.toString()}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  return res.json();
};

// ---------- PANTRY ----------
export const getPantry = async () => {
  const res = await fetch(`${API_URL}/pantry`, { headers: getAuthHeader() });
  return res.json();
};

export const addPantryItem = async (item) => {
  const res = await fetch(`${API_URL}/pantry/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(item),
  });
  return res.json();
};

export const updatePantryItem = async (id, updates) => {
  const res = await fetch(`${API_URL}/pantry/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(updates),
  });
  return res.json();
};

export const deletePantryItem = async (id) => {
  const res = await fetch(`${API_URL}/pantry/items/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  return res.json();
};

// ---------- SHOPPING LIST ----------
export const getShoppingList = async () => {
  const res = await fetch(`${API_URL}/shopping-list`, {
    headers: getAuthHeader(),
  });
  return res.json();
};

export const addShoppingItem = async (item) => {
  const res = await fetch(`${API_URL}/shopping-list/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(item),
  });
  return res.json();
};

export const toggleShoppingItem = async (id) => {
  const res = await fetch(`${API_URL}/shopping-list/items/${id}/toggle`, {
    method: "PATCH",
    headers: getAuthHeader(),
  });
  return res.json();
};

export const deleteShoppingItem = async (id) => {
  const res = await fetch(`${API_URL}/shopping-list/items/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  return res.json();
};

export const generateShoppingList = async (week) => {
  const body = week ? { week } : {};
  const res = await fetch(`${API_URL}/shopping-list/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(body),
  });
  return res.json();
};

// ---------- COMMUNITY RECIPES (USER SHARING) ----------
export const shareRecipe = async (recipeData) => {
  const res = await fetch(`${API_URL}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(recipeData),
  });
  return res.json();
};

export const likeRecipe = async (id) => {
  const res = await fetch(`${API_URL}/recipes/${id}/like`, {
    method: "POST",
    headers: getAuthHeader(),
  });
  return res.json();
};

export const addRecipeComment = async (id, text) => {
  const res = await fetch(`${API_URL}/recipes/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ text }),
  });
  return res.json();
};

// ---------- COMMUNITY RECIPES ----------
export const getCommunityRecipes = async () => {
  const res = await fetch(`${API_URL}/community`);
  return res.json();
};

export const shareCommunityRecipe = async (recipeData) => {
  const res = await fetch(`${API_URL}/community`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(recipeData),
  });
  return res.json();
};

export const likeCommunityRecipe = async (id) => {
  const res = await fetch(`${API_URL}/community/${id}/like`, {
    method: "POST",
    headers: getAuthHeader(),
  });
  return res.json();
};

export const addCommunityComment = async (id, text) => {
  const res = await fetch(`${API_URL}/community/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ text }),
  });
  return res.json();
};

export const getCommunityRecipeById = async (id) => {
  const res = await fetch(`${API_URL}/community/${id}`);
  return res.json();
};
