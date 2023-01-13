const express = require('express');
const router = express.Router()

const {
    register, 
    login,
    logout,
} = require('../controllers/authController');
const rateLimiter = require('express-rate-limit');

const registerLimiter = rateLimiter({
  windowMs: 7 * 24 * 60 * 60 * 1000,
  max: 3,
  message: {
    msg: "Too many atempts from this IP, please try again in 1 week"
  }
});

const loginLimiter = rateLimiter({
    windowMs: 24 * 60 * 60 * 1000,
    max: 3,
    message: {
      msg: "Too many atempts from this IP, please try again in 24 hours"
    }
  })



router.route('/register').post(registerLimiter, register)
router.route('/login').post(loginLimiter, login)
router.route('/logout').get(logout)

module.exports = router;
