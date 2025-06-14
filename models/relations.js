module.exports = (models) => {
    const {
        Users,
        Medications,
        EmergencyContacts,
        Professionals,
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

    //Registro emocion 1:1 Tipo emocion
    EmotionRegisters.belongsTo(TypeEmotions, {
        foreignKey: {
            name: 'emotionName',
            allowNull: false,
        },
        targetKey: 'name', // 👉 indicamos que hace match con la PK 'name'
        as: 'emotion'
    });

    TypeEmotions.hasMany(EmotionRegisters, {
        foreignKey: 'emotionName',
        sourceKey: 'name',
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
        through: 'EmotionRegister_Activities',
        foreignKey: 'emotionRegisterId',
        otherKey: 'activityName', // 👉 match con `TypeActivities.name`
        as: 'activities'
    });

    TypeActivities.belongsToMany(EmotionRegisters, {
        through: 'EmotionRegister_Activities',
        foreignKey: 'activityName', // 👉 este es el nuevo FK
        otherKey: 'emotionRegisterId',
        as: 'emotionRegisters'
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

    // TypeEmotion 1:N Photos
    Photos.belongsTo(TypeEmotions, {
    foreignKey: {
        name: 'emotionName',
        allowNull: false
    },
    targetKey: 'name', // 👈 si la PK de TypeEmotions es 'name'
    as: 'emotion'
    });
    TypeEmotions.hasMany(Photos, {
    foreignKey: 'emotionName',
    sourceKey: 'name', // 👈 si 'name' es la PK o campo único
    as: 'photos'
    });    

    //Usuario 1:N Registros de sueño
    Users.hasMany(SleepRegisters, {
        foreignKey: 'userId',
        sourceKey: 'id'
    });
    SleepRegisters.belongsTo(Users, {
        foreignKey: 'userId',
        targetKey: 'id'
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
