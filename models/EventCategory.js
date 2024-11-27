const mongoose = require('mongoose');

const EventCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'both'], default: 'both' },
  rate: { type: Number, required: true },
  restrictions: { type: String, default: '' }, 
});

module.exports = mongoose.model('EventCategory', EventCategorySchema);
