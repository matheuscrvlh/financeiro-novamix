import type { FastifyRequest, FastifyReply } from 'fastify'
import { checkBranch, checkPermission } from '../middlewares/auth.middlewares'
import { connCiss } from '../database/ciss.database'
import { loadQueryFinanceiro } from '../services/query.service'

const ADMIN_ACCESS = 'admin'

interface PeriodoQuery {
    inicio?: string
    fim?: string
    filiais?: string
}

interface ResolveFiliaisOpts {
    adminOnly?: boolean
}

async function resolveFiliais(req: FastifyRequest, res: FastifyReply, opts: ResolveFiliaisOpts = {}) {
    const permission = await checkPermission(req, res)
    if (!permission) return null

    if (opts.adminOnly && permission !== ADMIN_ACCESS) {
        res.code(403).send({ error: 'Acesso restrito a administradores.' })
        return null
    }

    const branches = await checkBranch(req, res)
    if (!branches) return null

    return branches
}

/**
 * O usuário pode filtrar por um subconjunto das próprias filiais liberadas
 * (?filiais=1,3). Nunca confiamos nesse parâmetro sozinho — ele só pode
 * restringir, nunca ampliar, o que já veio verificado do JWT.
 */
function resolveFiliaisSelecionadas(req: FastifyRequest, filiaisLiberadas: number[]) {
    const { filiais } = req.query as PeriodoQuery

    if (!filiais) return filiaisLiberadas

    const solicitadas = filiais
        .split(',')
        .map((id) => parseInt(id, 10))
        .filter((id) => !Number.isNaN(id))

    const selecionadas = filiaisLiberadas.filter((id) => solicitadas.includes(id))

    return selecionadas.length > 0 ? selecionadas : filiaisLiberadas
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
    const filiaisLiberadas = await resolveFiliais(req, res)
    if (!filiaisLiberadas) return

    const periodo = resolvePeriodo(req, res)
    if (!periodo) return

    const filiais = resolveFiliaisSelecionadas(req, filiaisLiberadas)
    const sql = loadQueryFinanceiro(arquivo).replaceAll('{{FILIAIS}}', filiais.join(','))

    const conn = await connCiss()
    try {
        const data = await conn.query(sql, [periodo.inicio, periodo.fim])
        res.send(data)
    } finally {
        await conn.close()
    }
}

/**
 * Métricas de posição (estoque, contas a receber/pagar em aberto, liquidez corrente)
 * são saldo "agora", não soma de um período — por isso não recebem inicio/fim.
 * São restritas a administradores.
 */
async function executarRelatorioAtual(req: FastifyRequest, res: FastifyReply, arquivo: string) {
    const filiaisLiberadas = await resolveFiliais(req, res, { adminOnly: true })
    if (!filiaisLiberadas) return

    const filiais = resolveFiliaisSelecionadas(req, filiaisLiberadas)
    const sql = loadQueryFinanceiro(arquivo).replaceAll('{{FILIAIS}}', filiais.join(','))

    const conn = await connCiss()
    try {
        const data = await conn.query(sql)
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

    res.send({ permission, branches, isAdmin: permission === ADMIN_ACCESS })
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

export async function getValorEstoque(req: FastifyRequest, res: FastifyReply) {
    await executarRelatorioAtual(req, res, 'valor_estoque.sql')
}

export async function getContasReceberAberto(req: FastifyRequest, res: FastifyReply) {
    await executarRelatorioAtual(req, res, 'contas_receber_aberto.sql')
}

export async function getContasPagarAberto(req: FastifyRequest, res: FastifyReply) {
    await executarRelatorioAtual(req, res, 'contas_pagar_aberto.sql')
}

export async function getLiquidezCorrente(req: FastifyRequest, res: FastifyReply) {
    await executarRelatorioAtual(req, res, 'liquidez_corrente.sql')
}
