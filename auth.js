
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const SECRET = "secret123";

router.post("/register", async (req,res)=>{
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = new User({ email: req.body.email, password: hashed });
  await user.save();
  res.json({ message: "User registered" });
});

router.post("/login", async (req,res)=>{
  const user = await User.findOne({ email: req.body.email });
  if(!user) return res.status(400).json({ msg:"User not found" });

  const match = await bcrypt.compare(req.body.password, user.password);
  if(!match) return res.status(400).json({ msg:"Invalid password" });

  const token = jwt.sign({ id: user._id }, SECRET);
  res.json({ token });
});

module.exports = router;
