import Joi from 'joi';
import logger from '../utils/logger.js';

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true, // Remove unknown fields
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            logger.warn(`Validation failed: ${JSON.stringify(errors)}`);

            return res.status(400).json({
                message: 'Validation failed',
                errors,
            });
        }

        // Replace req.body with validated and sanitized data
        req.body = value;
        next();
    };
};

// Trip data validation schema
export const validateTripData = validate(
    Joi.object({
        source: Joi.string().trim().min(2).max(200).required()
            .messages({
                'string.empty': 'Source location is required',
                'string.min': 'Source must be at least 2 characters',
                'string.max': 'Source must not exceed 200 characters',
            }),
        sourceDisplayName: Joi.string().trim().max(200).optional(),
        destination: Joi.string().trim().min(2).max(200).required()
            .messages({
                'string.empty': 'Destination location is required',
                'string.min': 'Destination must be at least 2 characters',
                'string.max': 'Destination must not exceed 200 characters',
            }),
        destinationDisplayName: Joi.string().trim().max(200).optional(),
        mode: Joi.string().valid('Car', 'Bus', 'Train', 'Bike', 'Walk', 'Cycle', 'Scooter').required()
            .messages({
                'any.only': 'Invalid transport mode',
                'any.required': 'Transport mode is required',
            }),
        distance: Joi.number().positive().max(50000).required()
            .messages({
                'number.positive': 'Distance must be a positive number',
                'number.max': 'Distance seems unrealistic (max 50,000 km)',
                'any.required': 'Distance is required',
            }),
        emission: Joi.number().min(0).max(100000).required()
            .messages({
                'number.min': 'Emission cannot be negative',
                'number.max': 'Emission value seems unrealistic',
                'any.required': 'Emission is required',
            }),
        vehicleId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().allow(null)
            .messages({
                'string.pattern.base': 'Invalid vehicle ID format',
            }),
        date: Joi.date().max('now').optional()
            .messages({
                'date.max': 'Trip date cannot be in the future',
            }),
    })
);

// Vehicle validation schema
export const validateVehicle = validate(
    Joi.object({
        vehicle_name: Joi.string().trim().min(2).max(100).required()
            .messages({
                'string.empty': 'Vehicle name is required',
                'string.min': 'Vehicle name must be at least 2 characters',
            }),
        vehicle_type: Joi.string().valid('Car', 'Bike', 'Scooter', 'Cycle').required()
            .messages({
                'any.only': 'Invalid vehicle type',
            }),
        vehicle_model: Joi.string().trim().min(1).max(100).required()
            .messages({
                'string.empty': 'Vehicle model is required',
            }),
        fuel_type: Joi.string().valid('Petrol', 'Diesel', 'Electric', 'Hybrid', 'Human Power').required()
            .messages({
                'any.only': 'Invalid fuel type',
            }),
        vehicle_manufacture_date: Joi.date().max('now').required()
            .messages({
                'date.max': 'Manufacture date cannot be in the future',
            }),
        vehicle_emission_rating: Joi.number().min(0).max(1000).required()
            .messages({
                'number.min': 'Emission rating cannot be negative',
                'number.max': 'Emission rating seems unrealistic',
            }),
        vehicle_engine_size: Joi.string().valid('Small', 'Medium', 'Large', 'Average', 'N/A').required()
            .messages({
                'any.only': 'Invalid engine size',
            }),
    })
);

// User registration validation schema
export const validateUserRegistration = validate(
    Joi.object({
        username: Joi.string().trim().alphanum().min(3).max(30).required()
            .messages({
                'string.alphanum': 'Username must contain only letters and numbers',
                'string.min': 'Username must be at least 3 characters',
                'string.max': 'Username must not exceed 30 characters',
            }),
        email: Joi.string().trim().email().lowercase().required()
            .messages({
                'string.email': 'Please provide a valid email address',
            }),
        password: Joi.string().min(8).max(128).required()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .messages({
                'string.min': 'Password must be at least 8 characters',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            }),
    })
);

// User login validation schema
export const validateUserLogin = validate(
    Joi.object({
        email: Joi.string().trim().email().lowercase().required()
            .messages({
                'string.email': 'Please provide a valid email address',
            }),
        password: Joi.string().required()
            .messages({
                'string.empty': 'Password is required',
            }),
    })
);

// Trip update validation schema
export const validateTripUpdate = validate(
    Joi.object({
        source: Joi.string().trim().min(2).max(200).optional(),
        sourceDisplayName: Joi.string().trim().max(200).optional(),
        destination: Joi.string().trim().min(2).max(200).optional(),
        destinationDisplayName: Joi.string().trim().max(200).optional(),
        mode: Joi.string().valid('Car', 'Bus', 'Train', 'Bike', 'Walk', 'Cycle', 'Scooter').optional(),
        distance: Joi.number().positive().max(50000).optional(),
        emission: Joi.number().min(0).max(100000).optional(),
        vehicleId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().allow(null),
    }).min(1) // At least one field must be provided
        .messages({
            'object.min': 'At least one field must be provided for update',
        })
);

export default {
    validateTripData,
    validateVehicle,
    validateUserRegistration,
    validateUserLogin,
    validateTripUpdate,
};
