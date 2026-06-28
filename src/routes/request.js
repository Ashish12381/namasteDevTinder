const express=require("express");
const requestRouter=express.Router();
const { userAuth } = require('../middleware/auth');
const ConnectionRequest=require("../models/connectionRequest")
const User=require("../models/user")
const sendEmail=require("../utils/sendEmail")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId=req.user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status;
    const allowedStatus=["ignored","interested"];
    if(!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"+" "+status,
      })
    }
    const toUser=await User.findOne({_id:toUserId});
    if(!toUser) {
      return res.status(404).json({
        message: "User not found "+toUserId
      })
    }
    const checkExistingConnectionRequest=await ConnectionRequest.find({
      $or:[
        { fromUserID: fromUserId, toUserID: toUserId },
        { fromUserID: toUserId, toUserID: fromUserId },
      ]
    })
    if(checkExistingConnectionRequest.length > 0) {
      return res.status(400).send({
        message:"Connection Request already sent"
      })
    }
    const connectionRequest=new ConnectionRequest({
      fromUserID: fromUserId,
      toUserID: toUserId,
      status,
    })
    const data=await connectionRequest.save();
    const emailRes=await sendEmail.run();
    console.log("emailres"+emailRes)
    res.json({
      message:"Connection Request sent successfully",
      data,
    })
  
  } catch (err) {
    res.status(400).send("Error sending connection request" + err.message);
  }
});
requestRouter.post("/request/review/:status/:requestId",userAuth, async(req, res, next) => {
  try {
    const loggedInUser=req.user;
    const {status,requestId}=req.params;
    const allowedStatus=["accepted","rejected"];
    if(!allowedStatus.includes(status)) {
      return res.status(400).json({
        message:"Status not allowed",
      })
    }
    const connectionRequest=await ConnectionRequest.findOne({
      _id: requestId,
      toUserID:loggedInUser,
      status:"interested",
    })
    if(!connectionRequest) {
      res.status(404).json({
        message:"Connection Request not found"
      })
    } 
    connectionRequest.status=status;
    const data=await connectionRequest.save();

res.json({
  message:"connection Request "+ status,data
})
  } catch (err) {
    res.status(400).send(err.message);
  } 
}  )
module.exports=requestRouter