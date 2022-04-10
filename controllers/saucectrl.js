const Sauce = require("../models/saucemodel");
const fs = require("fs");

exports.listAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.listOneSauce = (req, res) => {
  Sauce.findById(req.params.id)
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

exports.addSauce = (req, res) => {
  const sauceName = req.body;
  console.log(sauceName);
  const sauceImage = req.body.image;
  const newSauce = new Sauce({
    ...sauceName,
    sauceImage: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  newSauce
    .save()
    .then(() => res.status(201).json({ message: "Nouvelle sauce ajoutée" }));
};

exports.modifyOneSauce = (req, res) => {
  const updatedSauce = req.body;
  Sauce.updateOne(
    { _id: req.params.id },
    { ...updatedSauce, _id: req.params.id }
  )
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteOneSauce = (req, res) => {
  Sauce.findByIdAndDelete(req.params.id)
    .then(() => res.end().json({ Message: "Sauce supprimée" }))
    .catch((error) => res.status(400).json({ error }));
};

// exports.likeOneSauce = (req, res) => {

// }
