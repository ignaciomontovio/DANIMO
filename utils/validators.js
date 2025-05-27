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
    email: Joi.string().email().required().messages({
            'any.required': 'El email es obligatorio.',
            'string.email': 'El email no es válido.',
            'string.empty': 'El email es obligatorio.'
        }),
    profession: Joi.string().valid('Psicologo', 'Psiquiatra').required(),
    birthDate: Joi.date().iso().optional(),
    gender: Joi.string().valid('Masculino', 'Femenino','No Binario','Prefiero no decir').required()
}).validate(data);

exports.validateLoginInputProf = (data) => Joi.object({
    email: Joi.string().email().required().messages({
            'any.required': 'El email es obligatorio.',
            'string.email': 'El email no es válido.',
            'string.empty': 'El email es obligatorio.'
        }),
    password: Joi.string().min(5).max(15).required(),
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
    email: Joi.string().email().required().messages({
            'any.required': 'El email es obligatorio.',
            'string.email': 'El email no es válido.',
            'string.empty': 'El email es obligatorio.'
        }),
    birthDate: Joi.date().iso().optional(),
    gender: Joi.string().valid('Masculino', 'Femenino','No Binario','Prefiero no decir').required()
}).validate(data);

exports.validateLoginInput = (data) => Joi.object({
    email: Joi.string().email().required().messages({
            'any.required': 'El email es obligatorio.',
            'string.email': 'El email no es válido.',
            'string.empty': 'El email es obligatorio.'
        }),
    password: Joi.string().min(5).max(15).required(),
}).validate(data);

exports.validateGoogleToken = (data) => Joi.object({
    googleJWT: Joi.required()
}).validate(data);

exports.validateForgotPassword = (data) => Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'El email es obligatorio.',
        'string.email': 'El email no es válido.',
        'string.empty': 'El email es obligatorio.'
    })}).validate(data);

exports.validateResetPassword = (data) => Joi.object({
    tokenId: Joi.string().required(),
    password: Joi.string().min(5).max(15).required(),
}).validate(data);

// ----------------------Registers --------------------------
// No sera necesario validarlo porque la fecha la obtenemos nosotros
/*
exports.validateDailyRegisterInput = (data) => {
    const schema = Joi.object({
        date: Joi.required(),
    });
    return schema.validate(data);
};
*/

// ----------------------Emotions --------------------------

exports.validateEmotionRegisterInput = (data) => {
    const schema = Joi.object({
        emotion: Joi.string().valid('Alegria', 'Tristeza', 'Miedo', 'Ira', 'Sorpresa', 'Anticipacion', 'Confianza', 'Asco').required(),
        intensity: Joi.number().integer().min(0).required(),
        isPredominant: Joi.boolean().required()
        //dailyRegisterId: Joi.string().pattern(/^U-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i).required()
    });
    return schema.validate(data);
};

// ----------------------Sleeps --------------------------

exports.validateSleepRegisterInput = (data) => {
    const schema = Joi.object({
        hoursOfSleep: Joi.number().integer().min(0).required(),
        quality: Joi.number().integer().min(1).max(5).required()
        //dailyRegisterId: Joi.string().pattern(/^U-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i).required()
    });
    return schema.validate(data);
};

// ----------------------Activities --------------------------

exports.validateActivityRegisterInput = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required(),
        category: Joi.string().valid('Trabajo', 'Estudio', 'Hobby', 'Hogar').required(),
        date: Joi.date().iso().required(),
        //dailyRegisterId: Joi.string().pattern(/^U-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i).required(),
    });
    return schema.validate(data);
};

// ----------------------Emergency Contacts --------------------------

exports.validateEmergencyContactInput = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required(),
        phoneNumber: Joi.string().min(1).max(18).required(),
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
        rta_para_usuario: Joi.string().required(),
        fecha_importante: Joi.string().isoDate().allow(null),
        descripcion_fecha_importante: Joi.string().allow(null),
        emocion_predominante: Joi.string()
            .valid("alegría", "tristeza", "miedo", "ira", "sorpresa", "asco", "confianza", "anticipación")
            .required(),
        categoria_de_riesgo: Joi.number().integer().min(1).max(5).required(),
        token_consumidos: Joi.number().integer().min(0).required()
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