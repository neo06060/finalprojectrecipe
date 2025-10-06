const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const validate = require('../middleware/validateRequest');
const { createRecipeSchema, updateRecipeSchema } = require('../validators/recipeValidator');
const authenticateJWT = require('../middleware/authenticateJWT');

// Public routes
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipes);

// Protected routes
router.post('/', authenticateJWT, validate(createRecipeSchema), recipeController.createRecipe);
router.put('/:id', authenticateJWT, validate(updateRecipeSchema), recipeController.updateRecipe);
router.delete('/:id', authenticateJWT, recipeController.deleteRecipe);

module.exports = router;
