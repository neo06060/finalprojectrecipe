const Rating = require('../models/Ratings');
const Recipe = require('../models/Recipes');

// ✅ Get all ratings for a specific recipe (with recipe name + chef)
exports.getRatingsByRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;

    // Filtramos ratings por receta
    const ratings = await Rating.find({ recipe: recipeId }).populate({
      path: 'recipe',
      select: 'recipeName username'
    });

    res.json({ success: true, count: ratings.length, data: ratings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// ✅ Get a specific rating (with recipe name + chef)
exports.getRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id).populate({
      path: 'recipe',
      select: 'recipeName username'
    });
    if (!rating)
      return res.status(404).json({ success: false, message: 'Rating not found' });

    res.json({ success: true, data: rating });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// ✅ Create a rating for a specific recipe (auth required)
exports.createRating = async (req, res) => {
  try {
    if (!req.user || !req.user.username) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { rating, comment } = req.body;
    const recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const newRating = await Rating.create({
      recipe: recipeId,
      reviewer: req.user.username,
      rating,
      comment
    });

    res.status(201).json({ success: true, message: 'Rating added successfully', data: newRating });
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// ✅ Update a rating (only the reviewer can update)
exports.updateRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating)
      return res.status(404).json({ success: false, message: 'Rating not found' });

    if (rating.reviewer !== req.user.username) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this rating' });
    }

    rating.rating = req.body.rating || rating.rating;
    rating.comment = req.body.comment || rating.comment;
    const updated = await rating.save();

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// ✅ Delete a rating (only the reviewer can delete)
exports.deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating)
      return res.status(404).json({ success: false, message: 'Rating not found' });

    if (rating.reviewer !== req.user.username) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this rating' });
    }

    await rating.deleteOne();
    res.json({ success: true, message: 'Rating successfully deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
