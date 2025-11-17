const express = require("express");
const MealPlan = require("../models/MealPlan");
const Recipe = require("../models/Recipe");
const authenticateToken = require("../middleware/authMiddleware");
const { getCurrentWeek } = require("../utils/weekHelper");

const router = express.Router();

// Get Meal Plan for Current Week
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { week } = req.query;
    const mealPlan = await MealPlan.findOne({
      userId: req.user.userId,
      week: week || getCurrentWeek(),
    }).populate("meals.$*");

    res.json({ mealPlan: mealPlan || { meals: {} } });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Save or Update Meal Plan
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { week, meals } = req.body;
    let mealPlan = await MealPlan.findOne({
      userId: req.user.userId,
      week: week || getCurrentWeek(),
    });

    if (mealPlan) {
      mealPlan.meals = meals;
      mealPlan.updatedAt = Date.now();
    } else {
      mealPlan = new MealPlan({
        userId: req.user.userId,
        week: week || getCurrentWeek(),
        meals,
      });
    }

    await mealPlan.save();
    res.json({ message: "Meal plan saved successfully", mealPlan });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Add Recipe to Meal Plan
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { recipeId, day, mealType, week } = req.body;

    let mealPlan = await MealPlan.findOne({
      userId: req.user.userId,
      week: week || getCurrentWeek(),
    });

    if (!mealPlan) {
      mealPlan = new MealPlan({
        userId: req.user.userId,
        week: week || getCurrentWeek(),
        meals: new Map(),
      });
    }

    const key = `${day}-${mealType}`;
    mealPlan.meals.set(key, recipeId);
    mealPlan.updatedAt = Date.now();

    await mealPlan.save();
    res.json({ message: "Recipe added to meal plan", mealPlan });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Remove Recipe from Meal Plan
router.delete("/remove", authenticateToken, async (req, res) => {
  try {
    const { day, mealType, week } = req.query;

    const mealPlan = await MealPlan.findOne({
      userId: req.user.userId,
      week: week || getCurrentWeek(),
    });

    if (!mealPlan) return res.status(404).json({ error: "Meal plan not found" });

    const key = `${day}-${mealType}`;
    mealPlan.meals.delete(key);
    mealPlan.updatedAt = Date.now();

    await mealPlan.save();
    res.json({ message: "Recipe removed from meal plan", mealPlan });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
