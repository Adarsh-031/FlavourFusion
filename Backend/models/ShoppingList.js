const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      name: { type: String, required: true },
      checked: { type: Boolean, default: false },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ShoppingList", shoppingListSchema);
