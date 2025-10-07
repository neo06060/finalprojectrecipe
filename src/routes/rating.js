const express = require('express');
const router = express.Router({ mergeParams: true });
const ratingController = require('../controllers/ratingsController');
const validate = require('../middleware/validateRequest');
const { createRatingSchema, updateRatingSchema } = require('../validators/ratingValidator');
const authenticateJWT = require('../middleware/authenticateJWT');

// Public routes
router.get('/', ratingController.getAllRatings);
router.get('/:id', ratingController.getRating);

// Protected routes (auth required)
router.post('/', authenticateJWT, validate(createRatingSchema), ratingController.createRating);
router.put('/:id', authenticateJWT, validate(updateRatingSchema), ratingController.updateRating);
router.delete('/:id', authenticateJWT, ratingController.deleteRating);

module.exports = router;
