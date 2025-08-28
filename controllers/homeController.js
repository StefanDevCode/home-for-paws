import { Pet } from "../models/pets.js";
import { serbiaLocations } from "../seeds/locationHelperSerbia.js";

export const renderHome = async (req, res) => {
  // Newest pets
  const latestPets = await Pet.find({ adopted: false })
    .sort({ createdAt: -1 })
    .limit(8);

  // First 5 dogs
  const dogs = await Pet.find({ category: "Pas", adopted: false })
    .sort({ createdAt: -1 })
    .limit(4);

  // First 5 cats
  const cats = await Pet.find({ category: "Mačka", adopted: false })
    .sort({ createdAt: -1 })
    .limit(4);

  // Earliest added pets
  const earliestPets = await Pet.find({ adopted: false })
    .sort({ createdAt: 1 })
    .limit(4);

  res.render("home", { latestPets, dogs, cats, earliestPets });
};
