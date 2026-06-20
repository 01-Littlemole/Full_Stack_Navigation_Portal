function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/admin/login');
}

function redirectIfAuthed(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/admin');
  }
  next();
}

module.exports = { requireAuth, redirectIfAuthed };
