import { User } from '../../domain/User.js';

export default class UserMother {

    static umUsuarioPadrao() {
        return new User({
            id: 1,
            name: 'Usuário Padrão',
            email: 'padrao@email.com',
            type: 'STANDARD',
        });
    }


    static umUsuarioPremium() {
        return new User({
            id: 2,
            name: 'Usuário Premium',
            email: 'premium@email.com',
            type: 'PREMIUM', // [cite: 74]
        });
    }
}