// utils/userCache.js

class UserCache {
    constructor() {
        this.cache = {};
        this.currentDay = this._getToday();
    }

    _getToday() {
        const now = new Date();
        return now.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    }

    _checkDay() {
        const today = this._getToday();
        if (today !== this.currentDay) {
            this.cache = {};
            this.currentDay = today;
        }
    }

    set(userId, type, value) {
        this._checkDay();
        const key = `${userId}:${type}`;
        this.cache[key] = value;
    }

    get(userId, type) {
        this._checkDay();
        const key = `${userId}:${type}`;
        return this.cache[key] || null;
    }
}

export default new UserCache();