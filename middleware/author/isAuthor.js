import { Pet } from "../../models/pets.js";

/*export async function isAuthor(req, res, next) {
  const { id } = req.params;
  const Pets = await Pet.findById(id);
  if (!Pets.author.equals(req.user._id)) {
    req.flash("error", "Nemate odobrenje");
    return res.redirect(`/ljubimci/${id}`);
  }
  next();
}
*/

export async function isAuthor(req, res, next) {
  const { id } = req.params;
  const pet = await Pet.findById(id);

  if (!pet) {
    req.flash("error", "Ne mogu da pronađem traženog ljubimca!");
    return res.redirect("/ljubimci");
  }

  // Ako je admin – uvek dozvoljeno
  if (req.user && req.user.isAdmin) {
    return next();
  }

  // Ako je autor oglasa – dozvoljeno
  if (pet.author.equals(req.user._id)) {
    return next();
  }

  // Ako nije ni admin ni autor – blok
  req.flash("error", "Nemate odobrenje");
  return res.redirect(`/ljubimci/${id}`);
}
