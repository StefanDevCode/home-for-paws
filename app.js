import dotenv from "dotenv";
import { Pet } from "./models/pets.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";

mongoose
  .connect("mongodb://127.0.0.1:27017/paws")
  .then((data) => console.log("Connection succeded"))
  .catch((e) => console.log("Error", e));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  try {
    // Newest pets
    const latestPets = await Pet.find({}).sort({ createdAt: -1 }).limit(8);

    // First 5 dogs
    const dogs = await Pet.find({ category: "Pas" }).limit(4);

    // First 5 cats
    const cats = await Pet.find({ category: "Mačka" }).limit(4);

    // Earliest added pets
    const earliestPets = await Pet.find({}).sort({ createdAt: 1 }).limit(4);

    res.render("home", { latestPets, dogs, cats, earliestPets });
  } catch (err) {
    console.log(err);
    res.send("Došlo je do greške");
  }
});

app.get("/psi", async (req, res) => {
  const dogs = await Pet.find({ category: "Pas" });
  res.render("dogs", { dogs });
});

app.get("/macke", async (req, res) => {
  const cats = await Pet.find({ category: "Mačka" });
  res.render("cats", { cats });
});

app.listen(3000, (req, res) => {
  console.log("Server is listening on 3000");
});
