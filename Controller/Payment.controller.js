const { createRazorpayInstance } = require("../config/ragapay.config");
const razorpayInstance = createRazorpayInstance();
const crypto = require("crypto");
require("dotenv").config();

exports.createOrder = async (req, res) => {
  const { courseID, amount } = req.body;

  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the order",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${order_id}|${payment_id}`);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === signature) {
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
