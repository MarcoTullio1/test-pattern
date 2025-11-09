// src/domain/Carrinho.js
export class Carrinho {
    constructor({ user, items = [] }) {
        this.user = user;
        this.items = items;
    }

    calcularTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}