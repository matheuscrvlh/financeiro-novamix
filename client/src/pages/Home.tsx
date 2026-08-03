import { useEffect, useState } from 'react'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

type Status = 'loading' | 'ok' | 'error'

export default function Home() {
    const [status, setStatus] = useState<Status>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/teste`, {
            method: 'POST',
            credentials: 'include',
        })
            .then(async (res) => {
                const data = await res.json()
                setStatus(res.ok ? 'ok' : 'error')
                setMessage(res.ok ? data.message : `${res.status}: ${data.error}`)
            })
            .catch(() => {
                setStatus('error')
                setMessage('Falha ao conectar na API.')
            })
    }, [])

    const statusStyles: Record<Status, string> = {
        loading: 'bg-gray text-gray-dark dark:bg-dark-surface-2 dark:text-dark-text-muted',
        ok: 'bg-green-base/10 text-green-base',
        error: 'bg-red-light/10 text-red-base',
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

            <section className='flex-1 w-full max-w-3xl mx-auto px-6 py-10'>
                <h1 className='text-2xl font-semibold text-gray-text dark:text-dark-text mb-1'>
                    Financeiro Novamix
                </h1>
                <p className='text-sm text-gray-dark dark:text-dark-text-muted mb-8'>
                    Módulo financeiro em desenvolvimento.
                </p>

                <div className='rounded-xl border border-gray-base/30 bg-white dark:bg-dark-surface dark:border-dark-border p-6 shadow-sm'>
                    <span className='text-sm font-medium text-gray-text dark:text-dark-text'>
                        Status da sessão
                    </span>
                    <div className={`mt-3 rounded-lg px-4 py-3 text-sm font-medium ${statusStyles[status]}`}>
                        {status === 'loading' ? 'Verificando cookie de autenticação...' : message}
                    </div>
                </div>
            </section>

            <div className='pb-6'>
                <Footer />
            </div>
        </main>
    )
}
