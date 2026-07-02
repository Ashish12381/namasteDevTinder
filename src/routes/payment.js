const express = require("express");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const { userAuth } = require("../middleware/auth");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const User = require("../models/user");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100, // Amount in paise
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });
    console.log(order);
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();
    res.json({
      ...savedPayment.toJSON(),
      keyId: process.env.RAZORPAY_API_KEY_TEST,
    });
  } catch (err) {
    console.log(err);
  }
});
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("x-razorpay-signature");
   const isWebhookValid= validateWebhookSignature(
    JSON.stringify(req.body),
      webhookSignature,
      process.env.WEBHOOK_SECRET,
    );
    if(!isWebhookValid){
        return res.status(400).json({message:"Invalid webhook signature"});
    }
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    payment.status=paymentDetails.status;
    await payment.save();
   const user = await User.findOne({
  _id: payment.userId,
});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(user){
        user.isPremium=true;
        user.membershipType=paymentDetails.notes.membershipType;
        await user.save();
    }
    // if(req.body.event==="payment.captured"){
    // }
    // if(req.body.event==="payment.failed"){
    // }
    return res.status(200).json({ message: "Webhook received successfully" }); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = paymentRouter;
