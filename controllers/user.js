const User = require("../models/user");
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");

// this is our user signup method
exports.signup = (req, res) => {
  // console.log("req.body", req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user,
    });
  });
};

// this is our user signin method
exports.signin = (req, res) => {
  // find user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email not found. Please sign up",
      });
    }
    // if user is found check email and password match
    // create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "User name and password do not match",
      });
    }
    // generate a signed tokn with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // persist the token as "t" in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;

    return res.json({ token, user: { _id, email, name, role } });
  });
};
