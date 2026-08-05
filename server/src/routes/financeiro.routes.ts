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
}
