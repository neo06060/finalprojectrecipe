const Recipe = require('../models/Recipes');

// ✅ Create a new recipe (only if logged in)
exports.createRecipe = async (req, res) => {
  try {
    // Make sure user is authenticated
    if (!req.user || !req.user.username) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Build recipe data using body + logged-in user
    const recipeData = {
      recipeName: req.body.recipeName,
      description: req.body.description,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      username: req.user.username
    };

    const recipe = await Recipe.create(recipeData);
    res.status(201).json({ success: true, data: recipe });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json({ success: true, data: recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    if (recipe.username !== req.user.username) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this recipe' });
    }

    recipe.recipeName = req.body.recipeName || recipe.recipeName;
    recipe.description = req.body.description || recipe.description;
    recipe.ingredients = req.body.ingredients || recipe.ingredients;
    recipe.steps = req.body.steps || recipe.steps;

    const updatedRecipe = await recipe.save();
    res.status(200).json({ success: true, data: updatedRecipe });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    if (recipe.username !== req.user.username) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this recipe' });
    }

    await recipe.deleteOne();
    res.status(200).json({ success: true, message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
