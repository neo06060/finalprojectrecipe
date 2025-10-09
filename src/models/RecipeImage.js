const mongoose = require('mongoose');

const recipeImageSchema = new mongoose.Schema({
  author: { type: String, required: true },
  recipeId: { type: String, required: true },
  image: {
    data: Buffer,
    contentType: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecipeImage', recipeImageSchema);
