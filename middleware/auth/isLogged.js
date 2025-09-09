export function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Morate biti prijavljeni!");
    return res.redirect("/login");
  }
  next();
}

export function storeReturnTo(req, res, next) {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
}
