import TypeActivities from '../models/TypeActivities.js';

export async function getAllTypeActivities() {
    return await TypeActivities.findAll();
}