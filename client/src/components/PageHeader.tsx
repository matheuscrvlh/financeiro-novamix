import { Link } from 'react-router-dom'
import Logo from './Logo'

type PageHeaderProps = {
    isAdmin: boolean
    variant: 'principal' | 'admin'
}

const linkClass =
    'text-sm font-medium text-gray-text transition hover:text-orange-base dark:text-dark-text dark:hover:text-orange-light'

export default function PageHeader({ isAdmin, variant }: PageHeaderProps) {
    return (
        <header className='w-full bg-white dark:bg-dark-surface shadow-sm flex items-center justify-between px-6 py-3'>
            <Logo compact />
            <div className='flex items-center gap-4'>
                {variant === 'principal' && isAdmin && (
                    <Link to='/admin' className={linkClass}>
                        Admin
                    </Link>
                )}
                {variant === 'admin' && (
                    <Link to='/' className={linkClass}>
                        ← Painel
                    </Link>
                )}
                <a href='https://hub.lojanovamix.com.br' className={linkClass}>
                    ← Voltar ao Hub
                </a>
            </div>
        </header>
    )
}
