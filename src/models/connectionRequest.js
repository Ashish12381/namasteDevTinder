const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: '{VALUE} is incorrect status type',
      },
    },
  },
  { timestamps: true },
);
connectionRequestSchema.index({fromUserID:1,toUserID:1});
connectionRequestSchema.pre("save", function(next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserID && connectionRequest.toUserID) {
    if (connectionRequest.fromUserID.equals(connectionRequest.toUserID)) {
      return next(new Error("cannot send request to yourself"));
    }
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequest;
