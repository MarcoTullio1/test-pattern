import { Carrinho } from '../../domain/Carrinho.js';
import { Item } from '../../domain/Item.js';

export default class CarrinhoBuilder {
    constructor() {
        this.user = null;
        this.items = [
            new Item({ name: 'Item Padrão', price: 100, quantity: 1 })
        ];
    }

    comUser(user) {
        this.user = user;
        return this;
    }

    comItens(items) {
        this.items = items;
        return this;
    }

    vazio() {
        this.items = [];
        return this;
    }

    build() {
        return new Carrinho({
            user: this.user,
            items: this.items,
        });
    }
}