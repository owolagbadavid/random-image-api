const mongoose = require("mongoose");
const CustomError = require("../errors");
const cloudinary = require("cloudinary").v2;

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  imageURL: {
    type: String,
    required: true,
  },
});

ImageSchema.pre("save", async function () {
  const start = this.imageURL.indexOf("cermuel-api");
  const stop = this.imageURL.lastIndexOf(".");
  const public_id = this.imageURL.substring(start, stop);

  try {
    const image = await cloudinary.uploader.explicit(public_id, {
      type: "upload",
    });
  } catch (error) {
    throw new CustomError.BadRequestError(
      "Image is not available on the cloud"
    );
  }
});

module.exports = mongoose.model("Image", ImageSchema);
