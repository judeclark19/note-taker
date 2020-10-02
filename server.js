const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const database = require("./db/db.json");
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
  if (!newNote.title) {
    res.status(400).json({ message: "Please give your note a title." });
  }
  database.push(newNote);
  res.json(database);
});

//Edit a note in the api
app.put("/api/notes/:id", (req, res) => {
  const found = database.some((note) => note.id === parseInt(req.params.id));
  if (found) {
    const editedNoteBody = req.body;
    database.forEach((note) => {
      if (note.id === parseInt(req.params.id)) {
        note.title === req.body.title;
        note.text === req.body.text;
      }
    });
  } else {
    res
      .status(400)
      .json({ error: `No note found with the ID of ${req.params.id}` });
  }
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
var PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
