const jwt=require("jsonwebtoken");
const User = require("../models/user");
const adminAuth =  (req, res, next) => {
    console.log(`admin auth checked`)
    const token='xayz';
    const isAdmninAuthenticated=token==='xyz';
    if(!isAdmninAuthenticated){
        res.status(401).send('Unauthorized request');
    }
    else{
       next(); 
    }

    console.log(`admin 1`); 
};
const userAuth =  async (req, res, next) => {
  try{
    const {token}=req.cookies;
    if(!token){
    return res.status(401).send("Please Login");
    }
    const decoded=jwt.verify(token,"devtinder@ashish");
    const{userId}=decoded;
    const user=await User.findById(userId);
    if(!user){
      throw new Error("User not found");
    }
    req.user=user;
    next();
  }catch (err) {
    res.status(401).send("Unauthorized request" + err.message);
  }
};
module.exports={
    adminAuth,
    userAuth
}