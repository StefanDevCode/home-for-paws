import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Pas", "Mačka"],
    required: [true, "Izaberite vrstu ljubimca (pas, mačka)"],
  },
  contact: {
    type: String,
    required: [true, "Unesite broj telefona za kontakt"],
  },
  ageGroup: {
    type: String,
    enum: ["Štene", "Odrasli pas", "Mače", "Odrasla mačka"],
  },
  name: {
    type: String,
    required: [true, "Unesite ime ljubimca"],
  },
  gender: {
    type: String,
    enum: ["Mužjak", "Ženka"],
    required: [true, "Unesite pol ljubimca"],
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    required: [true, "Postavite bar jednu sliku ljubimca"],
  },
  createdAt: { type: Date, default: Date.now },
  location: {
    type: String,
    required: [true, "Unesite lokaciju "],
  },
  vaccinated: {
    type: String,
    enum: ["Da", "Ne", "Ne znam"],
    required: [true, "Unesite podatak da li je ljubimac vakcinisan"],
  },
  neutered: {
    type: String,
    enum: ["Da", "Ne", "Ne znam"],
    required: [true, "Unesite podatak da li je ljubimac sterilisan"],
  },
  chipped: {
    type: String,
    enum: ["Da", "Ne", "Ne znam"],
    required: [true, "Unesite podatak da li je ljubimac čipovan"],
  },
  breed: {
    type: String,
    required: [true, "Izaberite rasu"],
  },
  adopted: {
    type: Boolean,
    default: false,
  },
  adoptedAt: {
    type: Date,
  },
});

export const Pet = mongoose.model("Pet", petSchema);
