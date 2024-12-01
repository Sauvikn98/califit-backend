const express = require('express');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Athlete = require('../models/Athlete');
const crypto = require('crypto');
const dotenv = require("dotenv");
const nodemailer = require('nodemailer');
dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: "rzp_test_wPyvsML5e6gY59",
  key_secret: "WUSTTl96tsecuO0AWJYO6q62",
});

router.post('/create-order', async (req, res) => {
  try {
    const { athleteId, amount, categories } = req.body;

    // Create a Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise (smallest unit of INR)
      currency: 'INR',
      receipt: `receipt_${athleteId}_${Date.now()}`,
    });

    if (!order) {
      return res.status(500).json({ message: 'Failed to create Razorpay order' });
    }

    // Save payment record including category details
    const payment = new Payment({
      orderId: order.id,
      amount: order.amount / 100, // Convert back to INR
      currency: order.currency,
      categories, // Save associated categories
    });

    await payment.save();

    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order', error });
  }
});



router.post('/verify-payment', async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log('Verify Payment Request:', req.body);


    // Retrieve the payment record and populate categories for clarity
    const payment = await Payment.findOne({ orderId }).populate('categories');
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    // Verify the Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', "WUSTTl96tsecuO0AWJYO6q62")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update payment status and save
    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = 'successful';
    payment.updatedAt = Date.now();

    await payment.save();

    res.status(200).json({ message: 'Payment verified successfully', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error });
  }
});


module.exports = router;