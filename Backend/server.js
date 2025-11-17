const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/recipes", require("./routes/recipeRoutes"));
app.use("/api/mealplan", require("./routes/mealPlanRoutes"));
app.use("/api/pantry", require("./routes/pantryRoutes"));
app.use("/api/shopping-list", require("./routes/shoppingRoutes"));
app.use("/api/community", require("./routes/communityRoutes"));

app.get("/", (req, res) => {
  res.send("FlavorFusion API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
