const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

const secretKey = process.env.SECRET;
const loginRegex = /^[\.\-_0-9a-z]+@([a-z])+\.[a-z]+$/;
const passwordRegex = /^([\\.\-_0-9a-zA-Z]){8,}$/;

exports.signup = (req, res) => {
  let mailIsValid = loginRegex.test(req.body.email);
  let passwordIsValid = passwordRegex.test(req.body.password);
  if (!mailIsValid || !passwordIsValid) {
    res.status(406).json({ message: "Please enter a valid email and/or password" });
  } else {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Signup successful" }))
          .catch((error) => res.status(405).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

exports.login = (req, res) => {
  let mailIsValid = loginRegex.test(req.body.email);
  let passwordIsValid = passwordRegex.test(req.body.password);
  if (!mailIsValid || !passwordIsValid) {
    res.status(406).json({ message: "Please enter a valid email and/or password" });
  } else {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ erreur: "User doesn't exist" });
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ erreur: "Incorrect password" });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, `${secretKey}`, {
                expiresIn: "24h",
              }),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

//Requete(s) de test
exports.findUsers = (req, res) => {
  user
    .find()
    .then((users) => res.status(200).json({ users }))
    .catch((error) => res.status(400).json({ error }));
};
