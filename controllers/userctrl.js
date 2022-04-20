const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const Sauce = require("../models/saucemodel");
const fs = require("fs");

const secretKey = process.env.SECRET;
const loginRegex = /^[\.\-_0-9a-z]+@([a-z])+\.[a-z]+$/;
const passwordRegex = /^([\\.\-_0-9a-zA-Z]){8,}$/;

exports.signup = (req, res) => {
  let mailIsValid = loginRegex.test(req.body.email);
  let passwordIsValid = passwordRegex.test(req.body.password);
  if (!mailIsValid || !passwordIsValid) {
    res
      .status(406)
      .json({ message: "Please enter a valid email and/or password" });
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
    res
      .status(406)
      .json({ message: "Please enter a valid email and/or password" });
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

/////////Requete(s) de test/////////
exports.findUsers = (req, res) => {
  User.find()
    .then((users) => res.status(200).json({ users }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteUser = async (req, res) => {
  Sauce.find({ userId: req.body.user }).then((sauces) => {
    for (i = 0; i < sauces.length; i += 1) {
      let imageFile = sauces[i].imageUrl.split("/images/")[1];
      fs.unlink(`images/${imageFile}`, (err) => {
        if (err) {
          console.log(`Could not delete ${imageFile}`);
        } else {
          console.log(`Successfully deleted ${imageFile}`);
        }
      });
    }
  });
  await Sauce.deleteMany({ userId: req.body.user });
  User.deleteOne({ _id: req.body.user }).then(() => {
    res.status(200).json({ message: "account successfully deleted" });
  });
};


