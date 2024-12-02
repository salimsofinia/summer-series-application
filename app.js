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
  counters = {
    overall: 0,
    categories: {
      "0F-99F": 0,
      "100F-199F": 0,
      "200F-299F": 0,
      "300F-399F": 0,
      "400F-499F": 0,
      "500F-599F": 0,
      "600F-699F": 0,
      "700F-799F": 0,
      "800F-899F": 0,
      "900F-999F": 0,
      "0M-99M": 0,
      "100M-199M": 0,
      "200M-299M": 0,
      "300M-399M": 0,
      "400M-499M": 0,
      "500M-599M": 0,
      "600M-699M": 0,
      "700M-799M": 0,
      "800M-899M": 0,
      "900M-999M": 0,
    },
  };
  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  jsonArray = xlsx.utils.sheet_to_json(sheet, { defval: null }); // Preserve null values
  res.redirect("/");
});

// Global counters
let counters = {
  overall: 0,
  categories: {
    "0F-99F": 0,
    "100F-199F": 0,
    "200F-299F": 0,
    "300F-399F": 0,
    "400F-499F": 0,
    "500F-599F": 0,
    "600F-699F": 0,
    "700F-799F": 0,
    "800F-899F": 0,
    "900F-999F": 0,
    "0M-99M": 0,
    "100M-199M": 0,
    "200M-299M": 0,
    "300M-399M": 0,
    "400M-499M": 0,
    "500M-599M": 0,
    "600M-699M": 0,
    "700M-799M": 0,
    "800M-899M": 0,
    "900M-999M": 0,
  },
};

// Helper function to determine category
function getCategory(raceNr) {
  const rangeKeys = Object.keys(counters.categories);
  for (const key of rangeKeys) {
    const [start, end] = key.split("-");
    const rangeStart = parseInt(start, 10);
    const rangeEnd = parseInt(end, 10);
    if (
      raceNr.endsWith(start.slice(-1)) &&
      parseInt(raceNr.slice(0, -1)) >= rangeStart &&
      parseInt(raceNr.slice(0, -1)) <= rangeEnd
    ) {
      return key;
    }
  }
  return null;
}

// Route to capture time
app.post("/capture", (req, res) => {
  const { raceNr, elapsedTime } = req.body;

  // Increment overall position counter
  counters.overall += 1;

  // Determine the category and increment the category counter
  const category = getCategory(raceNr);
  if (!category) {
    return res.status(400).send("Invalid Race Nr category.");
  }
  counters.categories[category] += 1;

  // Update the JSON data
  jsonArray = jsonArray.map((entry) =>
    entry["Race Nr"] === raceNr
      ? {
          ...entry,
          Time: elapsedTime,
          "O/all Pos": counters.overall,
          "Cat Pos": counters.categories[category],
        }
      : entry
  );

  // Sort the JSON array by "O/all Pos" (non-blank values first, then blanks)
  jsonArray.sort((a, b) => {
    const posA = a["O/all Pos"];
    const posB = b["O/all Pos"];

    // Handle blank values: move them to the bottom
    if (posA == null || posA === "") return 1;
    if (posB == null || posB === "") return -1;

    // Sort non-blank values numerically
    return posA - posB;
  });

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
// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });
