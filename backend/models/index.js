const ActivityRegisters = require("./ActivityRegisters");
const DailyRegisters = require("./DailyRegisters");
const EmergencyContacts = require("./EmergencyContacts");
const EmotionRegisters = require("./EmotionRegisters");
const Medications = require("./Medications");
const MoodAlternators = require("./MoodAlternators");
const Professionals = require("./Professionals");
const SleepRegisters = require("./SleepRegisters");
const Users = require("./Users");
const UsersChats = require("./UsersChats");

const models = {
    ActivityRegisters,
    DailyRegisters,
    EmergencyContacts,
    EmotionRegisters,
    Medications,
    MoodAlternators,
    Professionals,
    SleepRegisters,
    Users,
    UsersChats,
};

// Relaciones entre modelos
require("./relations")(models); // define relaciones

module.exports = models;
