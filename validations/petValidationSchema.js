import { checkSchema, validationResult } from "express-validator";
import { serbiaLocations } from "../seeds/locationHelperSerbia.js";

export const petValidationSchema = checkSchema({
  images: {
    in: ["body"],
    notEmpty: { errorMessage: "Postavite bar jednu sliku ljubimca" },
  },
  category: {
    in: ["body"],
    notEmpty: { errorMessage: "Izaberite vrstu ljubimca (pas, mačka)" },
    isIn: {
      options: [["Pas", "Mačka"]],
      errorMessage: "Dozvoljene vrednosti za kategoriju su: Pas, Mačka",
    },
    escape: true,
    trim: true,
  },
  gender: {
    in: ["body"],
    notEmpty: { errorMessage: "Unesite pol ljubimca" },
    isIn: {
      options: [["Mužjak", "Ženka"]],
      errorMessage: "Pol mora biti Mužjak ili Ženka",
    },
    escape: true,
    trim: true,
  },
  vaccinated: {
    in: ["body"],
    notEmpty: { errorMessage: "Unesite podatak da li je ljubimac vakcinisan" },
    isIn: {
      options: [["Da", "Ne", "Ne znam"]],
      errorMessage: "Dozvoljene vrednosti: Da, Ne, Ne znam",
    },
    escape: true,
    trim: true,
  },
  neutered: {
    in: ["body"],
    notEmpty: { errorMessage: "Unesite podatak da li je ljubimac sterilisan" },
    isIn: {
      options: [["Da", "Ne", "Ne znam"]],
      errorMessage: "Dozvoljene vrednosti: Da, Ne, Ne znam",
    },
    escape: true,
    trim: true,
  },
  chipped: {
    in: ["body"],
    notEmpty: { errorMessage: "Unesite podatak da li je ljubimac čipovan" },
    isIn: {
      options: [["Da", "Ne", "Ne znam"]],
      errorMessage: "Dozvoljene vrednosti: Da, Ne, Ne znam",
    },
    escape: true,
    trim: true,
  },
  name: {
    in: ["body"],
    isString: { errorMessage: "Ime mora biti tekst" },
    notEmpty: { errorMessage: "Unesite ime ljubimca" },
    escape: true,
    trim: true,
    isLength: {
      options: { min: 2, max: 15 },
      errorMessage: "Polje ime mora sadržati od 2 do 15 karaktera",
    },
    matches: {
      options: /^[A-Za-z0-9 ]+$/i, // samo slova, brojevi i razmak
      errorMessage: "Ime može sadržati samo slova i brojeve",
    },
  },
  description: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "Opis mora biti tekst" },
    escape: true,
    trim: true,
    isLength: {
      options: { max: 300 },
      errorMessage: "Maksimalan broj karaktera je 300",
    },
    matches: {
      options: /^[A-Za-z0-9 .,!?-]*$/i, // slova, brojevi, razmak i osnovna interpunkcija
      errorMessage:
        "Opis može sadržati samo slova, brojeve i osnovne znakove interpunkcije",
    },
  },
  location: {
    in: ["body"],
    notEmpty: { errorMessage: "Unesite lokaciju" },
    isIn: {
      options: [serbiaLocations],
      errorMessage: "Unesite validnu lokaciju u Srbiji",
    },
    escape: true,
    trim: true,
  },
  breed: {
    in: ["body"],
    notEmpty: { errorMessage: "Izaberite rasu" },
    escape: true,
    trim: true,
  },
  contact: {
    in: ["body"],
    notEmpty: { errorMessage: "Unesite broj telefona za kontakt" },
    isLength: {
      options: { min: 7, max: 15 },
      errorMessage: "Broj telefona mora imati između 7 i 15 cifara",
    },
    escape: true,
    trim: true,
  },
  ageGroup: {
    in: ["body"],
    optional: true,
    isIn: {
      options: [["Štene", "Odrasli pas", "Mače", "Odrasla mačka"]],
      errorMessage: "Dozvoljene vrednosti za starosnu grupu nisu ispravne",
    },
    escape: true,
    trim: true,
  },
  adopted: {
    in: ["body"],
    optional: true,
    isBoolean: { errorMessage: "Adopted mora biti true ili false" },
  },
  adoptedAt: {
    in: ["body"],
    optional: true,
  },
});

// middleware for validation

const validatePet = [
  petValidationSchema,
  (req, res, next) => {
    const errors = validationResult(req);

    // Provera da li je body prazan
    if (!req.body || Object.keys(req.body).length === 0) {
      req.flash("error", "Sva obavezna polja moraju biti popunjena");
      return res.redirect("/ljubimci/novi");
    }

    if (!errors.isEmpty()) {
      // Za svaku grešku posebno stavljamo poruku u flash
      errors.array().forEach((err) => {
        req.flash("error", err.msg);
      });

      return res.redirect("/ljubimci/novi");
    }

    next();
  },
];

export default validatePet;
