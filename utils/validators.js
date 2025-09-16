import Joi from 'joi';

// ------------------------ Professionals --------------------------

export const validateRegisterInputProf = (data) => Joi.object({
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
        'string.empty': 'El email es obligatoria.'
    }),
    birthDate: Joi.date().iso().optional(),
    gender: Joi.string().valid('Masculino', 'Femenino', 'No Binario', 'Prefiero no decir').required(),
    license: Joi.string().required().messages({
        'any.required': 'La matricula es obligatoria.',
        'string.empty': 'La matricula no puede ser vacia.'
    }),
    dni: Joi.number().integer().required().messages({
        'number.base': 'El campo dni debe ser un número.',
        'any.required': 'El dni es obligatorio.'
    })
}).validate(data);

export const validateLoginInputProf = (data) => Joi.object({
    email: Joi.string().email().lowercase().required().messages({
        'any.required': 'El email es obligatorio.',
        'string.email': 'El email no es válido.',
        'string.empty': 'El email es obligatoria.'
    }), password: Joi.string().min(5).max(15).required(),
}).validate(data);

export const validateGoogleTokenProf = (data) => Joi.object({
    googleJWT: Joi.required()
}).validate(data);

export const  validateAuthorizeProf = (data) => Joi.object({
    email: Joi.string().email().required(),
    key: Joi.string().required()
}).validate(data);

export const validateLinkUser = (data) => Joi.object({
    token: Joi.string().uppercase().required()
}).validate(data);

export const validateUnlinkUser = (body) => {
    const schema = Joi.object({
        userId: Joi.string().required().messages({
        'any.required': 'El campo userId es obligatorio.',
        'string.empty': 'El campo userId no puede estar vacío.'
        }),
    });

    return schema.validate(body);
};

// ------------------------ Users --------------------------------
export const validateRegisterInput = (data) => Joi.object({
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

export const validateLoginInput = (data) => Joi.object({
    email: Joi.string().lowercase().email().required().messages({
        'any.required': 'El email es obligatorio.',
        'string.email': 'El email no es válido.',
        'string.empty': 'El email es obligatorio.'
    }), password: Joi.string().min(5).max(15).required(),
}).validate(data);

export const validateGoogleToken = (data) => Joi.object({
    googleJWT: Joi.required()
}).validate(data);

export const validateForgotPassword = (data) => Joi.object({
    email: Joi.string().email().lowercase().required().messages({
        'any.required': 'El email es obligatorio.',
        'string.email': 'El email no es válido.',
        'string.empty': 'El email es obligatoria.'
    })
}).validate(data);

export const validateResetPassword = (data) => Joi.object({
    tokenId: Joi.string().required(), password: Joi.string().min(5).max(15).required(),
}).validate(data);

export const validateToken = (data) => Joi.object({
    tokenId: Joi.string().required(), email: Joi.string().email().lowercase().required().messages({
        'any.required': 'El email es obligatorio.',
        'string.email': 'El email no es válido.',
        'string.empty': 'El email es obligatorio.'
    })
}).validate(data);

export const validateUpdateInput = (data) => Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    occupation: Joi.string().optional(),
    gender: Joi.string()
        .valid('Masculino', 'Femenino', 'No Binario', 'Prefiero no decir')
        .optional(),
    birthDate: Joi.date().iso().optional(),
    livesWith: Joi.string().optional(),
    //Descomentar si se vuelve para atras lo de la foto
    /*
    profilePic: Joi.string()
        .dataUri()
        .optional()
        .messages({
            'string.pattern.base': `"profilePic" debe ser un Data URI válido (ej. data:image/png;base64,...)`
        })
    */
}).validate(data);

export function validateEmailBody(data) {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'any.required': 'El campo email es obligatorio',
            'string.email': 'El email ingresado no es válido',
            'string.empty': 'El email no puede estar vacío'
        })
    });

    return schema.validate(data);
}

export const validateUnlinkProfessional = (body) => {
    const schema = Joi.object({
        professionalId: Joi.string().required().messages({
        'any.required': 'El campo professionalId es obligatorio.',
        'string.empty': 'El campo professionalId no puede estar vacío.'
        }),
    });

    return schema.validate(body);
};
// ----------------------Emotions --------------------------

