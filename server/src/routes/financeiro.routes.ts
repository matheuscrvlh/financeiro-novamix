import { authenticate } from '../middlewares/auth.middlewares'
import {
    getMe,
    getVendaBruta,
    getLucroBruto,
    getLucroLiquido,
    getCancelamentos,
    getDevolucoes,
    getNumeroCupons,
    getTicketMedio,
    getValorEstoque,
    getContasReceberAberto,
    getContasPagarAberto,
    getLiquidezCorrente,
} from '../controllers/financeiro.controller'

export function financeiroRoutes(fastify) {
    fastify.get('/financeiro/me', { preHandler: [authenticate] }, getMe)
    fastify.get('/financeiro/venda-bruta', { preHandler: [authenticate] }, getVendaBruta)
    fastify.get('/financeiro/lucro-bruto', { preHandler: [authenticate] }, getLucroBruto)
    fastify.get('/financeiro/lucro-liquido', { preHandler: [authenticate] }, getLucroLiquido)
    fastify.get('/financeiro/cancelamentos', { preHandler: [authenticate] }, getCancelamentos)
    fastify.get('/financeiro/devolucoes', { preHandler: [authenticate] }, getDevolucoes)
    fastify.get('/financeiro/cupons', { preHandler: [authenticate] }, getNumeroCupons)
    fastify.get('/financeiro/ticket-medio', { preHandler: [authenticate] }, getTicketMedio)
    fastify.get('/financeiro/valor-estoque', { preHandler: [authenticate] }, getValorEstoque)
    fastify.get('/financeiro/contas-receber-aberto', { preHandler: [authenticate] }, getContasReceberAberto)
    fastify.get('/financeiro/contas-pagar-aberto', { preHandler: [authenticate] }, getContasPagarAberto)
    fastify.get('/financeiro/liquidez-corrente', { preHandler: [authenticate] }, getLiquidezCorrente)
}
