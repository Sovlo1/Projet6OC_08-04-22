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
  const sauceName = JSON.parse(req.body.sauce);
  const newSauce = new Sauce({
    ...sauceName,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
  });
  newSauce
    .save()
    .then(() => res.status(201).json({ message: "Nouvelle sauce ajoutée" }));
};

exports.modifyOneSauce = (req, res) => {
  let updatedSauce;
  if (req.file) {
    updatedSauce = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    };
    Sauce.findById(req.params.id).then((image) => {
      const imageFile = image.imageUrl.split("/images/")[1];
      fs.unlink(`images/${imageFile}`, (err) => {
        if (err) {
          console.log("Could not delete old image");
        } else {
          console.log("Succesfully deleted old image");
        }
      });
    });
  } else {
    updatedSauce = { ...req.body };
  }
  Sauce.findByIdAndUpdate(
    { _id: req.params.id },
    { ...updatedSauce, _id: req.params.id }
  )
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteOneSauce = (req, res) => {
  Sauce.findById(req.params.id)
    .then((sauce) => {
      const imageFile = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${imageFile}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// exports.likeOneSauce = (req, res) => {
//   const likeStatus = req.body.like
//   console.log(likeStatus)
//   Sauce.findById(req.params.id).then((sauce) => {
//     if (
//       !sauce.usersDisliked.includes(req.body.userId) &&
//       !sauce.usersLiked.includes(req.body.userId)
//     ) {
//       if (likeStatus === 1) {
//         { $push: }
//         sauce.usersLike.push(req.body.userId)
//       } else if (likeStatus === -1) {
//         sauce.usersDislike.push(req.body.userId)
//       }
//     }
//   });
// };
