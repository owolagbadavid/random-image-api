const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const jwt = require("jsonwebtoken");



const createTokenUser = ({name, _id})=>{
    return {name, userId:_id};
}
const register = async (req, res)=>{
    const {email, name, password} = req.body;

//first registered user is admin

const isFirstAccount = await User.countDocuments({}) === 0;
if(!isFirstAccount){
    throw new CustomError.BadRequestError("This API is restricted to only one Adminstrative User")
}
    const user = await User.create({name, email, password})
    
    const tokenUser = createTokenUser(user);
    const token = jwt.sign(tokenUser, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
      });
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure:process.env.NODE_ENV === 'production' ,
      signed:true
    });
  
    res.status(StatusCodes.CREATED).json({user:tokenUser});
}

const login = async (req, res)=>{

    const {email, password} = req.body;

    if(!email || !password){
        throw new CustomError.BadRequestError("Please peovide email and password");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError("Invalid credentials");
    }
    const tokenUser = createTokenUser(user);
    const token = jwt.sign(tokenUser, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
      });
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure:process.env.NODE_ENV === 'production' ,
      signed:true
    });
   res.status(StatusCodes.OK).json({user:tokenUser});
}

const logout = async (req, res)=>{
    res.cookie('token', 'logout', {
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    res.status(StatusCodes.OK).json({msg:"User logged out!!"})
}

module.exports = {
    register, 
    login,
    logout,
}


  