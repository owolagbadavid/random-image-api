const express = require('express');
const router = express.Router();


const {uploadProductImage} = require('../controllers/uploadsController');
const {
    createImage,
    getAllImages,
    getRandomImage,
} = require('../controllers/imageController');
const authenticateUser = require('../middleware/authentication');

router.route('/').post(authenticateUser,createImage).get(getAllImages);
router.route('/random').get(getRandomImage)
router.route('/uploads').post(authenticateUser,uploadProductImage)

module.exports = router;