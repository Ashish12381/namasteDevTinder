const Razorpay = require('razorpay');
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY_TEST,
  key_secret: process.env.RAZORPAY_API_SECRET_TEST,
});
module.exports = instance;