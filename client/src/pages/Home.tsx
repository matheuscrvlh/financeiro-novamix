import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import FilialMultiFilter from '../components/FilialMultiFilter'
import DateRangeFilter from '../components/DateRangeFilter'
import KpiCard from '../components/KpiCard'
import VendaRankingChart from '../components/VendaRankingChart'
import { useMe } from '../hooks/useMe'
import { useRelatorio } from '../hooks/useRelatorio'
import { formatCurrency, formatNumber } from '../lib/format'
import { comFiltroEcommerce } from '../constants/filiais'
import { getPresetRange } from '../lib/date'
import type {
    CancelamentosRow,
    CuponsRow,
    DevolucoesRow,
    LucroBrutoRow,
    LucroLiquidoRow,
    TicketMedioRow,
    VendaBrutaRow,
} from '../types/financeiro'

export default function Home() {
    const { me, loading: loadingMe, error: meError } = useMe()

    const [inicio, setInicio] = useState(() => getPresetRange('hoje').inicio)
    const [fim, setFim] = useState(() => getPresetRange('hoje').fim)
    const [selecionadas, setSelecionadas] = useState<number[]>([])

    const branchesDisponiveis = me ? comFiltroEcommerce(me.branches) : []
    const filiaisAtivas = selecionadas.length > 0 ? selecionadas : branchesDisponiveis

    const habilitado = me !== null

    const vendaBruta = useRelatorio<VendaBrutaRow>('/financeiro/venda-bruta', inicio, fim, filiaisAtivas, habilitado)
    const lucroBruto = useRelatorio<LucroBrutoRow>('/financeiro/lucro-bruto', inicio, fim, filiaisAtivas, habilitado)
    const lucroLiquido = useRelatorio<LucroLiquidoRow>(
        '/financeiro/lucro-liquido',
        inicio,
        fim,
        filiaisAtivas,
        habilitado
    )
    const cancelamentos = useRelatorio<CancelamentosRow>(
        '/financeiro/cancelamentos',
        inicio,
        fim,
        filiaisAtivas,
        habilitado
    )
    const devolucoes = useRelatorio<DevolucoesRow>('/financeiro/devolucoes', inicio, fim, filiaisAtivas, habilitado)
    const cupons = useRelatorio<CuponsRow>('/financeiro/cupons', inicio, fim, filiaisAtivas, habilitado)
    const ticketMedio = useRelatorio<TicketMedioRow>(
        '/financeiro/ticket-medio',
        inicio,
        fim,
        filiaisAtivas,
        habilitado
    )

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

    return (
        <main className='w-full min-h-screen bg-gray dark:bg-dark-bg flex flex-col'>
            <PageHeader isAdmin={me.isAdmin} variant='principal' />

            <section className='flex-1 w-full max-w-6xl mx-auto px-6 py-10'>
                <h1 className='text-2xl font-semibold text-gray-text dark:text-dark-text mb-1'>
                    Financeiro Novamix
                </h1>
                <p className='text-sm text-gray-dark dark:text-dark-text-muted mb-8'>
                    Visão geral de vendas por filial.
                </p>

                <div className='flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between'>
                    <FilialMultiFilter
                        branches={branchesDisponiveis}
                        selected={filiaisAtivas}
                        onChange={setSelecionadas}
                    />
                    <DateRangeFilter inicio={inicio} fim={fim} onChangeInicio={setInicio} onChangeFim={setFim} />
                </div>

                <VendaRankingChart
                    rows={vendaBruta.rows}
                    selecionadas={filiaisAtivas}
                    loading={vendaBruta.loading}
                    erro={vendaBruta.erro}
                />

                <h2 className='text-lg font-semibold text-gray-text dark:text-dark-text mt-8 mb-4'>Lucro</h2>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <KpiCard
                        titulo='Lucro bruto'
                        rows={lucroBruto.rows}
                        valueKey='LUCRO_BRUTO'
                        formatValor={formatCurrency}
                        selecionadas={filiaisAtivas}
                        loading={lucroBruto.loading}
                        erro={lucroBruto.erro}
                    />
                    <KpiCard
                        titulo='Lucro líquido'
                        rows={lucroLiquido.rows}
                        valueKey='LUCRO_LIQUIDO'
                        formatValor={formatCurrency}
                        selecionadas={filiaisAtivas}
                        loading={lucroLiquido.loading}
                        erro={lucroLiquido.erro}
                    />
                </div>

                <h2 className='text-lg font-semibold text-gray-text dark:text-dark-text mt-8 mb-4'>
                    Cancelamentos, devoluções e ticket
                </h2>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    <KpiCard
                        titulo='Cancelamentos'
                        rows={cancelamentos.rows}
                        valueKey='VALOR_CANCELAMENTOS'
                        formatValor={formatCurrency}
                        selecionadas={filiaisAtivas}
                        loading={cancelamentos.loading}
                        erro={cancelamentos.erro}
                    />
                    <KpiCard
                        titulo='Devoluções'
                        rows={devolucoes.rows}
                        valueKey='VALOR_DEVOLUCOES'
                        formatValor={formatCurrency}
                        selecionadas={filiaisAtivas}
                        loading={devolucoes.loading}
                        erro={devolucoes.erro}
                    />
                    <KpiCard
                        titulo='Cupons'
                        rows={cupons.rows}
                        valueKey='N_CUPONS'
                        formatValor={formatNumber}
                        selecionadas={filiaisAtivas}
                        loading={cupons.loading}
                        erro={cupons.erro}
                    />
                    <KpiCard
                        titulo='Ticket médio'
                        rows={ticketMedio.rows}
                        valueKey='TICKET_MEDIO'
                        formatValor={formatCurrency}
                        selecionadas={filiaisAtivas}
                        loading={ticketMedio.loading}
                        erro={ticketMedio.erro}
                    />
                </div>
            </section>

            <div className='pb-6'>
                <Footer />
            </div>
        </main>
    )
}
