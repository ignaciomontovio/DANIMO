const Joi = require('joi');

// ------------------------ Professionals --------------------------

exports.validateRegisterInput = (data) => Joi.object({
    password: Joi.string().min(5).max(15).required(),
    firstName: Joi.string().alphanum().min(3).max(30).required(),
    lastName: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    profession: Joi.string().valid('Psicologo', 'Psiquiatra').required()
}).validate(data);

exports.validateLoginInput = (data) => Joi.object({
    email: Joi.string().min(3).max(40).required(),
    password: Joi.string().min(5).max(15).required(),
}).validate(data);

exports.validateGoogleToken = (data) => Joi.object({
    googleJWT: Joi.required()
}).validate(data);
// ------------------------ Users --------------------------------
exports.validateRegisterInput = (data) => Joi.object({
    password: Joi.string().min(5).max(15).required(),
    firstName: Joi.string().alphanum().min(3).max(30).required(),
    lastName: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
}).validate(data);

exports.validateLoginInput = (data) => Joi.object({
    email: Joi.string().min(3).max(40).required(),
    password: Joi.string().min(5).max(15).required(),
}).validate(data);

exports.validateGoogleToken = (data) => Joi.object({
    googleJWT: Joi.required()
}).validate(data);
