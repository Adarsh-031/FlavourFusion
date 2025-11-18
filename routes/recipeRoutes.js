const express = require("express");
const Recipe = require("../models/Recipe"); // ✅ Company recipes only
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// ---------- GET ALL COMPANY RECIPES ----------
router.get("/", async (req, res) => {
  try {
    const { search, cuisine, difficulty } = req.query;
    const query = { verified: true }; // ✅ Only company-added recipes

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { ingredients: { $regex: search, $options: "i" } },
      ];
    }

    if (cuisine && cuisine !== "All") query.cuisine = cuisine;
    if (difficulty && difficulty !== "All") query.difficulty = difficulty;

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.json({ recipes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ---------- GET COMPANY RECIPE BY ID ----------
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      verified: true,
    });

    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    res.json({ recipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
