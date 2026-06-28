require("dotenv").config();
console.log("========== ENV ==========");
console.log(process.env.AWS_ACCESS_KEY);
console.log(process.env.AWS_SECRET_KEY);
console.log("=========================");
const express = require("express");
const app = express();

const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser=require("cookie-parser");
const cors=require("cors");
app.use(cors({
  origin: "http://localhost:5173",
    credentials: true,
}))
const jwt=require("jsonwebtoken");
app.use(cookieParser());
app.use(express.json());
const { validateSignupData } = require("./utils/validate");
const bcrypt = require("bcrypt");
const {  userAuth } = require("./middleware/auth");
const authRouter=require('./routes/auth')
const profileRouter=require('./routes/profile');
const requestRouter=require('./routes/request');
const userRouter = require("./routes/user");



app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter)
app.use("/",userRouter)






connectDB()
  .then(() => {
    console.log("connected to database");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("error connecting to database", err);
  });