export const validateEmotionRegisterInput = (data) => {
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
        activities: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string()).messages({
            'array.base': 'El campo "activities" debe ser una lista.',
            }),
            Joi.string()
            .custom((value, helpers) => {
                try {
                const parsed = JSON.parse(value);
                if (!Array.isArray(parsed)) {
                    return helpers.error('any.invalid');
                }
                if (!parsed.every(item => typeof item === 'string')) {
                    return helpers.error('any.invalid');
                }
                return parsed; // ✅ lo devuelve parseado como array
                } catch (e) {
                return helpers.error('any.invalid');
                }
            }, 'Parse JSON string to array')
        )
        .required()
        .messages({
            'any.required': 'Debe indicar al menos una actividad.',
            'any.invalid': 'El campo "activities" debe ser un array válido (o un JSON parseable a array).',
        }),
        photo: Joi.string().optional()
    });
    return schema.validate(data);
};

// ----------------------Sleeps --------------------------

export const validateSleepRegisterInput = (data) => {
    const schema = Joi.object({
        hoursOfSleep: Joi.number().min(0).required().messages({
                'number.min': `"hoursOfSleep" debe ser al menos 0`,
                'any.required': `"hoursOfSleep" es obligatorio`
            }),
        sleep: Joi.number().integer().min(1).max(5).required()
            .messages({
                'number.base': `"sleep" debe ser un número entero`,
                'number.min': `"sleep" debe ser al menos 1`,
                'number.max': `"sleep" no puede ser mayor que 5`,
                'any.required': `"sleep" es obligatorio`
            })
    });

    return schema.validate(data);
};


// ----------------------Activities --------------------------

export const validateActivityRegisterInput = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required(),
        category: Joi.string().valid('Trabajo', 'Estudio', 'Hobby', 'Hogar').required(),
        date: Joi.date().iso().required(), //dailyRegisterId: Joi.string().pattern(/^U-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i).required(),
    });
    return schema.validate(data);
};

// ----------------------Emergency Contacts --------------------------

export const validateEmergencyContactInput = (data) => {
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

export const validateUpdateEmergencyContactInput = (data) => {
    const schema = Joi.object({
        currentPhoneNumber: Joi.string().required(),
        name: Joi.string().optional(),
        phoneNumber: Joi.string().optional(),
        who: Joi.string().optional()
    }).or('name', 'phoneNumber', 'who'); // 👈 Esto asegura que al menos uno esté presente

    return schema.validate(data);
};

export const validateDeleteEmergencyContactInput = (data) => {
    const schema = Joi.object({
        phoneNumber: Joi.string().required()
    });
    return schema.validate(data);
};


// ---------------------- Chat --------------------------

export const validateChatInput = (data) => {
    const schema = Joi.object({
        message: Joi.string().required(),
    });
    return schema.validate(data);
}

export const validateChatGenerateInput = (data) => {
    const schema = Joi.object({
        message: Joi.string().required(),
        email: Joi.string().email().lowercase().required().messages({
            'any.required': 'El email es obligatorio.',
            'string.email': 'El email no es válido.',
            'string.empty': 'El email es obligatoria.'
        }),
        date: Joi.date().iso().required(),
    });
    return schema.validate(data);
}

export const validateDaniResponse = (data) => {
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

export const validateDaniSuicideRiskResponse = (data) => {
    const schema = Joi.object({
        suicideRiskDetected: Joi.boolean().required()
        //suicideRiskDetected: Joi.string().lowercase().valid('true', 'false').required(),
    });

    return schema.validate(data);
};

export const validateDaniImportantDateResponse = (data) => {
    const schema = Joi.object({
        esSignificativo: Joi.boolean().required(),
        fechaImportante: Joi.string().isoDate().allow(null).allow('null'),
        descripcionFechaImportante: Joi.string().allow(null).allow('null'),
        categoriaFechaImportante: Joi.string()
            .valid('fallecimiento', 'mudanza', 'salud', 'nacimiento', 'aborto', 'necesidades primarias', 'trabajo', 'educación', 'clima', 'ninguna')
            .required()
    });

    return schema.validate(data);
};

export const validateStressLevelResponse = (data) => {
    const schema = Joi.object({
        ira: Joi.number().required(),
        angustia: Joi.number().required(),
        tristeza: Joi.number().required(),
        miedo: Joi.number().required(),
        frustracion: Joi.number().required(),
        culpa: Joi.number().required(),
        confusion: Joi.number().required(),
        euforia: Joi.number().required()
    });

    return schema.validate(data);
};

export const validateUserIntentResponse = (data) => {
    const schema = Joi.object({
        conversacionNoDanimo: Joi.boolean().required(),
        intentaBorrarHistorial: Joi.boolean().required()
    });

    return schema.validate(data);
};

export const validateDaniMoodAlternatorResponse = (data) => {
    const schema = Joi.object({
        esSignificativo: Joi.boolean().required(),
        descripcionAlteradorAnimo: Joi.string().allow(null).allow('null'),
        categoriaAlteradorAnimo: Joi.string()
            .valid('necesidad', 'trabajo', 'economico', 'estacional', 'climatica', 'ninguna')
            .required()
    });

    return schema.validate(data);    
};
// ----------------------Quotes--------------------------

export const validateQuoteInput = (data) => {
    const schema = Joi.object({
        id: Joi.number().integer().min(1).max(360).required()
    });
    return schema.validate(data);
};

// ----------------------SMS--------------------------

export const validateSmsSending = (data) => {
    const schema = Joi.object({
        to: Joi.string().min(1).max(18).required(), message: Joi.string().required()
    });
    return schema.validate(data);
}

// ----------------------Medications--------------------------

export const validateMedicationInput = (data) => {
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

export const validateMedicationNameQuery = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.base': '"name" debe ser un texto',
            'string.empty': '"name" no puede estar vacío',
            'any.required': '"name" es obligatorio'
        })
    });

    return schema.validate(data);
};

