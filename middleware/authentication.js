const CustomError = require('../errors')
const jwt = require('jsonwebtoken');


const authenticateUser = async (req, res, next)=>{

  const token = req.signedCookies.token

  if(!token){
      throw new CustomError.UnauthenticatedError('Authentication Invalid')
  }

  try{
const payload =  jwt.verify(token, process.env.JWT_SECRET);
req.user = {name:payload.name, userId:payload.userId, role:payload.role}

next()
  }
  catch(err){
      throw new CustomError.UnauthenticatedError('Authentication Invalid')
  }
  
}

module.exports = authenticateUser;