const express = require("express");
const app = express();
const hbs = require("hbs");
const { validationMiddleware, validationResult } = require("./validators");
const path = require("path");
const templatesPath = path.join(__dirname, "../templates");
const mongoose = require("mongoose");
const PORT = 3000;
const MONGO_DB_URI =
  "****";
const collection = require("./mongodb");

mongoose
  .connect(MONGO_DB_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error(err));
mongoose.connection.on("error", (err) =>
  console.error(`DB connyection error: ${err}`)
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.set("views", templatesPath);
app.get("/", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));
app.post("/signup", validationMiddleware, async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const data = {
      Name: req.body.username,
      Password: req.body.password,
    };
    const usename_available = await collection.findOne({
      Name: req.body.username,
    });
    if (usename_available === null) {
      await collection.insertMany([data]);
      res.render("home");
    } else {
      res.send(
        `Sorry, the username ${req.body.username} is already taken. Please choose a different username to continue with your signup.`
      );
    }
  } else {
    const errorMessage = errors.array().map((error) => error.msg)[0];
    return res.send(errorMessage);
  }
});
app.post("/login", validationMiddleware, async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    try {
      const user_info = await collection.findOne({ Name: req.body.username });
      if (user_info.Password === req.body.password) {
        res.render("home");
      } else {
        res.send("Wrong Password");
      }
    } catch {
      res.send("Invalid Username");
    }
  } else {
    const errorMessage = errors.array().map((error) => error.msg)[0];
    return res.send(errorMessage);
  }
});

app.listen(PORT, () => console.log("Port connected"));
