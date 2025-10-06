const mongoose = require ('mongoose');

const recipeSchema = new mongoose.Schema({
    recipe:  { type: String, required: true},
    chef: { type: String, required: true},
    ingredients:   { type: String, required: true},
    steps:  { type: String, required: true},
    publishedDate:  { type: Date},
});

module.exports = mongoose.model('Recipe', recipeSchema);