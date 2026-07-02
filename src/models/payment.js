const { timeout } = require("cron");
const mongoose = require("mongoose");
const Payment = require("../models/payment");
const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref:"User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      required: true,
    },
  },
  (timeStamps = true),
);
module.exports = mongoose.model("payment", paymentSchema);
