module.exports = (models) => {
    //USUARIO y MEDICACION: 1 a N
    models.Users.hasMany(models.Medications, {
        foreignKey: "userId", // 👈 Debe coincidir segun GPT - Si no puede tirar error ER_BAD_FIELD_ERROR
        as: "Medications",
    });

    models.Medications.belongsTo(models.Users, {
        foreignKey: "userId", // 👈 Debe coincidir segun GPT - Si no puede tirar error ER_BAD_FIELD_ERROR
        as: "User"
    });

    //USUARIO y CONTACTO EMERGENCIA: 1 a N
    models.Users.hasMany(models.EmergencyContacts, {
        foreignKey: "userId", // 👈 Debe coincidir segun GPT - Si no puede tirar error ER_BAD_FIELD_ERROR
        as: "EmergencyContacts",
    });

    models.EmergencyContacts.belongsTo(models.Users, {
        foreignKey: "userId", // 👈 Debe coincidir segun GPT - Si no puede tirar error ER_BAD_FIELD_ERROR
        as: "User"
    });

    //USUARIO y PROFESIONAL: N a N
    models.Users.belongsToMany(models.Professionals, {
        through: "UserProfessional", // 👈 nombre de la tabla intermedia
        as: "Professionals",
        foreignKey: "userId",
    });

    models.Professionals.belongsToMany(models.Users, {
        through: "UserProfessional", // 👈 mismo nombre
        as: "Users",
        foreignKey: "professionalId",
    });

    //REGISTRO DIARIO y REGISTRO EMOCION: 1 a 1
    models.DailyRegisters.hasOne(models.EmotionRegisters, {
        foreignKey: "dailyRegisterId",
        as: "EmotionRegister"
    });

    models.EmotionRegisters.belongsTo(models.DailyRegisters, {
        foreignKey: "dailyRegisterId",
        as: "DailyRegister"
    });

    //REGISTRO DIARIO y REGISTRO SUEÑO: 1 a 1
    models.DailyRegisters.hasOne(models.SleepRegisters, {
        foreignKey: "dailyRegisterId",
        as: "SleepRegister"
    });

    models.SleepRegisters.belongsTo(models.DailyRegisters, {
        foreignKey: "dailyRegisterId",
        as: "DailyRegister"
    });

    //REGISTRO DIARIO y REGISTRO ACTIVIDAD: 1 a N
    models.DailyRegisters.hasMany(models.ActivityRegisters, {
        foreignKey: "dailyRegisterId",
        as: "ActivityRegister"
    });

    models.ActivityRegisters.belongsTo(models.DailyRegisters, {
        foreignKey: "dailyRegisterId",
        as: "DailyRegister"
    });

    //USUARIO y Registro diario: 1 a N
    models.Users.hasMany(models.DailyRegisters, {
        foreignKey: "userId", // 👈 Debe coincidir segun GPT - Si no puede tirar error ER_BAD_FIELD_ERROR
        as: "DailyRegisters",
    });

    models.DailyRegisters.belongsTo(models.Users, {
        foreignKey: "userId", // 👈 Debe coincidir segun GPT - Si no puede tirar error ER_BAD_FIELD_ERROR
        as: "User"
    });

    //USUARIO y alteradores animo: 1 a N
    models.Users.hasMany(models.MoodAlternators, {
        foreignKey: "userId", // 👈 Debe coincidir segun GPT - Si no puede tirar error ER_BAD_FIELD_ERROR
        as: "MoodAlternators",
    });

    models.MoodAlternators.belongsTo(models.Users, {
        foreignKey: "userId", // 👈 Debe coincidir segun GPT - Si no puede tirar error ER_BAD_FIELD_ERROR
        as: "User"
    });
}