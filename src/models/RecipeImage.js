// /src/models/RecipeImage.js
const mongoose = require('mongoose');

const recipeImageSchema = new mongoose.Schema({
  author: { type: String, required: true },
  recipeName: { type: String, required: true },
  image: {
    data: Buffer,          
    contentType: String   
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecipeImage', recipeImageSchema);
