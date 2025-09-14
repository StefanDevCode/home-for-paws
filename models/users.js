import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { Pet } from "./pets.js";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  displayName: String,
  googleId: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocalMongoose);

// pre hook za brisanje usera
userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()["_id"];
  await Pet.deleteMany({ author: userId });
  next();
});

export const User = mongoose.model("User", userSchema);
