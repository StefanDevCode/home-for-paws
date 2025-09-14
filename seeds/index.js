import mongoose from "mongoose";
import { Pet } from "../models/pets.js";

import {
  categories,
  names,
  descriptions,
  dogImages,
  catImages,
  locations,
  breeds,
} from "./petHelpers.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/paws")
  .then((data) => console.log("Connection succeded"))
  .catch((e) => console.log("Error", e));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const sampleImages = (category) => {
  const source = category === "Pas" ? dogImages : catImages;
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 3) + 1;
  return shuffled.slice(0, count);
};

const sampleYesNoUnknown = () => sample(["Da", "Ne", "Ne znam"]);

const seedPets = async () => {
  await Pet.deleteMany({});

  console.log("Obrisani svi korisnici");
  for (let i = 0; i < 50; i++) {
    const isAdopted = Math.random() > 0.5;
    const category = sample(categories);
    const possibleAgeGroups =
      category === "Pas" ? ["Štene", "Odrasli pas"] : ["Mače", "Odrasla mačka"];
    const pet = new Pet({
      author: "68c069a88be2a1d3dfe0c23f",
      category,
      ageGroup: sample(possibleAgeGroups),
      name: sample(names),
      gender: Math.random() > 0.5 ? "Mužjak" : "Ženka",
      description: sample(descriptions),
      images: sampleImages(category),
      location: sample(locations),
      vaccinated: sampleYesNoUnknown(),
      neutered: sampleYesNoUnknown(),
      chipped: sampleYesNoUnknown(),
      contact: "0602233445",
      breed: category === "Pas" ? sample(breeds.dog) : sample(breeds.cat),
      adopted: isAdopted,
      adoptedAt: isAdopted ? new Date() : undefined,
      approved: true,
    });

    await pet.save();
    console.log(`Saved pet #${i + 1}: ${pet.name}`);
  }

  const count = await Pet.countDocuments();
  console.log(`Ukupno ljubimaca u bazi: ${count}`);
  mongoose.connection.close();
};

seedPets();
