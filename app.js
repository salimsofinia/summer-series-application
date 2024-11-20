const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/administration", (req, res) => {
  res.render("administration");
});

app.get("/addParticipant", (req, res) => {
  res.render("addparticipant");
});

app.get("/timeKeeper", (req, res) => {
  res.render("timeKeeper");
});

app.get("/index", (req, res) => {
  res.render("index");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`SERVING ON PORT ${port}`);
});
