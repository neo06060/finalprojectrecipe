const Joi = require('joi');

// Schema for creating a new recipe
const createRecipeSchema = Joi.object({
  recipeName: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Recipe name cannot be empty',
    'any.required': 'Recipe name is required'
  }),
  description: Joi.string().min(5).required().messages({
    'string.empty': 'Description cannot be empty',
    'any.required': 'Description is required'
  }),
  ingredients: Joi.array().items(Joi.string().min(1)).min(1).required().messages({
    'array.base': 'Ingredients must be an array of strings',
    'array.min': 'At least one ingredient is required'
  }),
  steps: Joi.array().items(Joi.string().min(1)).min(1).required().messages({
    'array.base': 'Steps must be an array of strings',
    'array.min': 'At least one step is required'
  })
});

// Schema for updating a recipe
const updateRecipeSchema = Joi.object({
  recipeName: Joi.string().min(3).max(100),
  description: Joi.string().min(5),
  ingredients: Joi.array().items(Joi.string().min(1)),
  steps: Joi.array().items(Joi.string().min(1))
}).min(1); // Must include at least one field

module.exports = { createRecipeSchema, updateRecipeSchema };