export const validateEditMedicationInput = (data) => {
    const schema = Joi.object({
        currentName: Joi.string().required().messages({
            'any.required': '"currentName" es obligatorio',
            'string.base': '"currentName" debe ser un texto válido'
        }),
        name: Joi.string().optional(),
        startDate: Joi.date().iso().optional().messages({
            'date.base': '"startDate" debe ser una fecha válida',
        }),
        endDate: Joi.date().iso().optional().messages({
            'date.base': '"endDate" debe ser una fecha válida',
        }),
        dosage: Joi.string().optional()
    }).or('name', 'startDate', 'endDate', 'dosage')
    .messages({ 'object.missing': 'Debes proveer al menos un campo a editar' });

    return schema.validate(data);
};

export const validateDeleteMedicationInput = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.base': '"name" debe ser un texto',
            'any.required': '"name" es obligatorio'
        })
    });

    return schema.validate(data);
};

// ----------------------Routines--------------------------

export const validateRoutineCreationInput = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'any.required': '"name" es obligatorio',
            'string.base': '"name" debe ser un texto válido',
            'string.empty': '"name" no puede estar vacío'
        }),
        type: Joi.string().required().messages({
            'any.required': '"type" es obligatorio',
            'string.base': '"type" debe ser un texto válido',
            'string.empty': '"type" no puede estar vacío'
        }),
        body: Joi.string().required().messages({
            'any.required': '"body" es obligatorio',
            'string.base': '"body" debe ser un texto válido',
            'string.empty': '"body" no puede estar vacío'
        }),
        emotion: Joi.array()
            .items(Joi.number().integer().min(1).max(5).messages({
                'number.base': 'Cada emoción debe ser un número',
                'number.min': 'Cada emoción debe ser >= 1',
                'number.max': 'Cada emoción debe ser <= 5'
            }))
            .min(1)
            .required()
            .messages({
                'any.required': '"emotion" es obligatorio y debe ser un array con al menos un valor',
                'array.base': '"emotion" debe ser un array de números',
                'array.min': 'Debe enviar al menos una emoción'
            })
    });

    return schema.validate(data);
};

