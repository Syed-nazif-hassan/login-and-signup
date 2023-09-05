const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const templatesPath = path.join(__dirname, "../templates");
const mongoose = require("mongoose");
const PORT = 3000;
const MONGO_DB_URI =
  "mongodb+srv://cluster1_user:bkD5RUIFUoCo0NW7@cluster1.nltyt7a.mongodb.net/login_signup?retryWrites=true&w=majority";
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
app.post("/signup", async (req, res) => {
  const data = {
    Name: req.body.name,
    Password: req.body.password,
  };
  const usename_available = await collection.findOne({ Name: req.body.name });
  if (usename_available === null) {
    await collection.insertMany([data]);
    res.render("home");
  } else {
    res.send("Usename already exists.");
  }
});
app.post("/login", async (req, res) => {
  try {
    const user_info = await collection.findOne({ Name: req.body.name });
    if (user_info.Password === req.body.password) {
      res.render("home");
    } else {
      res.send("Wrong Password");
    }
  } catch {
    res.send("Invalid Username");
  }
});

app.listen(PORT, () => console.log("Port connected"));
