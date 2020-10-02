const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
let database = require("./db/db.json");
const uuid = require("uuid");

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

//Post a new note
app.post("/api/notes", function (req, res) {
  const newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text,
  };
  //   console.log(typeof uuid.v4());
  if (!newNote.title) {
    res.status(400).json({ message: "Please give your note a title." });
  }
  database.push(newNote);
  res.json(database);
});

//DELETE a note

app.delete("/api/notes/:id", (req, res) => {
  //   console.log(typeof req.params.id);
  let found = database.some((note) => note.id === req.params.id);
  if (found) {
    database = database.filter((note) => note.id !== req.params.id);
    res.json({
      message: `Note ${req.params.id} deleted`,
    });
  } else {
    res.status(400).json({
      message: "No note with that ID was found.",
    });
  }
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

var PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
