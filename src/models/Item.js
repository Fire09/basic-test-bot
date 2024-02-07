const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  guildId: {
    type: String,
    required: null,
  },
  userId: {
    type: String,
    required: true,
  },
  inventory: {
    type: [String], // Array of strings
    default: [], // Default value as an empty array
  },
});

module.exports = model('Item', itemSchema);