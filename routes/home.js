import express from "express";
const router = express.Router();
import * as homeController from "../controllers/homeController.js";

router.get("/", homeController.renderHome);

export default router;
