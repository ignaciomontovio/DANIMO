import EmergencyContacts from "./EmergencyContacts.js";
import EmotionRegisters from "./EmotionRegisters.js";
import Medications from "./Medications.js";
import MoodAlternators from "./MoodAlternators.js";
import Professionals from "./Professionals.js";
import Quotes from "./Quotes.js";
import SleepRegisters from "./SleepRegisters.js";
import Users from "./Users.js";
import RecoveryTokensProfessionals from "./RecoveryTokensProfessionals.js";
import RecoveryTokens from "./RecoveryTokens.js";
import TypeActivities from "./TypeActivities.js";
import TypeEmotions from "./TypeEmotions.js";
import TypeSleeps from '../models/TypeSleeps.js';
import Conversations from "./Conversations.js";
import Photos from "./Photos.js";
import ImportantEvents from "./ImportantEvents.js";
import Routines from "./Routines.js";
import defineRelations from "./relations.js";

const models = {
    EmergencyContacts,
    EmotionRegisters,
    Medications,
    MoodAlternators,
    Professionals,
    Quotes,
    SleepRegisters,
    Users,
    RecoveryTokens,
    RecoveryTokensProfessionals,
    TypeActivities,
    TypeEmotions,
    TypeSleeps,
    Conversations,
    Photos,
    ImportantEvents,
    Routines
};

defineRelations(models); // define relaciones

export default models;
