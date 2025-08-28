import express from "express";
const router = express.Router();

import * as petsController from "../controllers/petsController.js";

router.get("/psi", petsController.listDogs);

router.get("/macke", petsController.listCats);

router.get("/novi", petsController.renderNewPetForm);

router.get("/udomljeni", petsController.showAdoptedPets);

router.get("/:id", petsController.showPet);

router.post("/", petsController.createPet);

router.post("/:id/udomljeni", petsController.adoptPet);

router.get("/:id/izmeni", petsController.renderEditPetForm);

router.put("/:id", petsController.updatePet);

router.delete("/:id", petsController.deletePet);

export default router;
