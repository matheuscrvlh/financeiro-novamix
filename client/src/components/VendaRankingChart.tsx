import { nomeFilial } from '../constants/filiais'
import { formatCurrency } from '../lib/format'
import type { VendaBrutaRow } from '../types/financeiro'

type VendaRankingChartProps = {
    rows: VendaBrutaRow[]
    selecionadas: number[]
    loading: boolean
    erro: string | null
}

// Ramp sequencial (um hue, mais escuro = maior venda) — magnitude, não identidade.
const RAMP_SEQUENCIAL = ['#0d366b', '#184f95', '#256abf', '#3987e5', '#6da7ec', '#86b6ef']

export default function VendaRankingChart({ rows, selecionadas, loading, erro }: VendaRankingChartProps) {
    const ranking = selecionadas
        .map((id) => ({
            id,
            nome: nomeFilial(id),
            valor: Number(rows.find((row) => row.IDEMPRESA === id)?.VALOR_VENDA_BRUTA ?? 0),
        }))
        .sort((a, b) => b.valor - a.valor)

    const maior = Math.max(...ranking.map((item) => item.valor), 1)

    return (
        <div className='rounded-xl border border-gray-base/30 bg-white dark:bg-dark-surface dark:border-dark-border p-6 shadow-sm'>
            <span className='text-sm font-medium text-gray-text dark:text-dark-text'>
                Venda bruta — ranking por filial
            </span>

            {erro && (
                <div className='mt-3 rounded-lg px-4 py-3 text-sm font-medium bg-red-light/10 text-red-base'>
                    {erro}
                </div>
            )}

            {!erro && (
                <div className='mt-6 min-w-0 overflow-x-auto'>
                    <div className='flex h-72 min-w-full items-end gap-1.5 px-1 sm:gap-3 lg:h-96 lg:gap-6'>
                        {ranking.map((item, indice) => {
                            const altura = loading ? 0 : Math.max((item.valor / maior) * 100, 2)
                            const cor = RAMP_SEQUENCIAL[Math.min(indice, RAMP_SEQUENCIAL.length - 1)]

                            return (
                                <div key={item.id} className='flex h-full min-w-11 flex-1 flex-col items-center justify-end gap-1.5 sm:min-w-16 sm:gap-2 lg:min-w-20'>
                                    <span className='w-full text-center text-[10px] font-semibold tabular-nums text-gray-text dark:text-dark-text sm:text-xs'>
                                        {loading ? '...' : formatCurrency(item.valor)}
                                    </span>
                                    <div
                                        className='w-full max-w-8 rounded-t-sm bg-gray transition-all duration-300 hover:brightness-110 dark:bg-dark-surface-2 sm:max-w-12 lg:max-w-16'
                                        style={{ height: `${altura}%`, backgroundColor: cor }}
                                        title={`${item.nome}: ${formatCurrency(item.valor)}`}
                                        tabIndex={0}
                                    />
                                    <span className='w-full truncate text-center text-[10px] font-medium text-gray-dark dark:text-dark-text-muted'>
                                        {item.nome}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
