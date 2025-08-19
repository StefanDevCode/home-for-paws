import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Pas", "Mačka"],
    required: [true, "Izaberite vrstu ljubimca (pas, mačka)"],
  },
  name: {
    type: String,
    required: [true, "Unesite ime ljubimca"],
  },
  gender: {
    type: String,
    enum: ["Muški", "Ženski"],
    required: [true, "Unesite pol ljubimca"],
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    required: [true, "Postavite bar jednu sliku ljubimca"],
  },
  ageYears: {
    type: Number,
    required: [true, "Unesite broj godina ljubimca"],
    min: 0,
    max: 30,
  },
  ageMonths: {
    type: Number,
    required: [true, "Unesite broj meseci ljubimca"],
    min: 0,
    max: 11,
  },
  sortingAgeInMonths: {
    type: Number, // Internal field for sorting and filtering
  },
  createdAt: { type: Date, default: Date.now },
  location: {
    type: String,
    required: [true, "Unesite lokaciju "],
  },
  vaccinated: {
    type: Boolean,
    required: [true, "Unesite podatak da li je ljubimac vakcinisan"],
  },
});

// Pre 'save' hook to count total months
petSchema.pre("save", function (next) {
  this.sortingAgeInMonths = this.ageYears * 12 + this.ageMonths;
  next();
});

// Optional virtual field for view years and months
petSchema.virtual("age").get(function () {
  const years = Math.floor(this.sortingAgeInMonths / 12);
  const months = this.sortingAgeInMonths % 12;
  return { years, months };
});

export const Pet = mongoose.model("Pet", petSchema);
