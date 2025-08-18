import mongoose from "mongoose";
import { Pet } from "../models/pets.js";
import {
  categories,
  names,
  descriptions,
  images,
  locations,
} from "./petHelpers.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/paws")
  .then((data) => console.log("Connection succeded"))
  .catch((e) => console.log("Error", e));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedPets = async () => {
  await Pet.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const pet = new Pet({
      category: sample(categories),
      name: sample(names),
      gender: Math.random() > 0.5 ? "Muški" : "Ženski",
      description: sample(descriptions),
      image: sample(images),
      ageYears: Math.floor(Math.random() * 30),
      ageMonths: Math.floor(Math.random() * 12),
      location: sample(locations),
    });

    await pet.save();
    console.log(`Saved pet #${i + 1}: ${pet.name}`);
  }

  const count = await Pet.countDocuments();
  console.log(`Ukupno ljubimaca u bazi: ${count}`);
  mongoose.connection.close();
};

seedPets();
