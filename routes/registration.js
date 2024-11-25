const express = require('express');
const Athlete = require('../models/Athlete');

const router = express.Router();

// POST /register - Collect all form data
router.post('/register', async (req, res) => {
  try {
    const data = req.body;

    const athlete = new Athlete({
      basicInformation: data.basicInformation,
      contactInformation: data.contactInformation,
      eventCategory: data.eventCategory,
      previousExperience: data.previousExperience,
      healthAndFitness: data.healthAndFitness,
      jerseyAndFood: data.jerseyAndFood,
      agreements: data.agreements,
      submissionDetails: data.submissionDetails,
    });

    await athlete.save();
    res.status(201).json({ message: 'Registration successful', athlete });
  } catch (error) {
    res.status(500).json({ message: 'Error registering athlete', error });
  }
});

module.exports = router;
