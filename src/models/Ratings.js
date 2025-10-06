const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    Recipe:   { type: String, ref: 'Recipe', required: true},
    reviewer: { type: String, required: true},
    rating: { type: Number, required: true, min: 1, max: 5},
    comment:    { type: String},
});

module.exports = mongoose.model('Rating', ratingSchema);
