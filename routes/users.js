import express from "express";
const router = express.Router();
import { User } from "../models/users.js";
import passport from "passport";
import { storeReturnTo } from "../middleware/auth/isLogged.js";

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

export default router;
