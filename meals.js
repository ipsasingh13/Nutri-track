
const express = require("express");
const Meal = require("../models/Meal");

const router = express.Router();

router.post("/", async (req,res)=>{
  const meal = new Meal(req.body);
  await meal.save();
  res.json(meal);
});

router.get("/:userId", async (req,res)=>{
  const meals = await Meal.find({ userId: req.params.userId });
  res.json(meals);
});

module.exports = router;
