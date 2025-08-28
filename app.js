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

import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import { expressError } from "./utils/expressError.js";
import session from "express-session";
import flash from "connect-flash";
import homeRoute from "./routes/home.js";
import petRoutes from "./routes/pets.js";

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
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
};

app.use(session(configSession));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", homeRoute);
app.use("/ljubimci", petRoutes);

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
