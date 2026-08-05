import { useEffect, useState } from 'react'
import Logo from '../components/Logo'
import Footer from '../components/Footer'
import FilialFilter from '../components/FilialFilter'
import DateRangeFilter from '../components/DateRangeFilter'
import { useMe } from '../hooks/useMe'
import { apiGet } from '../lib/api'
import { formatCurrency } from '../lib/format'
import { nomeFilial } from '../constants/filiais'
import type { VendaBrutaRow } from '../types/financeiro'

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

    const [rows, setRows] = useState<VendaBrutaRow[]>([])
    const [erroDados, setErroDados] = useState<string | null>(null)
    const [loadedKey, setLoadedKey] = useState<string | null>(null)

    const requestKey = `${inicio}|${fim}`
    const loadingDados = me !== null && loadedKey !== requestKey

    useEffect(() => {
        if (!me) return

        let cancelled = false

        apiGet<VendaBrutaRow[]>('/financeiro/venda-bruta', { inicio, fim })
            .then((data) => {
                if (cancelled) return
                setRows(data)
                setErroDados(null)
                setLoadedKey(requestKey)
            })
            .catch((err) => {
                if (cancelled) return
                setErroDados(err.message)
                setLoadedKey(requestKey)
            })

        return () => {
            cancelled = true
        }
    }, [me, inicio, fim, requestKey])

    const linhasFiltradas = filial === 'todas' ? rows : rows.filter((row) => row.IDEMPRESA === filial)

    const totalPeriodo = linhasFiltradas.reduce((total, row) => total + Number(row.VALOR_VENDA_BRUTA), 0)

    const totalPorFilial = rows.reduce<Record<number, number>>((acc, row) => {
        acc[row.IDEMPRESA] = (acc[row.IDEMPRESA] ?? 0) + Number(row.VALOR_VENDA_BRUTA)
        return acc
    }, {})

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
            <header className='w-full bg-white dark:bg-dark-surface shadow-sm flex items-center justify-between px-6 py-3'>
                <Logo compact />
                <a
                    href='https://hub.lojanovamix.com.br'
                    className='text-sm font-medium text-gray-text transition hover:text-orange-base dark:text-dark-text dark:hover:text-orange-light'
                >
                    ← Voltar ao Hub
                </a>
            </header>

            <section className='flex-1 w-full max-w-5xl mx-auto px-6 py-10'>
                <h1 className='text-2xl font-semibold text-gray-text dark:text-dark-text mb-1'>
                    Financeiro Novamix
                </h1>
                <p className='text-sm text-gray-dark dark:text-dark-text-muted mb-8'>
                    Visão geral de vendas por filial.
                </p>

                <div className='flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between'>
                    <FilialFilter branches={me.branches} selected={filial} onChange={setFilial} />
                    <DateRangeFilter inicio={inicio} fim={fim} onChangeInicio={setInicio} onChangeFim={setFim} />
                </div>

                <div className='rounded-xl border border-gray-base/30 bg-white dark:bg-dark-surface dark:border-dark-border p-6 shadow-sm mb-6'>
                    <span className='text-sm font-medium text-gray-text dark:text-dark-text'>
                        Venda bruta {filial === 'todas' ? '— todas as filiais' : `— ${nomeFilial(filial)}`}
                    </span>

                    {erroDados && (
                        <div className='mt-3 rounded-lg px-4 py-3 text-sm font-medium bg-red-light/10 text-red-base'>
                            {erroDados}
                        </div>
                    )}

                    {!erroDados && (
                        <div className='mt-3 text-3xl font-semibold text-gray-text dark:text-dark-text'>
                            {loadingDados ? '...' : formatCurrency(totalPeriodo)}
                        </div>
                    )}
                </div>

                {filial === 'todas' && me.branches.length > 1 && (
                    <div className='rounded-xl border border-gray-base/30 bg-white dark:bg-dark-surface dark:border-dark-border p-6 shadow-sm'>
                        <span className='text-sm font-medium text-gray-text dark:text-dark-text'>Por filial</span>
                        <ul className='mt-3 divide-y divide-gray-base/20 dark:divide-dark-border'>
                            {me.branches.map((id) => (
                                <li key={id} className='flex items-center justify-between py-2 text-sm'>
                                    <span className='text-gray-text dark:text-dark-text'>{nomeFilial(id)}</span>
                                    <span className='font-medium text-gray-text dark:text-dark-text'>
                                        {formatCurrency(totalPorFilial[id] ?? 0)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            <div className='pb-6'>
                <Footer />
            </div>
        </main>
    )
}
