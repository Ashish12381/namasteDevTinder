const express=require("express");
const app = express();
const authRouter=express.Router();
const User=require("../models/user")
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
app.use(cookieParser());
app.use(express.json());
const { validateSignupData } = require("../utils/validate");
const bcrypt = require("bcrypt");
const {  userAuth } = require("../middleware/auth");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: passwordHash,
      age: req.body.age,
      gender: req.body.gender,
      skills: req.body.skills,
      about: req.body.about,
    });
    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("Error signing up user" + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const isPasswordValid = await user.ValidatePassword(password);
    if (isPasswordValid) {
      // dummy cookie send to the user
      // res.cookie("token", "dummyToken");
      //create jwt token and send to the user
      const token = await user.getJWT();
      res.cookie("token", token); 
      res.send("Login successful");
    } else {
      return res.status(400).send("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error logging in" + err.message);
  }
});
authRouter.post("/logout", async(req,res)=>{
    res.cookie("token",null,({
        expires:new Date(Date.now())
    }));
    res.send("logout successful")
})

module.exports=authRouter