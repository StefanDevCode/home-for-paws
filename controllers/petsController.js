import { Pet } from "../models/pets.js";
import { serbiaLocations } from "../seeds/locationHelperSerbia.js";

export const listDogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12;

  const totalDogs = await Pet.countDocuments({ category: "Pas" });
  const totalPages = Math.ceil(totalDogs / limit);
  const dogs = await Pet.find({ category: "Pas" })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.render("dogs", { dogs, page, totalPages });
};

export const listCats = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12;

  const totalCats = await Pet.countDocuments({ category: "Pas" });
  const totalPages = Math.ceil(totalCats / limit);
  const cats = await Pet.find({ category: "Mačka" })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  res.render("cats", { cats, page, totalPages });
};

export const renderNewPetForm = async (req, res) => {
  res.render("new", { serbiaLocations });
};

export const showAdoptedPets = async (req, res) => {
  const adoptedPets = await Pet.find({
    adopted: true,
  }).sort({ adoptedAt: -1 });

  res.render("adopted", { adoptedPets });
};

export const showPet = async (req, res) => {
  const { id } = req.params;
  const showPet = await Pet.findById(id);
  if (!showPet) {
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
