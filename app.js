const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")

const userRoutes = require("./routes/userroute");
const sauceRoutes = require("./routes/sauceroute");

mongoose
  .connect(
    "mongodb+srv://OCP6:OCP6@cluster0.ph5pw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(
    () => {
      console.log("Connexion réussie");
    },
    (err) => {
      console.log(err);
    }
  );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api", sauceRoutes);

module.exports = app;
