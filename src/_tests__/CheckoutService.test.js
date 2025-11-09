// _tests_/CheckoutService.test.js

// --- 1. IMPORTS (Verifique se todos estão aqui) ---
import { CheckoutService } from '../services/CheckoutService.js';
import CarrinhoBuilder from './builders/CarrinhoBuilder.js';
import UserMother from './builders/UserMother.js';
import { Item } from '../domain/Item.js';

/*
 * ========================================================================
 * ETAPA 4: TESTE COM STUB (PASSANDO!)
 * ========================================================================
 */
describe('Etapa 4: Teste com Stub (Falha no Pagamento)', () => {

    it('deve retornar null quando o pagamento falhar', async () => {

        // --- ARRANGE ---
        const carrinho = new CarrinhoBuilder().build();

        const gatewayStub = {
            cobrar: jest.fn().mockResolvedValue({ success: false })
        };
        const repositoryDummy = { salvar: jest.fn() };
        const emailDummy = { enviarEmail: jest.fn() };

        const checkoutService = new CheckoutService(
            gatewayStub,
            repositoryDummy,
            emailDummy
        );

        // --- ACT ---
        const pedido = await checkoutService.processarPedido(carrinho, {}); // Passando um cartão dummy

        // --- ASSERT ---
        expect(pedido).toBeNull();
    });
});


/*
 * ========================================================================
 * ETAPA 5: TESTE COM MOCK (CORRIGIDO)
 * ========================================================================
 */
describe('Etapa 5: Teste com Mock (Sucesso Cliente Premium)', () => {

    it('deve aplicar 10% de desconto e enviar e-mail de confirmação', async () => {

        // --- ARRANGE ---
        const usuarioPremium = UserMother.umUsuarioPremium();

        const itens = [
            new Item({ name: 'Produto 1', price: 100, quantity: 2 }) // Total R$ 200
        ];

        const carrinho = new CarrinhoBuilder()
            .comUser(usuarioPremium)
            .comItens(itens)
            .build();

        // 1. Criamos um "cartão falso" para passar ao método
        const cartaoDummy = { numero: '1234-5678', cvv: '123' };

        const gatewayStub = {
            cobrar: jest.fn().mockResolvedValue({ success: true })
        };
        const repositoryStub = {
            // Simulando o retorno do repositório
            salvar: jest.fn().mockResolvedValue(
                // O Pedido.js não foi fornecido, então simulamos um retorno simples
                { id: 1, totalFinal: 180, ...carrinho }
            )
        };
        const emailMock = {
            enviarEmail: jest.fn()
        };

        const checkoutService = new CheckoutService(
            gatewayStub,
            repositoryStub,
            emailMock
        );

        // --- ACT ---
        // 2. Passamos o cartaoDummy como segundo argumento
        const pedido = await checkoutService.processarPedido(carrinho, cartaoDummy);

        // --- ASSERT ---

        // 3. Verificamos se o gateway foi chamado com o valor (180) e o cartão
        expect(gatewayStub.cobrar).toHaveBeenCalledTimes(1);
        expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, cartaoDummy);

        // Verificamos o repositório
        expect(repositoryStub.salvar).toHaveBeenCalledTimes(1);

        // Verificamos o e-mail
        expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
        expect(emailMock.enviarEmail).toHaveBeenCalledWith(
            'premium@email.com',
            'Seu Pedido foi Aprovado!',
            // 4. Verificamos a mensagem exata do CheckoutService.js
            'Pedido 1 no valor de R$180'
        );
    });
});