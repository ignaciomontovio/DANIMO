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
const Conversations = require("./Conversations");

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
    Conversations
};

// Relaciones entre modelos
require("./relations")(models); // define relaciones

module.exports = models;
