const Joi = require ('joi');

const createRecipeSchema = Joi.object({
    recipe: Joi.string().min(1).required(),
    chef: Joi.string().min(1).required(),
    ingredients: Joi.string().min(1).required,
    steps: Joi.string().min(1).required(),
    publishedDate: Joi.date().optional()
});

const updateRecipeSchema = Joi.object({
    recipe: Joi.string().min(1).optional(),
    chef: Joi.string().min(1).optional(),
    ingredients: Joi.string().min(1).optional(),
    steps: Joi.string().min(1).optional(),
    publishedDate: Joi.date().optional(),
}).min(1);

module.exports = {createRecipeSchema, updateRecipeSchema};