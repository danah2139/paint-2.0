const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const { getAllImages, addImage, deleteAllImages } = require("./utils");

// get all images
app.get("/api/images", (req, res) => {
  let movies = getAllImages();
  res.json(movies);
});

// add an image
app.post("/api/images", (req, res) => {
  try {
    console.log("test");
    const image = addImage(req.body);
    res.status(201).send(image);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

//delete all images
app.delete("/api/images", (req, res) => {
  try {
    deleteAllImages();
    res.status(200).send("ok");
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
