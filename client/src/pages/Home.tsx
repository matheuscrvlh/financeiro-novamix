import { useState } from 'react'
import Logo from '../components/Logo'
import Footer from '../components/Footer'
import FilialFilter from '../components/FilialFilter'
import DateRangeFilter from '../components/DateRangeFilter'
import KpiCard from '../components/KpiCard'
import { useMe } from '../hooks/useMe'
import { useRelatorio } from '../hooks/useRelatorio'
import { useRelatorioAtual } from '../hooks/useRelatorioAtual'
import { formatCurrency, formatNumber, formatRatio } from '../lib/format'
import { comFiltroEcommerce } from '../constants/filiais'
import type {
    CancelamentosRow,
    ContasPagarAbertoRow,
    ContasReceberAbertoRow,
    CuponsRow,
    DevolucoesRow,
    EstoqueRow,
    LiquidezCorrenteRow,
    LucroBrutoRow,
    LucroLiquidoRow,
    TicketMedioRow,
    VendaBrutaRow,
} from '../types/financeiro'

function defaultInicio() {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
}

function defaultFim() {
    return new Date().toISOString().slice(0, 10)
}

export default function Home() {
    const { me, loading: loadingMe, error: meError } = useMe()

    const [inicio, setInicio] = useState(defaultInicio())
    const [fim, setFim] = useState(defaultFim())
    const [filial, setFilial] = useState<number | 'todas'>('todas')

    const habilitado = me !== null

    const vendaBruta = useRelatorio<VendaBrutaRow>('/financeiro/venda-bruta', inicio, fim, habilitado)
    const lucroBruto = useRelatorio<LucroBrutoRow>('/financeiro/lucro-bruto', inicio, fim, habilitado)
    const lucroLiquido = useRelatorio<LucroLiquidoRow>('/financeiro/lucro-liquido', inicio, fim, habilitado)
    const cancelamentos = useRelatorio<CancelamentosRow>('/financeiro/cancelamentos', inicio, fim, habilitado)
    const devolucoes = useRelatorio<DevolucoesRow>('/financeiro/devolucoes', inicio, fim, habilitado)
    const cupons = useRelatorio<CuponsRow>('/financeiro/cupons', inicio, fim, habilitado)
    const ticketMedio = useRelatorio<TicketMedioRow>('/financeiro/ticket-medio', inicio, fim, habilitado)

    const valorEstoque = useRelatorioAtual<EstoqueRow>('/financeiro/valor-estoque', habilitado)
    const contasReceber = useRelatorioAtual<ContasReceberAbertoRow>('/financeiro/contas-receber-aberto', habilitado)
    const contasPagar = useRelatorioAtual<ContasPagarAbertoRow>('/financeiro/contas-pagar-aberto', habilitado)
    const liquidezCorrente = useRelatorioAtual<LiquidezCorrenteRow>('/financeiro/liquidez-corrente', habilitado)

    if (loadingMe) {
        return (
            <main className='w-full min-h-screen bg-gray dark:bg-dark-bg flex items-center justify-center'>
                <span className='text-sm text-gray-dark dark:text-dark-text-muted'>Carregando...</span>
            </main>
        )
    }

    if (meError || !me) {
        return (
            <main className='w-full min-h-screen bg-gray dark:bg-dark-bg flex items-center justify-center'>
                <span className='text-sm text-red-base'>{meError ?? 'Não foi possível carregar seus dados.'}</span>
            </main>
        )
    }

    const branches = comFiltroEcommerce(me.branches)

    return (
        <main className='w-full min-h-screen bg-gray dark:bg-dark-bg flex flex-col'>
            <header className='w-full bg-white dark:bg-dark-surface shadow-sm flex items-center justify-between px-6 py-3'>
                <Logo compact />
                <a
                    href='https://hub.lojanovamix.com.br'
                    className='text-sm font-medium text-gray-text transition hover:text-orange-base dark:text-dark-text dark:hover:text-orange-light'
                >
                    ← Voltar ao Hub
                </a>
            </header>

            <section className='flex-1 w-full max-w-6xl mx-auto px-6 py-10'>
                <h1 className='text-2xl font-semibold text-gray-text dark:text-dark-text mb-1'>
                    Financeiro Novamix
                </h1>
                <p className='text-sm text-gray-dark dark:text-dark-text-muted mb-8'>
                    Visão geral de vendas por filial.
                </p>

                <div className='flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between'>
                    <FilialFilter branches={branches} selected={filial} onChange={setFilial} />
                    <DateRangeFilter inicio={inicio} fim={fim} onChangeInicio={setInicio} onChangeFim={setFim} />
                </div>

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                    <KpiCard
                        titulo='Venda bruta'
                        rows={vendaBruta.rows}
                        valueKey='VALOR_VENDA_BRUTA'
                        formatValor={formatCurrency}
                        filial={filial}
                        branches={branches}
                        loading={vendaBruta.loading}
                        erro={vendaBruta.erro}
                    />
                    <KpiCard
                        titulo='Lucro bruto'
                        rows={lucroBruto.rows}
                        valueKey='LUCRO_BRUTO'
                        formatValor={formatCurrency}
                        filial={filial}
                        branches={branches}
                        loading={lucroBruto.loading}
                        erro={lucroBruto.erro}
                    />
                    <KpiCard
                        titulo='Lucro líquido'
                        rows={lucroLiquido.rows}
                        valueKey='LUCRO_LIQUIDO'
                        formatValor={formatCurrency}
                        filial={filial}
                        branches={branches}
                        loading={lucroLiquido.loading}
                        erro={lucroLiquido.erro}
                    />
                    <KpiCard
                        titulo='Cancelamentos'
                        rows={cancelamentos.rows}
                        valueKey='VALOR_CANCELAMENTOS'
                        formatValor={formatCurrency}
                        filial={filial}
                        branches={branches}
                        loading={cancelamentos.loading}
                        erro={cancelamentos.erro}
                    />
                    <KpiCard
                        titulo='Devoluções'
                        rows={devolucoes.rows}
                        valueKey='VALOR_DEVOLUCOES'
                        formatValor={formatCurrency}
                        filial={filial}
                        branches={branches}
                        loading={devolucoes.loading}
                        erro={devolucoes.erro}
                    />
                    <KpiCard
                        titulo='Cupons'
                        rows={cupons.rows}
                        valueKey='N_CUPONS'
                        formatValor={formatNumber}
                        filial={filial}
                        branches={branches}
                        loading={cupons.loading}
                        erro={cupons.erro}
                    />
                    <KpiCard
                        titulo='Ticket médio'
                        rows={ticketMedio.rows}
                        valueKey='TICKET_MEDIO'
                        formatValor={formatCurrency}
                        filial={filial}
                        branches={branches}
                        loading={ticketMedio.loading}
                        erro={ticketMedio.erro}
                    />
                </div>

                <h2 className='text-lg font-semibold text-gray-text dark:text-dark-text mt-10 mb-1'>
                    Posição atual
                </h2>
                <p className='text-sm text-gray-dark dark:text-dark-text-muted mb-4'>
                    Saldo de agora — não é afetado pelo filtro de período acima.
                </p>

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    <KpiCard
                        titulo='Valor em estoque'
                        rows={valorEstoque.rows}
                        valueKey='VALOR_ESTOQUE'
                        formatValor={formatCurrency}
                        filial={filial}
                        branches={branches}
                        loading={valorEstoque.loading}
                        erro={valorEstoque.erro}
                    />
                    <KpiCard
                        titulo='A receber em aberto'
                        rows={contasReceber.rows}
                        valueKey='VALOR_RECEBER_ABERTO'
                        formatValor={formatCurrency}
                        filial={filial}
                        branches={branches}
                        loading={contasReceber.loading}
                        erro={contasReceber.erro}
                    />
                    <KpiCard
                        titulo='A pagar em aberto'
                        rows={contasPagar.rows}
                        valueKey='VALOR_PAGAR_ABERTO'
                        formatValor={formatCurrency}
                        filial={filial}
                        branches={branches}
                        loading={contasPagar.loading}
                        erro={contasPagar.erro}
                    />
                    <KpiCard
                        titulo='Liquidez corrente'
                        rows={liquidezCorrente.rows}
                        valueKey='LIQUIDEZ_CORRENTE'
                        formatValor={formatRatio}
                        filial={filial}
                        branches={branches}
                        loading={liquidezCorrente.loading}
                        erro={liquidezCorrente.erro}
                    />
                </div>
            </section>

            <div className='pb-6'>
                <Footer />
            </div>
        </main>
    )
}
