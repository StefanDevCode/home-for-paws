import express from "express";
const router = express.Router();
import validatePet from "../validations/petValidationSchema.js";

import * as petsController from "../controllers/petsController.js";
import { isLoggedIn } from "../middleware/auth/isLogged.js";

router.get("/psi", petsController.listDogs);

router.get("/macke", petsController.listCats);

router.get("/novi", isLoggedIn, petsController.renderNewPetForm);

router.get("/udomljeni", petsController.showAdoptedPets);

router.get("/:id", petsController.showPet);

router.post("/", isLoggedIn, validatePet, petsController.createPet);

router.post("/:id/udomljeni", isLoggedIn, petsController.adoptPet);

router.get("/:id/izmeni", isLoggedIn, petsController.renderEditPetForm);

router.put("/:id", isLoggedIn, validatePet, petsController.updatePet);

router.delete("/:id", isLoggedIn, petsController.deletePet);

export default router;
