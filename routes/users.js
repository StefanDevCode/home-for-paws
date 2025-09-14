import express from "express";
const router = express.Router();
import { User } from "../models/users.js";
import { Pet } from "../models/pets.js";
import passport from "passport";
import { storeReturnTo } from "../middleware/auth/isLogged.js";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import nodemailer from "nodemailer";
import { isLoggedIn } from "../middleware/auth/isLogged.js";
import { isAdmin } from "../middleware/admin/isAdmin.js";

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      req.flash("error", "Email already exist.");
      return res.redirect("/register");
    }
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const redirectUrl = res.locals.returnTo || "/";
    req.flash("success", "Dobrodišli nazad!");
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Doviđenja, vidimo se uskoro");
    res.redirect("/");
  });
});

//GOOGLE AUTHENTICATION
// Pokretanje Google login-a
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback ruta gde Google vraća korisnika
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Uspešno ste prijavljeni preko Google-a!");
    res.redirect("/"); // ili dashboard/profil
  }
);

// Prikaz svih oglasa određenog korisnika
router.get("/author/:userId", async (req, res) => {
  const { userId } = req.params;
  const pets = await Pet.find({ author: userId }).populate("author");
  res.render("petsByAuthor", { pets });
});

// pregled svih korisnika
router.get("/admin/users", isLoggedIn, isAdmin, async (req, res) => {
  const users = await User.find({});
  res.render("users", { users });
});

// brisanje korisnika i njegovih ljubimaca
router.delete("/admin/users/:id", isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);

  req.flash("success", "Korisnik i svi njegovi postovi su obrisani.");
  res.redirect("/admin/users");
});

//Forgoten password get route
router.get("/forgot", (req, res) => {
  res.render("forgotPassword"); //
});

//Forgoten password post route
router.post("/forgot", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "Nema korisnika sa tim emailom.");
      return res.redirect("/forgot");
    }

    // 1. Generišemo token
    const token = crypto.randomBytes(20).toString("hex");

    // 2. Čuvamo token u bazi (1h važi)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 sat
    await user.save();

    // 3. Konfiguracija nodemailera (primer za Gmail)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      ...(process.env.NODE_ENV !== "production" && {
        tls: { rejectUnauthorized: false },
      }),
    });

    // 4. Šaljemo mejl
    const resetURL = `http://${req.headers.host}/reset/${token}`;
    await transporter.sendMail({
      to: user.email,
      from: "no-reply@udomisape.com",
      subject: "Reset lozinke",
      text: `Kliknite na sledeći link da resetujete lozinku:\n\n ${resetURL}`,
    });

    req.flash("success", "Email sa instrukcijama je poslat!");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error", "Došlo je do greške.");
    res.redirect("/forgot");
  }
});

router.get("/reset/:token", async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "Token je istekao ili nije validan.");
    return res.redirect("/forgot");
  }
  res.render("resetPassword.ejs", { token: req.params.token });
});

router.post("/reset/:token", async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "Token je istekao ili nije validan.");
    return res.redirect("/forgot");
  }

  // Passport-local-mongoose metoda
  await user.setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  req.login(user, (err) => {
    req.flash("success", "Lozinka uspešno promenjena!");
    res.redirect("/");
  });
});

export default router;
