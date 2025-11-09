// src/domain/User.js
export class User {
    constructor({ id, name, email, type = 'STANDARD' }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.type = type;
    }

    isPremium() {
        return this.type === 'PREMIUM';
    }
}