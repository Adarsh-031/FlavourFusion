const express = require("express");
const ShoppingList = require("../models/ShoppingList");
const MealPlan = require("../models/MealPlan");
const { getCurrentWeek } = require("../utils/weekHelper");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get Shopping List
router.get("/", authenticateToken, async (req, res) => {
  try {
    let shoppingList = await ShoppingList.findOne({ userId: req.user.userId });
    if (!shoppingList) {
      shoppingList = new ShoppingList({ userId: req.user.userId, items: [] });
      await shoppingList.save();
    }
    res.json({ shoppingList });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Add Item
router.post("/items", authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    let shoppingList = await ShoppingList.findOne({ userId: req.user.userId });
    if (!shoppingList) shoppingList = new ShoppingList({ userId: req.user.userId, items: [] });

    shoppingList.items.push({ name, checked: false });
    shoppingList.updatedAt = Date.now();
    await shoppingList.save();

    res.json({ message: "Item added", shoppingList });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Toggle Item
router.patch("/items/:itemId/toggle", authenticateToken, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({ userId: req.user.userId });
    if (!shoppingList) return res.status(404).json({ error: "List not found" });

    const item = shoppingList.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.checked = !item.checked;
    shoppingList.updatedAt = Date.now();
    await shoppingList.save();

    res.json({ message: "Item toggled", shoppingList });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Delete Item
router.delete("/items/:itemId", authenticateToken, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({ userId: req.user.userId });
    if (!shoppingList) return res.status(404).json({ error: "List not found" });

    shoppingList.items.pull(req.params.itemId);
    shoppingList.updatedAt = Date.now();
    await shoppingList.save();

    res.json({ message: "Item deleted", shoppingList });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Generate from Meal Plan
router.post("/generate", authenticateToken, async (req, res) => {
  try {
    const { week } = req.body;
    const mealPlan = await MealPlan.findOne({
      userId: req.user.userId,
      week: week || getCurrentWeek(),
    }).populate("meals.$*");

    if (!mealPlan) return res.status(404).json({ error: "Meal plan not found" });

    const ingredients = new Set();
    for (const recipe of mealPlan.meals.values()) {
      if (recipe && recipe.ingredients) recipe.ingredients.forEach((i) => ingredients.add(i));
    }

    let shoppingList = await ShoppingList.findOne({ userId: req.user.userId });
    if (!shoppingList) shoppingList = new ShoppingList({ userId: req.user.userId, items: [] });

    ingredients.forEach((ingredient) => {
      const exists = shoppingList.items.some(
        (item) => item.name.toLowerCase() === ingredient.toLowerCase()
      );
      if (!exists) shoppingList.items.push({ name: ingredient, checked: false });
    });

    shoppingList.updatedAt = Date.now();
    await shoppingList.save();

    res.json({ message: "Shopping list generated", shoppingList });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
