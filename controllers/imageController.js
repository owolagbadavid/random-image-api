const Image = require('../models/Image')
const {StatusCodes} = require('http-status-codes');

const createImage = async (req, res)=>{

    const image = await Image.create(req.body)
    res.status(StatusCodes.CREATED).json({image})
}


const getAllImages = async (req, res)=>{
    const images = await Image.find({});
    res.status(StatusCodes.OK).json({images})
}

const getRandomImage = async (req, res)=>{
    const count = await Image.countDocuments({});

    const randomNum = Math.floor(Math.random() * count);
    console.log(count, randomNum);
    const image = await Image.find().skip(randomNum).limit(1);
    res.status(StatusCodes.OK).json({randomImage:image[0]});
}

module.exports ={createImage, getAllImages, getRandomImage,};