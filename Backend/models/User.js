const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  preferences: {
    dietaryRestrictions: [String],
    favoriteCuisines: [String],
  },
  stats: {
    recipesCooked: { type: Number, default: 0 },
    carbonSaved: { type: Number, default: 0 },
    foodWasteReduced: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("User", userSchema);
