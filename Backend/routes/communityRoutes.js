const express = require("express");
const CommunityRecipe = require("../models/CommunityRecipe");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// ---------- GET ALL COMMUNITY RECIPES ----------
router.get("/", async (req, res) => {
  try {
    const recipes = await CommunityRecipe.find()
      .populate("author", "name")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });
    res.json({ recipes });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ---------- SHARE A NEW COMMUNITY RECIPE ----------
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      name,
      image,
      time,
      difficulty,
      cuisine,
      ingredients,
      instructions,
      calories,
      carbon,
    } = req.body;

    const newRecipe = new CommunityRecipe({
      name,
      image,
      time,
      difficulty,
      cuisine,
      calories,
      carbon,
      author: req.user.userId,
      ingredients: ingredients.split(",").map((i) => i.trim()),
      instructions: instructions.split(",").map((i) => i.trim()),
    });

    await newRecipe.save();
    res.status(201).json({ message: "Recipe shared successfully!", recipe: newRecipe });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ---------- LIKE / UNLIKE ----------
router.post("/:id/like", authenticateToken, async (req, res) => {
  try {
    const recipe = await CommunityRecipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const userId = req.user.userId;
    const alreadyLiked = recipe.likes.includes(userId);

    if (alreadyLiked) recipe.likes.pull(userId);
    else recipe.likes.push(userId);

    await recipe.save();
    res.json({
      message: alreadyLiked ? "Unliked recipe" : "Liked recipe",
      likes: recipe.likes.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ---------- ADD COMMENT ----------
router.post("/:id/comments", authenticateToken, async (req, res) => {
  try {
    const recipe = await CommunityRecipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    recipe.comments.push({
      user: req.user.userId,
      text: req.body.text,
      createdAt: new Date(),
    });

    await recipe.save();
    const updated = await CommunityRecipe.findById(req.params.id).populate(
      "comments.user",
      "name"
    );

    res.json({ message: "Comment added", comments: updated.comments });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ---------- GET SINGLE COMMUNITY RECIPE ----------
router.get("/:id", async (req, res) => {
  try {
    const recipe = await CommunityRecipe.findById(req.params.id)
      .populate("author", "name")
      .populate("comments.user", "name");
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json({ recipe });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
