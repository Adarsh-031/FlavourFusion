const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  week: { type: String, required: true }, // format YYYY-WW
  meals: {
    type: Map,
    of: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

mealPlanSchema.index({ userId: 1, week: 1 }, { unique: true });

module.exports = mongoose.model("MealPlan", mealPlanSchema);
