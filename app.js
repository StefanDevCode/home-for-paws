import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Pet } from "./models/pets.js";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import { expressError } from "./utils/expressError.js";
import session from "express-session";
import flash from "connect-flash";

import { serbiaLocations } from "./seeds/locationHelperSerbia.js";
import { catImages, dogImages } from "./seeds/petHelpers.js";
import { error } from "console";

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

const configSession = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 2 },
};

app.use(session(configSession));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", async (req, res) => {
  try {
    // Newest pets
    const latestPets = await Pet.find({ adopted: false })
      .sort({ createdAt: -1 })
      .limit(8);

    // First 5 dogs
    const dogs = await Pet.find({ category: "Pas", adopted: false })
      .sort({ createdAt: -1 })
      .limit(4);

    // First 5 cats
    const cats = await Pet.find({ category: "Mačka", adopted: false })
      .sort({ createdAt: -1 })
      .limit(4);

    // Earliest added pets
    const earliestPets = await Pet.find({ adopted: false })
      .sort({ createdAt: 1 })
      .limit(4);

    res.render("home", { latestPets, dogs, cats, earliestPets });
  } catch (err) {
    console.log(err);
    res.send("Došlo je do greške");
  }
});

app.get("/ljubimci/psi", async (req, res) => {
  const dogs = await Pet.find({ category: "Pas" });
  res.render("dogs", { dogs });
});

app.get("/ljubimci/macke", async (req, res) => {
  const cats = await Pet.find({ category: "Mačka" });
  res.render("cats", { cats });
});

app.get("/ljubimci/novi", async (req, res) => {
  res.render("new", { serbiaLocations });
});

app.get("/ljubimci/udomljeni", async (req, res) => {
  const adoptedPets = await Pet.find({
    adopted: true,
  }).sort({ adoptedAt: -1 });

  res.render("adopted", { adoptedPets });
});

app.get("/ljubimci/:id", async (req, res) => {
  const { id } = req.params;
  const showPet = await Pet.findById(id);
  if (!showPet) {
    req.flash("error", "Ne mogu da pronađem traženog ljubimca!");
    return res.redirect("/");
  }

  res.render("show", { showPet });
});

app.post("/ljubimci", async (req, res) => {
  if (typeof req.body.images === "string") {
    req.body.images = [req.body.images];
  }
  const newPet = new Pet(req.body);
  await newPet.save();

  res.redirect("/");
});

app.post("/ljubimci/:id/udomljeni", async (req, res) => {
  const { id } = req.params;
  const adoptedPets = await Pet.findByIdAndUpdate(id, {
    adopted: true,
    adoptedAt: new Date(),
  });

  if (!adoptedPets) {
    req.flash("error", "Ne mogu da pronađem traženog ljubimca!");
    return res.redirect("/");
  }
  req.flash(
    "success",
    "Uspešno udomljen! Hvala Vam što pomažete da šape pronađu svoj srećni dom"
  );
  res.redirect("/ljubimci/udomljeni");
});

app.get("/ljubimci/:id/izmeni", async (req, res) => {
  const { id } = req.params;
  const editPet = await Pet.findById(id);
  if (!editPet) {
    req.flash("error", "Ne mogu da pronađem traženog ljubimca!");
    return res.redirect("/");
  }
  res.render("edit", { editPet, serbiaLocations });
});

app.put("/ljubimci/:id", async (req, res) => {
  const { id } = req.params;
  if (typeof req.body.images === "string") {
    req.body.images = [req.body.images];
  }
  const editPet = await Pet.findByIdAndUpdate(id, req.body, {
    runValidators: true,
  });

  res.redirect(`/ljubimci/${id}`);
});

app.delete("/ljubimci/:id", async (req, res) => {
  const { id } = req.params;
  const editPet = await Pet.findByIdAndDelete(id, req.body);
  res.redirect("/");
});

app.all(/(.*)/, (req, res, next) => {
  next(new expressError("Stranica nije pronađena", 404));
});

app.use((error, req, res, next) => {
  const { status = 500 } = error;
  if (!error.message) error.message = "Greška";
  res.status(status).render("error", { error });
  next();
});

app.listen(3000, (req, res) => {
  console.log("Server is listening on 3000");
});
