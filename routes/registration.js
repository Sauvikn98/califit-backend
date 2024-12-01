const express = require('express');
const Athlete = require('../models/Athlete');
const nodemailer = require('nodemailer');
const EventCategory = require('../models/EventCategory');
const mongoose = require('mongoose');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use another service like SendGrid or Mailgun
  auth: {
    user: 'califitguwahati@gmail.com',  // Replace with your email
    pass: 'ttehouzeemklotkz',   // Replace with your email password or use OAuth2
  },
});

// POST /register - Collect all form data
router.post('/register', async (req, res) => {
  try {
    const data = req.body;

    // Convert eventCategory strings to ObjectIds
    const eventCategoryIds = data.eventCategory.map((id) => new mongoose.Types.ObjectId(id));

    // Find EventCategory documents based on the ObjectIds
    const eventCategories = await EventCategory.find({ '_id': { $in: eventCategoryIds } });

    // Create a new athlete document
    const athlete = new Athlete({
      basicInformation: data.basicInformation,
      contactInformation: data.contactInformation,
      eventCategory: eventCategoryIds,  // Store an array of ObjectIds
      previousExperience: data.previousExperience,
      healthAndFitness: data.healthAndFitness,
      jerseyAndFood: data.jerseyAndFood,
      agreements: data.agreements,
      submissionDetails: data.submissionDetails,
    });

    await athlete.save();

    // Get the names of the event categories to include in the email
    const eventCategoryNames = eventCategories.map(category => category.name).join(', ');

    // Email template
    const emailTemplate = {
      from: 'sauviknath2023@gmail.com',  // Sender's email
      to: athlete.contactInformation.email,  // Athlete's email
      subject: 'Registration Confirmed for Cali Games 3.0! 🎉',
      html: `
        <p>Dear ${athlete.basicInformation.fullName},</p>
        <p>Congratulations! Your registration for Cali Games 3.0 is confirmed.</p>
        <p><strong>📅 Event Dates:</strong> January 25-26, 2025</p>
        <p><strong>📍 Venue:</strong> Royal Global School, Guwahati</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li><strong>Registration ID:</strong> ${athlete._id}</li>
          <li><strong>Categories:</strong> ${eventCategoryNames}</li>
        </ul>
        <p>Event schedule and check-in details will be shared soon.</p>
        <p>For updates, follow us on Instagram at <strong>califit_calisthenics</strong>.</p>
        <p>Got questions? Contact us at <strong>califitguwahati@gmail.com</strong> or <strong>8811056318</strong>.</p>
        <p>See you at the event! 💪</p>
        <p>Best regards,<br/>Team CaliFit</p>
      `,
    };

    // Send the email
    await transporter.sendMail(emailTemplate);

    res.status(201).json({ message: 'Registration successful', athlete });
  } catch (error) {
    res.status(500).json({ message: 'Error registering athlete', error });
  }
});

module.exports = router;
