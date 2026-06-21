const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender skills about photoUrl";

userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserID: loggedInUser._id,
      status: "interested",
    }).populate("fromUserID", USER_SAFE_DATA);

    res.json({
      message: "Fetched all the pending request",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("error " + err.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserID: loggedInUser._id, status: "accepted" },
        { fromUserID: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserID", USER_SAFE_DATA)
    .populate("toUserID",USER_SAFE_DATA);
    if (connectionRequest.length === 0) {
      throw new Error("No request at all");
    }
    const data = connectionRequest.map((row) => {
        if(row.fromUserID._id.toString()===loggedInUser._id.toString()) {
            return row.toUserID;
        }
        else{
            return row.fromUserID;
        }
    });
    res.json({ data: data });
  } catch (err) {
    res.status(400).send("error " + err.message);
  }
});
userRouter.get("/feed",userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const page=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;
        limit=limit>50?50:limit;
        const skip=(page-1)*limit;
        const connectionRequests=await ConnectionRequest.find({
            $or:[{fromUserID:loggedInUser._id},
                {toUserID:loggedInUser._id, }
            ]
        }).select("fromUserID toUserID")

        const hideUsersFromFeed=new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserID.toString());
            hideUsersFromFeed.add(req.toUserID.toString());
        })
        const users=await user.find({
            $and:[
                {_id:{$nin:Array.from(hideUsersFromFeed)}},
                {_id:{$ne:loggedInUser._id}},
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        res.json({ users });

    }catch(err){
        res.status(404).send("Error "+err.message);
    }
})

module.exports = userRouter;
