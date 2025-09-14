import express from "express";
const router = express.Router();
import validatePet from "../validations/petValidationSchema.js";
import { isAuthor } from "../middleware/author/isAuthor.js";

import * as petsController from "../controllers/petsController.js";
import { isLoggedIn } from "../middleware/auth/isLogged.js";
import { isAdmin } from "../middleware/admin/isAdmin.js";

router.get("/psi", petsController.listDogs);

router.get("/macke", petsController.listCats);

router.get("/novi", isLoggedIn, petsController.renderNewPetForm);

router.get("/udomljeni", petsController.showAdoptedPets);

router.get("/odobravanje", isLoggedIn, isAdmin, petsController.listPendingPets);

router.post("/odobri/:id", isLoggedIn, isAdmin, petsController.approvePet);

router.post("/neodobri/:id", isLoggedIn, isAdmin, petsController.rejectPet);

router.get("/:id", petsController.showPet);

router.post("/", isLoggedIn, validatePet, petsController.createPet);

router.post("/:id/udomljeni", isLoggedIn, isAuthor, petsController.adoptPet);

router.get(
  "/:id/izmeni",
  isLoggedIn,
  isAuthor,
  petsController.renderEditPetForm
);

router.put("/:id", isLoggedIn, isAuthor, validatePet, petsController.updatePet);

router.delete("/:id", isLoggedIn, isAuthor, petsController.deletePet);

export default router;
