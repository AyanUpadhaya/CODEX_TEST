const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: 'User role is missing from token.' });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'You are not authorized to perform this action.' });
    }

    return next();
  };
};

module.exports = authorizeRoles;
