const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const database = require("./db/db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(database);
});

app.get("/api/notes/:id", (req, res) => {
  // GET A SPECIFIC NOTE

  //"Found" = true or false if that id is found in our database
  const found = database.some((note) => note.id === parseInt(req.params.id));
  if (found) {
    res.json(database.filter((note) => note.id === parseInt(req.params.id)));
  } else {
    res
      .status(400)
      .json({ error: `No note found with the ID of ${req.params.id}` });
  }
});

app.post("/api/notes", function (req, res) {
  database.push(req.body);
  fs.writeFile(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(database),
    function (err) {
      if (err) throw err;
      console.log("Successfully posted client note to database");
    }
  );
  res.json(req.body);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "./public/index.html"));
// });

var PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
