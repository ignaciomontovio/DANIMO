const ActivityRegisters = require("./ActivityRegisters");
const DailyRegisters = require("./DailyRegisters");
const EmergencyContacts = require("./EmergencyContacts");
const EmotionRegisters = require("./EmotionRegisters");
const Medications = require("./Medications");
const MoodAlternators = require("./MoodAlternators");
const Professionals = require("./Professionals");
const Quotes = require("./Quotes");
const SleepRegisters = require("./SleepRegisters");
const Users = require("./Users");
const RecoveryTokens = require("./RecoveryTokens");
const TypeActivities = require("./TypeActivities");
const TypeEmotions = require("./TypeEmotions");
const Conversations = require("./Conversations");
const Photos = require("./Photos");

const models = {
    ActivityRegisters,
    DailyRegisters,
    EmergencyContacts,
    EmotionRegisters,
    Medications,
    MoodAlternators,
    Professionals,
    Quotes,
    SleepRegisters,
    Users,
    RecoveryTokens,
    TypeActivities,
    TypeEmotions,
    Conversations,
    Photos
};

// Relaciones entre modelos
require("./relations")(models); // define relaciones

module.exports = models;
