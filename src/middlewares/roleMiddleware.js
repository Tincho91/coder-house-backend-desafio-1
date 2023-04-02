export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.session.role && req.session.role === role) {
      next();
    } else {
      res.status(403).send("Access Denied");
    }
  };
};
