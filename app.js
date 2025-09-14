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
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { v4 as uuidv4 } from "uuid";
import { User } from "./models/users.js";
import userRoutes from "./routes/users.js";

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

app.use(passport.initialize());
app.use(passport.session());

//LOCAL STRATEGY
passport.use(new LocalStrategy(User.authenticate()));

//GOOGLE STRATEGY

const callbackURL =
  process.env.NODE_ENV === "production"
    ? process.env.GOOGLE_CALLBACK_PROD
    : process.env.GOOGLE_CALLBACK_DEV;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Proveri po googleId
        let user = await User.findOne({ googleId: profile.id });

        // 2. Ako ne postoji, proveri po email
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            // Poveži Google ID sa postojećim korisnikom
            user.googleId = profile.id;
            await user.save();
          } else {
            // 3. Ako ni po email-u ne postoji, kreiraj novog korisnika
            let username = profile.displayName;
            const exists = await User.findOne({ username });
            if (exists) {
              username = `${username}-${uuidv4()}`;
            }

            user = new User({
              username,
              displayName: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
            });
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
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
