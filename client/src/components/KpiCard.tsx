import { nomeFilial } from '../constants/filiais'
import type { BaseRow } from '../types/financeiro'

const TOTAL_FILIAIS = 100

type KpiCardProps<T extends BaseRow> = {
    titulo: string
    rows: T[]
    valueKey: keyof T
    formatValor: (value: number) => string
    filial: number | 'todas'
    branches: number[]
    loading: boolean
    erro: string | null
}

export default function KpiCard<T extends BaseRow>({
    titulo,
    rows,
    valueKey,
    formatValor,
    filial,
    branches,
    loading,
    erro,
}: KpiCardProps<T>) {
    const idAlvo = filial === 'todas' ? TOTAL_FILIAIS : filial
    const linhaAlvo = rows.find((row) => row.IDEMPRESA === idAlvo)
    const total = linhaAlvo ? Number(linhaAlvo[valueKey]) : 0

    return (
        <div className='rounded-xl border border-gray-base/30 bg-white dark:bg-dark-surface dark:border-dark-border p-6 shadow-sm'>
            <span className='text-sm font-medium text-gray-text dark:text-dark-text'>
                {titulo}
                {filial !== 'todas' && ` — ${nomeFilial(filial)}`}
            </span>

            {erro && (
                <div className='mt-3 rounded-lg px-4 py-3 text-sm font-medium bg-red-light/10 text-red-base'>
                    {erro}
                </div>
            )}

            {!erro && (
                <div className='mt-3 text-2xl font-semibold text-gray-text dark:text-dark-text'>
                    {loading ? '...' : formatValor(total)}
                </div>
            )}

            {!erro && filial === 'todas' && branches.length > 1 && (
                <ul className='mt-4 divide-y divide-gray-base/20 dark:divide-dark-border'>
                    {branches.map((id) => {
                        const linha = rows.find((row) => row.IDEMPRESA === id)
                        const valor = linha ? Number(linha[valueKey]) : 0

                        return (
                            <li key={id} className='flex items-center justify-between py-1.5 text-xs'>
                                <span className='text-gray-dark dark:text-dark-text-muted'>{nomeFilial(id)}</span>
                                <span className='font-medium text-gray-text dark:text-dark-text'>
                                    {loading ? '...' : formatValor(valor)}
                                </span>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
