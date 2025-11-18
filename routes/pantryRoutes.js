const express = require("express");
const Pantry = require("../models/Pantry");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get Pantry
router.get("/", authenticateToken, async (req, res) => {
  try {
    let pantry = await Pantry.findOne({ userId: req.user.userId });
    if (!pantry) {
      pantry = new Pantry({ userId: req.user.userId, items: [] });
      await pantry.save();
    }
    res.json({ pantry });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Add Pantry Item
router.post("/items", authenticateToken, async (req, res) => {
  try {
    const { name, quantity, category } = req.body;

    let pantry = await Pantry.findOne({ userId: req.user.userId });
    if (!pantry) pantry = new Pantry({ userId: req.user.userId, items: [] });

    pantry.items.push({ name, quantity, category });
    pantry.updatedAt = Date.now();

    await pantry.save();
    res.json({ message: "Item added to pantry", pantry });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Update Pantry Item
router.put("/items/:itemId", authenticateToken, async (req, res) => {
  try {
    const { name, quantity, category } = req.body;
    const pantry = await Pantry.findOne({ userId: req.user.userId });
    if (!pantry) return res.status(404).json({ error: "Pantry not found" });

    const item = pantry.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.name = name || item.name;
    item.quantity = quantity || item.quantity;
    item.category = category || item.category;
    pantry.updatedAt = Date.now();

    await pantry.save();
    res.json({ message: "Item updated", pantry });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Delete Pantry Item
router.delete("/items/:itemId", authenticateToken, async (req, res) => {
  try {
    const pantry = await Pantry.findOne({ userId: req.user.userId });
    if (!pantry) return res.status(404).json({ error: "Pantry not found" });

    pantry.items.pull(req.params.itemId);
    pantry.updatedAt = Date.now();
    await pantry.save();

    res.json({ message: "Item deleted", pantry });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
