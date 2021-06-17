const express = require("express");
const app = express();
const path = require("path");
const {
  models: { Artist },
} = require("./db");

app.use("/dist", express.static(path.join(__dirname, "dist")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.get("/api/artists", async (req, res, next) => {
  try {
    res.send(
      await Artist.findAll({
        order: [["name"]],
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.get();

module.exports = app;
