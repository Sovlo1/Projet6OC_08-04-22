const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv").config();
const helmet = require("helmet");

const userRoutes = require("./routes/userroute");
const sauceRoutes = require("./routes/sauceroute");

const databaseLogin = process.env.DB_LOGIN;
const databasePassword = process.env.DB_PASSWORD;

mongoose
  .connect(
    `mongodb+srv://${databaseLogin}:${databasePassword}@cluster0.ph5pw.mongodb.net/OCProjet6?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(
    () => {
      console.log("Successful connection");
    },
    (err) => {
      console.log(err);
    }
  );

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
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

app.get("/test", (req, res) => {
  res.status(200).json({ message: "hello" });
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api", sauceRoutes);

module.exports = app;
