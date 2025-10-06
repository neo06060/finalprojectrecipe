const Recipe = require('../models/Recipes');

exports.getAllRecipes = async (req, res) => {
    const recipes = await Recipe.find();
    res.json({ success: true, count: recipes.length, data: recipes});
};

exports.getRecipe = async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found, try again.'});
    res.json({ success: true, data: recipe});
};

exports.createRecipe = async (req, res) => {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({ success: true, data: recipe});
};

exports.updateRecipe = async (req, res) => {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found, try again.'});
    res.json({ success: true, data: recipe});
};

exports.deleteRecipe = async (req, res) => {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found, try again.'});
    res.json({ success: true, message: 'Recipe successfully deleted'});
};