export const validateRoutineEditInput = (data) => {
    const schema = Joi.object({
        currentName: Joi.string().required().messages({
            'any.required': '"currentName" es obligatorio',
            'string.base': '"currentName" debe ser un texto válido',
        }),
        name: Joi.string().optional().messages({
            'string.base': '"name" debe ser un texto válido',
        }),
        type: Joi.string().optional().messages({
            'string.base': '"type" debe ser un texto válido',
        }),
        body: Joi.string().optional().messages({
            'string.base': '"body" debe ser un texto válido',
        }),
        emotion: Joi.array()
            .items(Joi.number().integer().min(1).max(5).messages({
                'number.base': 'Cada emoción debe ser un número',
                'number.min': 'Cada emoción debe ser >= 1',
                'number.max': 'Cada emoción debe ser <= 5'
            }))
            .optional()
    }).or('name', 'type', 'body', 'emotion').messages({
        'object.missing': 'Debes proveer al menos un campo a modificar (name, body o emotion)',
    });

    return schema.validate(data);
};

export const validateRoutineDeleteInput = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'any.required': '"name" es obligatorio',
            'string.base': '"name" debe ser un texto válido',
        })
    });

    return schema.validate(data);
};

export const validateRoutineAssignInput = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'any.required': '"name" es obligatorio',
            'string.base': '"name" debe ser un texto válido',
        }),
        emails: Joi.array().items(Joi.string().email()).min(1).required().messages({
            'array.base': '"emails" debe ser una lista de correos',
            'array.min': 'Debe proporcionar al menos un email',
            'any.required': '"emails" es obligatorio',
            'string.email': 'Todos los elementos de "emails" deben ser correos válidos',
        })
    });

    return schema.validate(data);
};

// ----------------------Stats--------------------------

export const validateStatsEmotionsInput = (data) => {
    const schema = Joi.object({
        id: Joi.string().optional(),
        since: Joi.date().iso().required().messages({
        'any.required': 'La fecha de inicio (since) es obligatoria.',
        'date.base': 'La fecha de inicio (since) debe ser una fecha válida.',
        'date.format': 'La fecha de inicio (since) debe estar en formato ISO.'
        }),
        until: Joi.date().iso().greater(Joi.ref('since')).required().messages({
        'any.required': 'La fecha de fin (until) es obligatoria.',
        'date.base': 'La fecha de fin (until) debe ser una fecha válida.',
        'date.greater': 'La fecha de fin (until) debe ser posterior a la fecha de inicio (since).',
        'date.format': 'La fecha de fin (until) debe estar en formato ISO.'
        })
    });

    return schema.validate(data);
};

export const validateMonthStatsInput = (data) => {
    return Joi.object({
        userId: Joi.string().optional(), // Solo requerido si es profesional
        month: Joi.number().integer().min(1).max(12).required(),
        year: Joi.number().integer().min(1900).max(2100).required()
    }).validate(data);
};

export const validateStatsYearInput = (data) => {
    const schema = Joi.object({
        userId: Joi.string().optional(), // requerido solo si es Professional
        year: Joi.number().integer().min(1900).max(2100).optional()
    });
    return schema.validate(data);
};

export const validateImportantEventsInput = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required()
    });
    return schema.validate(data);
};

export const validateUserId = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required()
    });
    return schema.validate(data);
};

// --------------Summary-----------------

export const validateSummaryInput = (data) => {
    const schema = Joi.object({
        startDate: Joi.date().iso().required().messages({
            'any.required': '"startDate" es obligatorio',
            'date.base': '"startDate" debe ser una fecha válida en formato ISO'
        }),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required().messages({
            'any.required': '"endDate" es obligatorio',
            'date.base': '"endDate" debe ser una fecha válida en formato ISO',
            'date.greater': '"endDate" debe ser mayor que startDate'
        }),
        userId: Joi.string().required().messages({
            'any.required': 'El campo userId es obligatorio.',
            'string.empty': 'El campo userId no puede estar vacío.'
        }),
        refreshCache: Joi.boolean().default(false),
    });

    return schema.validate(data);
};

export const validateSummaryForProfessionalInput = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required().messages({
            'any.required': 'El campo userId es obligatorio.',
            'string.empty': 'El campo userId no puede estar vacío.'
        }),
        refreshCache: Joi.boolean().default(false),
    });
    return schema.validate(data);
};