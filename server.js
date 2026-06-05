
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const mealRoutes = require("./routes/meals");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/nutrition_app")
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);

app.listen(5000, ()=>console.log("Server running on 5000"));
