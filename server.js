const express = require('express');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
});

app.post("/api/notes", (req, res)=>{
    console.log(req.body);
})