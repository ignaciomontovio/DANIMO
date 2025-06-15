const Joi = require('joi');

// ------------------------ Professionals --------------------------

exports.validateRegisterInputProf = (data) => Joi.object({
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\={};:"|,.<>?]).{8,}$'))
        .required()
        .messages({
            'any.required': 'La contraseña es obligatoria.',
            'string.empty': 'La contraseña es obligatoria.',
            'string.pattern.base': 'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo.',
        }),
    firstName: Joi.string().alphanum().min(3).max(30).required().messages({
        'any.required': 'El nombre es obligatorio.'
    }),
    lastName: Joi.string().alphanum().min(3).max(30).required().messages({
        'any.required': 'El apellido es obligatorio.'
    }),
    email: Joi.string().email().lowercase().required().messages({
        'any.required': 'El email es obligatorio.',
        'string.email': 'El email no es válido.',
        'string.empty': 'El email es obligatorio.'
    }),
    profession: Joi.string().valid('Psicologo', 'Psiquiatra').required(),
    birthDate: Joi.date().iso().optional(),
    gender: Joi.string().valid('Masculino', 'Femenino', 'No Binario', 'Prefiero no decir').required()
}).validate(data);

exports.validateLoginInputProf = (data) => Joi.object({
    email: Joi.string().email().lowercase().required().messages({
        'any.required': 'El email es obligatorio.',
        'string.email': 'El email no es válido.',
        'string.empty': 'El email es obligatorio.'
    }), password: Joi.string().min(5).max(15).required(),
}).validate(data);

exports.validateGoogleTokenProf = (data) => Joi.object({
    googleJWT: Joi.required()
}).validate(data);
// ------------------------ Users --------------------------------
exports.validateRegisterInput = (data) => Joi.object({
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\={};:"|,.<>?]).{8,}$'))
        .required()
        .messages({
            'any.required': 'La contraseña es obligatoria.',
            'string.empty': 'La contraseña es obligatoria.',
            'string.pattern.base': 'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo.',
        }),
    firstName: Joi.string().alphanum().min(3).max(30).required().messages({
        'any.required': 'El nombre es obligatorio.'
    }),
    lastName: Joi.string().alphanum().min(3).max(30).required().messages({
        'any.required': 'El apellido es obligatorio.'
    }),
    email: Joi.string().lowercase().email().required().messages({
        'any.required': 'El email es obligatorio.',
        'string.email': 'El email no es válido.',
        'string.empty': 'El email es obligatorio.'
    }),
    birthDate: Joi.date().iso().optional(),
    gender: Joi.string().valid('Masculino', 'Femenino', 'No Binario', 'Prefiero no decir').required()
}).validate(data);

exports.validateLoginInput = (data) => Joi.object({
    email: Joi.string().lowercase().email().required().messages({
        'any.required': 'El email es obligatorio.',
        'string.email': 'El email no es válido.',
        'string.empty': 'El email es obligatorio.'
    }), password: Joi.string().min(5).max(15).required(),
}).validate(data);

exports.validateGoogleToken = (data) => Joi.object({
    googleJWT: Joi.required()
}).validate(data);

exports.validateForgotPassword = (data) => Joi.object({
    email: Joi.string().email().lowercase().required().messages({
        'any.required': 'El email es obligatorio.',
        'string.email': 'El email no es válido.',
        'string.empty': 'El email es obligatorio.'
    })
}).validate(data);

exports.validateResetPassword = (data) => Joi.object({
    tokenId: Joi.string().required(), password: Joi.string().min(5).max(15).required(),
}).validate(data);

exports.validateToken = (data) => Joi.object({
    tokenId: Joi.string().required(), email: Joi.string().email().lowercase().required().messages({
        'any.required': 'El email es obligatorio.',
        'string.email': 'El email no es válido.',
        'string.empty': 'El email es obligatorio.'
    })
}).validate(data);

exports.validateUpdateInput = (data) => Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    occupation: Joi.string().optional(),
    gender: Joi.string()
        .valid('Masculino', 'Femenino', 'No Binario', 'Prefiero no decir')
        .optional(),
    birthDate: Joi.date().iso().optional(),
    livesWith: Joi.string().optional()
}).validate(data);
// ----------------------Emotions --------------------------

exports.validateEmotionRegisterInput = (data) => {
    const schema = Joi.object({
        emotion: Joi.number()
            .integer()
            .min(1)
            .max(5)
            .required()
            .messages({
                'number.base': 'El campo emoción debe ser un número.',
                'number.min': 'El número de emoción debe ser al menos 1.',
                'number.max': 'El número de emoción no puede ser mayor a 5.',
                'any.required': 'El número de emoción es obligatorio.'
            }),
        isPredominant: Joi.boolean().required().messages({
            'boolean.base': 'El campo "isPredominant" debe ser booleano.',
            'any.required': 'El campo "isPredominant" es obligatorio.'
        }),
        activities: Joi.array().items(Joi.string()).required().messages({
                'array.base': 'El campo "activities" debe ser una lista.',
                'any.required': 'Debe indicar al menos una actividad.'
            }),
        photo: Joi.string().optional()
    });
    return schema.validate(data);
};

