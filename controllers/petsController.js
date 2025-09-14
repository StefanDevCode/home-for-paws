import { Pet } from "../models/pets.js";
import { serbiaLocations } from "../seeds/locationHelperSerbia.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// transporter setup (izvuci u config po želji)
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

export const listDogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12;

  const totalDogs = await Pet.countDocuments({ category: "Pas" });
  const totalPages = Math.ceil(totalDogs / limit);
  const dogs = await Pet.find({ category: "Pas", approved: true })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("author");

  res.render("dogs", { dogs, page, totalPages });
};

export const listCats = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12;

  const totalCats = await Pet.countDocuments({ category: "Mačka" });
  const totalPages = Math.ceil(totalCats / limit);
  const cats = await Pet.find({ category: "Mačka", approved: true })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("author");
  res.render("cats", { cats, page, totalPages });
};

export const renderNewPetForm = async (req, res) => {
  res.render("new", { serbiaLocations });
};

export const showAdoptedPets = async (req, res) => {
  const adoptedPets = await Pet.find({
    adopted: true,
    approved: true,
  })
    .sort({ adoptedAt: -1 })
    .populate("author");

  res.render("adopted", { adoptedPets });
};

export const showPet = async (req, res) => {
  const { id } = req.params;
  const showPet = await Pet.findById(id).populate("author");
  /*if (!showPet) {
    req.flash("error", "Ne mogu da pronađem traženog ljubimca!");
    return res.redirect("/");
  }*/

  // dozvoljava prikaz samo ako je approved ili ako je admin autor
  if (!showPet || (!showPet.approved && !req.user?.isAdmin)) {
    req.flash("error", "Ne mogu da pronađem traženog ljubimca!");
    return res.redirect("/");
  }

  res.render("show", { showPet });
};

export const createPet = async (req, res) => {
  if (typeof req.body.images === "string") {
    req.body.images = [req.body.images];
  }
  const newPet = new Pet(req.body);
  newPet.author = req.user._id;
  newPet.approved = false;
  await newPet.save();

  res.redirect("/");
};

export const adoptPet = async (req, res) => {
  const { id } = req.params;
  const adoptedPets = await Pet.findByIdAndUpdate(id, {
    adopted: true,
    adoptedAt: new Date(),
  });

  if (!adoptedPets) {
    req.flash("error", "Ne mogu da pronađem traženog ljubimca!");
    return res.redirect("/");
  }
  req.flash(
    "success",
    "Uspešno udomljen! Hvala Vam što pomažete da šape pronađu svoj srećni dom"
  );
  res.redirect("/ljubimci/udomljeni");
};

export const renderEditPetForm = async (req, res) => {
  const { id } = req.params;
  const editPet = await Pet.findById(id);
  if (!editPet) {
    req.flash("error", "Ne mogu da pronađem traženog ljubimca!");
    return res.redirect("/");
  }
  res.render("edit", { editPet, serbiaLocations });
};

export const updatePet = async (req, res) => {
  const { id } = req.params;
  if (typeof req.body.images === "string") {
    req.body.images = [req.body.images];
  }
  const editPet = await Pet.findByIdAndUpdate(id, req.body, {
    runValidators: true,
  });

  res.redirect(`/ljubimci/${id}`);
};

export const deletePet = async (req, res) => {
  const { id } = req.params;
  const editPet = await Pet.findByIdAndDelete(id, req.body);
  req.flash("success", "Uspešno ste obrisali post");
  res.redirect("/");
};

export const listPendingPets = async (req, res) => {
  const pendingPets = await Pet.find({ approved: false }).populate("author");
  res.render("pendingPets", { pendingPets });
};

export const approvePet = async (req, res) => {
  const { id } = req.params;
  const pet = await Pet.findByIdAndUpdate(
    id,
    { approved: true },
    { new: true }
  ).populate("author");

  if (!pet) {
    req.flash("error", "Ljubimac nije pronađen!");
    return res.redirect("/ljubimci/odobravanje");
  }

  // pošalji mejl vlasniku
  if (pet.author?.email) {
    try {
      await transporter.sendMail({
        to: pet.author.email,
        from: "no-reply@udomisape.com",
        subject: "Vaš ljubimac je odobren",
        text: `Čestitamo! Vaš ljubimac "${pet.name}" je odobren i sada je vidljiv na sajtu.`,
      });
    } catch (err) {
      console.error("Greška pri slanju mejla:", err);
    }
  }

  req.flash("success", "Uspešno ste odobrili ljubimca!");
  res.redirect("/ljubimci/odobravanje");
};

export const rejectPet = async (req, res) => {
  const { id } = req.params;
  const pet = await Pet.findByIdAndDelete(id).populate("author");

  if (!pet) {
    req.flash("error", "Ljubimac nije pronađen!");
    return res.redirect("/ljubimci/odobravanje");
  }

  // pošalji mejl vlasniku
  if (pet.author?.email) {
    try {
      await transporter.sendMail({
        to: pet.author.email,
        from: "no-reply@udomisape.com",
        subject: "Vaš ljubimac nije odobren",
        text: `Nažalost, ljubimac "${pet.name}" nije odobren i uklonjen je sa sajta.`,
      });
    } catch (err) {
      console.error("Greška pri slanju mejla:", err);
    }
  }

  req.flash("success", "Uspešno ste odbili ljubimca!");
  res.redirect("/ljubimci/odobravanje");
};
