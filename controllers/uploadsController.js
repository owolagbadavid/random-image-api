const {StatusCodes} = require('http-status-codes');

const CustomError = require('../errors');
const { rmvTempImgs } = require('../utils/rmvUnusedImg');
const cloudinary = require('cloudinary').v2;



const uploadProductImage = async (req, res)=>{

    if(!req.files){
        throw new CustomError.BadRequestError('no file Uploaded');
    }
    if(!req.files.image.mimetype.startsWith('image')){
        await rmvTempImgs(req, res)
        throw new CustomError.BadRequestError('please upload image');
    }
    const maxSize = 1024 * 1024;
    if(req.files.image.size > maxSize){
       await rmvTempImgs(req, res)
        throw new CustomError.BadRequestError('please upload image smaller than 1kB')
    }
    

const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename:true, folder:'cermuel-api',
})
await rmvTempImgs(req, res)
return res.status(StatusCodes.OK).json({image:{src:result.secure_url}})
  
} 

module.exports = {uploadProductImage}