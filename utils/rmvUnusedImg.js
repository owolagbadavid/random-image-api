const cloudinary = require("cloudinary").v2;
const Image = require("../models/Image");
const fs = require("fs").promises;

const getAllUploadedImages = async () => {
  const stuff = await cloudinary.search
    .expression(
      "folder:cermuel-api" // add your folder
    )
    .sort_by("public_id", "desc")
    .execute();
  console.log(stuff);
  return stuff.resources.map((image) => {
    return image.public_id;
  });
};

const rmvUnusedImgs = async () => {
  const images = await getAllUploadedImages();
  for (let image of images) {
    const dbImage = await Image.findOne({
      imageURL: { $regex: image, $options: "i" },
    });
    if (!dbImage) {
      await cloudinary.uploader.destroy(image);
    }
  }
  return;
};

rmvTempImgs = async (req, res) => {
  await fs.unlink(req.files.image.tempFilePath);
  return;
};
module.exports = { rmvUnusedImgs, rmvTempImgs };
