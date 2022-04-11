const express = require("express");
const router = express.Router();

const sauceControl = require("../controllers/saucectrl");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config")

router.get("/sauces", auth, sauceControl.listAllSauces)
router.get("/sauces/:id", auth, sauceControl.listOneSauce)
router.post("/sauces", auth, multer, sauceControl.addSauce)
router.put("/sauces/:id", auth, multer, sauceControl.modifyOneSauce)
router.delete("/sauces/:id", auth, sauceControl.deleteOneSauce)
router.post("/sauces/:id/like", auth, sauceControl.likeOneSauce)


module.exports = router