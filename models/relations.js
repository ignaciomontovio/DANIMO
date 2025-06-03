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
        Conversations,
        TypeEmotions,
        TypeActivities,
        Photos
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
    //Comentado
    /*
    DailyRegisters.hasMany(EmotionRegisters, {
        foreignKey: "dailyRegisterId",
        as: "EmotionRegister",
    });
    EmotionRegisters.belongsTo(DailyRegisters, {
        foreignKey: "dailyRegisterId",
        as: "DailyRegister",
    });
    */

    // Registro diario 1:1 Registro de sueño
    //Comentado
    /*
    DailyRegisters.hasOne(SleepRegisters, {
        foreignKey: "dailyRegisterId",
        as: "SleepRegister",
    });
    SleepRegisters.belongsTo(DailyRegisters, {
        foreignKey: "dailyRegisterId",
        as: "DailyRegister",
    });
    */

    // Registro diario 1:N Actividades
    //Comentado
    /*
    DailyRegisters.hasMany(ActivityRegisters, {
        foreignKey: "dailyRegisterId",
        as: "ActivityRegister",
    });
    ActivityRegisters.belongsTo(DailyRegisters, {
        foreignKey: "dailyRegisterId",
        as: "DailyRegister",
    });
    */

    // Usuario 1:N Registro diario
    //Comentado
    /*
    Users.hasMany(DailyRegisters, {
        foreignKey: "userId",
        as: "DailyRegisters",
    });
    DailyRegisters.belongsTo(Users, {
        foreignKey: "userId",
        as: "User",
    });
    */

    //Registro emocion 1:1 Tipo emocion
    EmotionRegisters.belongsTo(TypeEmotions, {
    foreignKey: {
        name: 'emotionId',
        allowNull: false
    },
    as: 'emotion'
    });
    TypeEmotions.hasMany(EmotionRegisters, {
        foreignKey: 'emotionId',
        as: 'emotionRegisters'
    });

    // EmotionRegisters 1:1 (opcional) → Photos
    EmotionRegisters.belongsTo(Photos, {
        foreignKey: {
            name: 'photoId',
            allowNull: true
        },
        as: 'photo'
    });
    Photos.hasOne(EmotionRegisters, {
    foreignKey: 'photoId',
    as: 'emotionRegister'
    });

    // EmotionRegisters N:M → TypeActivities
    EmotionRegisters.belongsToMany(TypeActivities, {
        through: 'EmotionRegistersActivities',
        as: 'activities',
        foreignKey: 'emotionRegisterId',
        otherKey: 'activityId',
        timestamps: false
    });
    TypeActivities.belongsToMany(EmotionRegisters, {
        through: 'EmotionRegistersActivities',
        as: 'emotionRegisters',
        foreignKey: 'activityId',
        otherKey: 'emotionRegisterId',
        timestamps: false
    });

    // Usuario 1:N Registros de emocion
    Users.hasMany(EmotionRegisters, {
        foreignKey: "userId",
        as: "Emotion",
    });
    EmotionRegisters.belongsTo(Users, {
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
