import type { FastifyRequest, FastifyReply } from 'fastify'
import { checkBranch, checkPermission } from '../middlewares/auth.middlewares'
import { connCiss } from '../database/ciss.database'
import { loadQueryFinanceiro } from '../services/query.service'

interface PeriodoQuery {
    inicio?: string
    fim?: string
}

async function resolveFiliais(req: FastifyRequest, res: FastifyReply) {
    const permission = await checkPermission(req, res)
    if (!permission) return null

    const branches = await checkBranch(req, res)
    if (!branches) return null

    return branches
}

function resolvePeriodo(req: FastifyRequest, res: FastifyReply) {
    const { inicio, fim } = req.query as PeriodoQuery

    if (!inicio || !fim) {
        res.code(400).send({ error: 'Informe os parâmetros inicio e fim (YYYY-MM-DD).' })
        return null
    }

    return { inicio, fim }
}

async function executarRelatorio(req: FastifyRequest, res: FastifyReply, arquivo: string) {
    const filiais = await resolveFiliais(req, res)
    if (!filiais) return

    const periodo = resolvePeriodo(req, res)
    if (!periodo) return

    const sql = loadQueryFinanceiro(arquivo).replace('{{FILIAIS}}', filiais.join(','))

    const conn = await connCiss()
    try {
        const data = await conn.query(sql, [periodo.inicio, periodo.fim])
        res.send(data)
    } finally {
        await conn.close()
    }
}

export async function getMe(req: FastifyRequest, res: FastifyReply) {
    const permission = await checkPermission(req, res)
    if (!permission) return

    const branches = await checkBranch(req, res)
    if (!branches) return

    res.send({ permission, branches })
}

export async function getVendaBruta(req: FastifyRequest, res: FastifyReply) {
    await executarRelatorio(req, res, 'valor_venda_bruta.sql')
}

export async function getLucroBruto(req: FastifyRequest, res: FastifyReply) {
    await executarRelatorio(req, res, 'valor_lucro_bruto.sql')
}

export async function getLucroLiquido(req: FastifyRequest, res: FastifyReply) {
    await executarRelatorio(req, res, 'valor_lucro_liquido.sql')
}

export async function getCancelamentos(req: FastifyRequest, res: FastifyReply) {
    await executarRelatorio(req, res, 'valor_cancelamentos.sql')
}

export async function getDevolucoes(req: FastifyRequest, res: FastifyReply) {
    await executarRelatorio(req, res, 'valor_devolucoes.sql')
}

export async function getNumeroCupons(req: FastifyRequest, res: FastifyReply) {
    await executarRelatorio(req, res, 'valor_numero_cupons.sql')
}

export async function getTicketMedio(req: FastifyRequest, res: FastifyReply) {
    await executarRelatorio(req, res, 'valor_ticket_medio.sql')
}
