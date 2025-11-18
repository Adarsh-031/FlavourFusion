const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const communityRecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  time: Number,
  difficulty: String,
  cuisine: String,
  calories: Number,
  carbon: Number,
  ingredients: [String],
  instructions: [String],

  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommunityRecipe", communityRecipeSchema);
