const Joi = require('joi');

const createRatingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().optional().allow('')
});

const updateRatingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().optional().allow('')
}).min(1);

module.exports = { createRatingSchema, updateRatingSchema };
