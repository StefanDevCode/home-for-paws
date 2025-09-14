export function isAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    req.flash("error", "Nemate administratorska prava!");
    return res.redirect("/");
  }
  next();
}
