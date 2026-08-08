import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import FiltersMenu from '../components/FiltersMenu'
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
            <div className='flex w-full min-h-screen bg-gray dark:bg-dark-bg'>
                <Sidebar isAdmin={false} />
                <main className='flex-1 min-w-0 flex items-center justify-center lg:ml-64'>
                    <span className='text-sm text-gray-dark dark:text-dark-text-muted'>Carregando...</span>
                </main>
            </div>
        )
    }

    if (meError || !me) {
        return (
            <div className='flex w-full min-h-screen bg-gray dark:bg-dark-bg'>
                <Sidebar isAdmin={false} />
                <main className='flex-1 min-w-0 flex items-center justify-center lg:ml-64'>
                    <span className='text-sm text-red-base'>{meError ?? 'Não foi possível carregar seus dados.'}</span>
                </main>
            </div>
        )
    }

    if (!me.isAdmin) {
        return (
            <div className='flex w-full min-h-screen bg-gray dark:bg-dark-bg'>
                <Sidebar isAdmin={false} />
                <main className='flex-1 min-w-0 flex items-center justify-center lg:ml-64'>
                    <span className='text-sm font-medium text-red-base'>Acesso restrito a administradores.</span>
                </main>
            </div>
        )
    }

    return (
        <div className='flex w-full min-h-screen bg-gray dark:bg-dark-bg'>
            <Sidebar isAdmin={me.isAdmin} />

            <main className='flex-1 min-w-0 flex flex-col lg:ml-64'>
                <section className='flex-1 w-full max-w-6xl mx-auto px-6 pt-20 pb-10 lg:pt-10'>
                    <h1 className='text-2xl font-semibold text-gray-text dark:text-dark-text mb-1'>Admin</h1>
                    <p className='text-sm text-gray-dark dark:text-dark-text-muted mb-6'>
                        Posição atual — estoque, contas em aberto e liquidez. Saldo de agora, sem filtro de período.
                    </p>

                    <FiltersMenu>
                        <div className='flex flex-col gap-2'>
                            <span className='text-xs font-semibold uppercase tracking-wide text-gray-dark dark:text-dark-text-muted'>
                                Filiais
                            </span>
                            <FilialMultiFilter
                                branches={branchesDisponiveis}
                                selected={filiaisAtivas}
                                onChange={setSelecionadas}
                            />
                        </div>
                    </FiltersMenu>

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
        </div>
    )
}
