const express = require('express');
const EventCategory = require('../models/EventCategory');

const router = express.Router();

/**
 * Create a new event category
 */
router.post('/create', async (req, res) => {
  try {
    const { name, gender, rate, restrictions } = req.body;

    // Validate input
    if (!name || !gender || !rate) {
      return res.status(400).json({ message: 'Name, gender, and rate are required.' });
    }

    // Create a new category
    const category = new EventCategory({
      name,
      gender,
      rate,
      restrictions,
    });

    await category.save();
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
});

/**
 * Get all event categories
 */
router.get('/all', async (req, res) => {
  try {
    const categories = await EventCategory.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

/**
 * Get a single event category by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await EventCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error });
  }
});

/**
 * Update an event category by ID
 */
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, rate, restrictions } = req.body;

    // Validate input
    if (!name && !gender && !rate && !restrictions) {
      return res.status(400).json({ message: 'At least one field is required to update.' });
    }

    // Find and update the category
    const category = await EventCategory.findByIdAndUpdate(
      id,
      { name, gender, rate, restrictions },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
});

/**
 * Delete an event category by ID
 */
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await EventCategory.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
});

module.exports = router;
