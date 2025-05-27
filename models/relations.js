module.exports = (models) => {
    const {
        Users,
        Medications,
        EmergencyContacts,
        Professionals,
        DailyRegisters,
        EmotionRegisters,
        SleepRegisters,
        ActivityRegisters,
        MoodAlternators,
        RecoveryTokens,
        Conversations
    } = models;

    // Usuario 1:N Medicaciones
    Users.hasMany(Medications, {
        foreignKey: "userId",
        as: "Medications",
    });
    Medications.belongsTo(Users, {
        foreignKey: "userId",
        as: "User",
    });

    // Usuario 1:N Contactos de emergencia
    Users.hasMany(EmergencyContacts, {
        foreignKey: "userId",
        as: "EmergencyContacts",
    });
    EmergencyContacts.belongsTo(Users, {
        foreignKey: "userId",
        as: "User",
    });

    // Usuario N:M Profesional
    Users.belongsToMany(Professionals, {
        through: "UserProfessional",
        as: "Professionals",
        foreignKey: "userId",
    });
    Professionals.belongsToMany(Users, {
        through: "UserProfessional",
        as: "Users",
        foreignKey: "professionalId",
    });

    // Registro diario 1:N Registro de emoción
    DailyRegisters.hasMany(EmotionRegisters, {
        foreignKey: "dailyRegisterId",
        as: "EmotionRegister",
    });
    EmotionRegisters.belongsTo(DailyRegisters, {
        foreignKey: "dailyRegisterId",
        as: "DailyRegister",
    });

    // Registro diario 1:1 Registro de sueño
    DailyRegisters.hasOne(SleepRegisters, {
        foreignKey: "dailyRegisterId",
        as: "SleepRegister",
    });
    SleepRegisters.belongsTo(DailyRegisters, {
        foreignKey: "dailyRegisterId",
        as: "DailyRegister",
    });

    // Registro diario 1:N Actividades
    DailyRegisters.hasMany(ActivityRegisters, {
        foreignKey: "dailyRegisterId",
        as: "ActivityRegister",
    });
    ActivityRegisters.belongsTo(DailyRegisters, {
        foreignKey: "dailyRegisterId",
        as: "DailyRegister",
    });

    // Usuario 1:N Registro diario
    Users.hasMany(DailyRegisters, {
        foreignKey: "userId",
        as: "DailyRegisters",
    });
    DailyRegisters.belongsTo(Users, {
        foreignKey: "userId",
        as: "User",
    });

    // Usuario 1:N Alteradores de ánimo
    Users.hasMany(MoodAlternators, {
        foreignKey: "userId",
        as: "MoodAlternators",
    });
    MoodAlternators.belongsTo(Users, {
        foreignKey: "userId",
        as: "User",
    });
    RecoveryTokens.belongsTo(Users, {
        foreignKey: "userId",
        as: "User",
    });
    Conversations.belongsTo(Users, {
        foreignKey: "userId",
        as: "User",
    });
};
