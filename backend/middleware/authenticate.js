const jwt = require("jsonwebtoken");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModal");

exports.isAuthenticatedUsers = catchAsyncError(async (req, res, next) => {
  console.log("yes");
  const { token } = req.cookies;
  console.log(token);
  if (!token) {
    return next(new Errorhandler("Session Expired! Login again"));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  req.user = await User.findById(decoded.id);
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    //It will check whether the requested role was in the registered DB role or not.
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(
        new Errorhandler(`Role ${req.user.role} is not allowed`, 401)
      );
    }
    console.log("admin dha ");
    next();
  };
};
