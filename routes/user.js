const express = require("express");
const router = express.Router();

const { signup } = require("../controllers/user");
// this is the validator helper
const { userSignupValidator } = require("../validator");

router.post("/signup", userSignupValidator, signup);

module.exports = router;
