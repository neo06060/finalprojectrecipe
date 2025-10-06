const Ratings = require('../models/Ratings');

exports.getAllRatings = async (req, res) => {
    const rating = await Ratings.find();
    res.json({ success: true, count: reviews.length, data: rating});
};

exports.getRating = async (req, res) => {
    const rating = await Ratings.findById(req.params.id);
    if (!rating) return res.status(404).json({ success: false, message: 'Rating not found, try again.'});
    res.json({ success: true, data: rating});
};

exports.createRating = async (req, res) => {
    const rating = await Ratings.create(req.body);
    res.status(201).json({ success: true, data: rating});
};

exports.updateRating = async (req, res) => {
    const rating = await Ratings.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    if (!rating) return res.status(404).json({ success: false, message: 'Rating not found, try again.'});
    res.json({ success: true, data: rating});
};

exports.deleteRating = async (req, res) => {
    const rating = await Ratings.findByIdAndDelete(req.params.id);
    if (!rating) return res.status(404).json({ success: false, message: 'Rating not found, try again.'});
    res.json({ success: true, message: 'Rating successfully deleted'});
};