// ----------------------Sleeps --------------------------

exports.validateSleepRegisterInput = (data) => {
    const schema = Joi.object({
        bedtime: Joi.date().iso().required()
            .messages({
                'date.base': `"bedtime" debe ser una fecha ISO válida (ej. 2025-06-13T22:50:00.000Z)`, 
                'any.required': `"bedtime" es obligatorio`
            }), wake: Joi.date().iso().greater(Joi.ref('bedtime')).required()
            .messages({
                'date.base': `"wake" debe ser una fecha ISO válida (ej. 2025-06-14T07:00:00.000Z)`,
                'date.greater': `"wake" debe ser posterior a "bedtime"`,
                'any.required': `"wake" es obligatorio`
            })
    });
    return schema.validate(data);
};

// ----------------------Activities --------------------------

exports.validateActivityRegisterInput = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required(),
        category: Joi.string().valid('Trabajo', 'Estudio', 'Hobby', 'Hogar').required(),
        date: Joi.date().iso().required(), //dailyRegisterId: Joi.string().pattern(/^U-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i).required(),
    });
    return schema.validate(data);
};

// ----------------------Emergency Contacts --------------------------

exports.validateEmergencyContactInput = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required().messages({
                'string.base': 'El nombre debe ser un texto.',
                'string.empty': 'El nombre no puede estar vacío.',
                'any.required': 'El nombre es obligatorio.'}),
        phoneNumber: Joi.string().min(1).max(18).required().messages({
                'string.base': 'El número de teléfono debe ser un texto.',
                'string.empty': 'El número de teléfono no puede estar vacío.',
                'string.max': 'El número de teléfono no puede superar los 18 caracteres.',
                'any.required': 'El número de teléfono es obligatorio.'
            }),
        who: Joi.string().required().messages({
                'string.base': 'El campo "¿quién es?" debe ser un texto.',
                'string.empty': 'El campo "¿quién es?" no puede estar vacío.',
                'any.required': 'El campo "¿quién es?" es obligatorio.'
            })
    });
    return schema.validate(data);
};

exports.validateUpdateEmergencyContactInput = (data) => {
    const schema = Joi.object({
        currentPhoneNumber: Joi.string().required(),
        name: Joi.string().optional(),
        phoneNumber: Joi.string().optional(),
        who: Joi.string().optional()
    }).or('name', 'phoneNumber', 'who'); // 👈 Esto asegura que al menos uno esté presente

    return schema.validate(data);
};

exports.validateDeleteEmergencyContactInput = (data) => {
    const schema = Joi.object({
        phoneNumber: Joi.string().required()
    });
    return schema.validate(data);
};


// ---------------------- Chat --------------------------

exports.validateChatInput = (data) => {
    const schema = Joi.object({
        message: Joi.string().required(),
    });
    return schema.validate(data);
}

exports.validateDaniResponse = (data) => {
    const schema = Joi.object({
        rtaParaUsuario: Joi.string().required(),
        fechaImportante: Joi.string().isoDate().allow(null).allow('null'),
        descripcionFechaImportante: Joi.string().allow(null), /*
        emocionPredominante: Joi.string()
            .valid("alegría", "tristeza", "miedo", "ira", "sorpresa", "asco", "confianza", "anticipación", "neutral")
            .allow(null)
            .allow('null'),
        tokenConsumidos: Joi.number().integer().min(0).required(),

         */
        categoriaDeRiesgo: Joi.number().integer().min(1).max(5)
    });

    return schema.validate(data);
};

exports.validateDaniSuicideRiskResponse = (data) => {
    const schema = Joi.object({
        suicideRiskDetected: Joi.string().lowercase().valid('true', 'false').required(),
    });

    return schema.validate(data);
};
// ----------------------Quotes--------------------------

exports.validateQuoteInput = (data) => {
    const schema = Joi.object({
        id: Joi.number().integer().min(1).max(100).required()
    });
    return schema.validate(data);
};

// ----------------------SMS--------------------------

exports.validateSmsSending = (data) => {
    const schema = Joi.object({
        to: Joi.string().min(1).max(18).required(), message: Joi.string().required()
    });
    return schema.validate(data);
}

// ----------------------Medications--------------------------

exports.validateMedicationInput = (data) => {
    const schema = Joi.object({
        startDate: Joi.date().required()
            .messages({
                'date.base': `"startDate" debe ser una fecha válida`, 'any.required': `"startDate" es obligatorio`
            }), endDate: Joi.date().greater(Joi.ref('startDate')).required()
            .messages({
                'date.base': `"endDate" debe ser una fecha válida`,
                'date.greater': `"endDate" debe ser posterior a "startDate"`,
                'any.required': `"endDate" es obligatorio`
            }), name: Joi.string().required()
            .messages({
                'string.base': `"name" debe ser un texto`, 'any.required': `"name" es obligatorio`
            }), dosage: Joi.string().required()
            .messages({
                'string.base': `"dosage" debe ser un texto`, 'any.required': `"dosage" es obligatorio`
            })
    });

    return schema.validate(data);
};
