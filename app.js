// const express = require("express");
// const ejsMate = require("ejs-mate");
// const path = require("path");
// const xlsx = require("xlsx");
// const fs = require("fs");

// const app = express();

// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//   res.render("home");
// });

// app.get("/administration", (req, res) => {
//   res.render("administration");
// });

// app.get("/addParticipant", (req, res) => {
//   res.render("addparticipant");
// });

// app.get("/timeKeeper", (req, res) => {
//   res.render("timeKeeper");
// });

// app.get("/index", (req, res) => {
//   res.render("index");
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`SERVING ON PORT ${port}`);
// });

// const express = require("express");
// const multer = require("multer");
// const xlsx = require("xlsx");
// const bodyParser = require("body-parser");
// const path = require("path");

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.set("view engine", "ejs");

// // Store the JSON array globally
// let jsonArray = [];

// // Configure Multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Serve static files (e.g., JS, CSS)
// app.use(express.static(path.join(__dirname, "public")));

// // Route to render the webpage
// app.get("/", (req, res) => {
//   res.render("index", { jsonArray });
// });

// // Route to upload and parse the XLSX file
// app.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).send("No file uploaded.");
//   const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
//   const sheet = workbook.Sheets[workbook.SheetNames[0]];
//   jsonArray = xlsx.utils.sheet_to_json(sheet, { defval: null }); // Preserve null values
//   res.redirect("/");
// });

// // Route to capture time
// app.post("/capture", (req, res) => {
//   const { raceNr, time } = req.body;
//   jsonArray = jsonArray.map((entry) =>
//     entry["Race Nr"] === raceNr ? { ...entry, Time: time } : entry
//   );
//   res.redirect("/");
// });

// // Route to download the updated XLSX file
// app.get("/download", (req, res) => {
//   const worksheet = xlsx.utils.json_to_sheet(jsonArray);
//   const workbook = xlsx.utils.book_new();
//   xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//   const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
//   res.setHeader(
//     "Content-Disposition",
//     'attachment; filename="updated_file.xlsx"'
//   );
//   res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//   res.send(buffer);
// });

// // Start the server
// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });

const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

// Store the JSON array globally
let jsonArray = [];

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve static files (e.g., JS, CSS)
app.use(express.static(path.join(__dirname, "public")));

// Route to render the webpage
app.get("/", (req, res) => {
  res.render("index", { jsonArray });
});

// Route to upload and parse the XLSX file
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  jsonArray = xlsx.utils.sheet_to_json(sheet, { defval: null }); // Preserve null values
  res.redirect("/");
});

// Route to capture time
app.post("/capture", (req, res) => {
  const { raceNr, elapsedTime } = req.body;
  jsonArray = jsonArray.map((entry) =>
    entry["Race Nr"] === raceNr ? { ...entry, Time: elapsedTime } : entry
  );
  res.redirect("/");
});

// Route to download the updated XLSX file
app.get("/download", (req, res) => {
  const worksheet = xlsx.utils.json_to_sheet(jsonArray);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="updated_file.xlsx"'
  );
  res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buffer);
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
