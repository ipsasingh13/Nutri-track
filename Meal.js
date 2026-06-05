
const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
  userId: String,
  name: String,
  calories: Number,
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Meal", MealSchema);
