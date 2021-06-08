const fs = require("fs");

const loadImages = () => {
  try {
    const dataBuffer = fs.readFileSync("images.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (error) {
    return [];
  }
};

const saveImages = (images) => {
  const dadaJSON = JSON.stringify(images);
  fs.writeFileSync("images.json", dadaJSON);
};

const addImage = (image) => {
  const images = loadImages();
  images.push(image);
  saveImages(images);
};

const getAllImages = () => {
  return loadImages();
};

const deleteAllImages = () => {
  saveImages([]);
};

module.exports = { addImage, deleteAllImages, getAllImages };
