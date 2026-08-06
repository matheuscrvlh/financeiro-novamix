import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import FilialMultiFilter from '../components/FilialMultiFilter'
import KpiCard from '../components/KpiCard'
import { useMe } from '../hooks/useMe'
import { useRelatorioAtual } from '../hooks/useRelatorioAtual'
import { formatCurrency, formatRatio } from '../lib/format'
import { comFiltroEcommerce } from '../constants/filiais'
import type {
    ContasPagarAbertoRow,
    ContasReceberAbertoRow,
    EstoqueRow,
    LiquidezCorrenteRow,
} from '../types/financeiro'

export default function Admin() {
    const { me, loading: loadingMe, error: meError } = useMe()

    const [selecionadas, setSelecionadas] = useState<number[]>([])

    const branchesDisponiveis = me ? comFiltroEcommerce(me.branches) : []
    const filiaisAtivas = selecionadas.length > 0 ? selecionadas : branchesDisponiveis

    const habilitado = me !== null && me.isAdmin

    const valorEstoque = useRelatorioAtual<EstoqueRow>('/financeiro/valor-estoque', filiaisAtivas, habilitado)
    const contasReceber = useRelatorioAtual<ContasReceberAbertoRow>(
        '/financeiro/contas-receber-aberto',
        filiaisAtivas,
        habilitado
    )
    const contasPagar = useRelatorioAtual<ContasPagarAbertoRow>(
        '/financeiro/contas-pagar-aberto',
        filiaisAtivas,
        habilitado
    )
    const liquidezCorrente = useRelatorioAtual<LiquidezCorrenteRow>(
        '/financeiro/liquidez-corrente',
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

    if (!me.isAdmin) {
        return (
            <main className='w-full min-h-screen bg-gray dark:bg-dark-bg flex flex-col'>
                <PageHeader isAdmin={false} variant='admin' />
                <section className='flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center'>
                    <span className='text-sm font-medium text-red-base'>Acesso restrito a administradores.</span>
                    <Link
                        to='/'
                        className='text-sm font-medium text-gray-text transition hover:text-orange-base dark:text-dark-text dark:hover:text-orange-light'
                    >
                        ← Voltar ao painel
                    </Link>
                </section>
                <div className='pb-6'>
                    <Footer />
                </div>
            </main>
        )
    }

    return (
        <main className='w-full min-h-screen bg-gray dark:bg-dark-bg flex flex-col'>
            <PageHeader isAdmin={me.isAdmin} variant='admin' />

            <section className='flex-1 w-full max-w-6xl mx-auto px-6 py-10'>
                <h1 className='text-2xl font-semibold text-gray-text dark:text-dark-text mb-1'>Admin</h1>
                <p className='text-sm text-gray-dark dark:text-dark-text-muted mb-8'>
                    Posição atual — estoque, contas em aberto e liquidez. Saldo de agora, sem filtro de período.
                </p>

                <div className='mb-8'>
                    <FilialMultiFilter
                        branches={branchesDisponiveis}
                        selected={filiaisAtivas}
                        onChange={setSelecionadas}
                    />
                </div>

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    <KpiCard
                        titulo='Valor em estoque'
                        rows={valorEstoque.rows}
                        valueKey='VALOR_ESTOQUE'
                        formatValor={formatCurrency}
                        selecionadas={filiaisAtivas}
                        loading={valorEstoque.loading}
                        erro={valorEstoque.erro}
                    />
                    <KpiCard
                        titulo='A receber em aberto'
                        rows={contasReceber.rows}
                        valueKey='VALOR_RECEBER_ABERTO'
                        formatValor={formatCurrency}
                        selecionadas={filiaisAtivas}
                        loading={contasReceber.loading}
                        erro={contasReceber.erro}
                    />
                    <KpiCard
                        titulo='A pagar em aberto'
                        rows={contasPagar.rows}
                        valueKey='VALOR_PAGAR_ABERTO'
                        formatValor={formatCurrency}
                        selecionadas={filiaisAtivas}
                        loading={contasPagar.loading}
                        erro={contasPagar.erro}
                    />
                    <KpiCard
                        titulo='Liquidez corrente'
                        rows={liquidezCorrente.rows}
                        valueKey='LIQUIDEZ_CORRENTE'
                        formatValor={formatRatio}
                        selecionadas={filiaisAtivas}
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
