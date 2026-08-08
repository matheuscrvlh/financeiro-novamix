import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from './Logo'
import { CloseIcon, LogOutIcon, MenuIcon } from './icons'

type SidebarProps = {
    isAdmin: boolean
}

const HUB_URL = 'https://hub.lojanovamix.com.br'

const linkBaseClass = 'block w-full rounded-lg px-4 py-2 text-center text-sm font-semibold transition-colors'
const linkActiveClass = 'bg-orange-base text-white'
const linkInactiveClass =
    'text-gray-text hover:bg-orange-base/10 hover:text-orange-base dark:text-dark-text dark:hover:bg-orange-base/10 dark:hover:text-orange-light'

export default function Sidebar({ isAdmin }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false)

    function fechar() {
        setIsOpen(false)
    }

    return (
        <>
            <button
                type='button'
                onClick={() => setIsOpen(true)}
                className='fixed top-4 left-4 z-50 rounded-md bg-orange-base p-2 text-white shadow-lg transition-colors hover:bg-orange-light lg:hidden'
                aria-label='Abrir menu'
            >
                <MenuIcon className='h-6 w-6' />
            </button>

            <div
                className={`fixed inset-0 z-30 bg-black transition-opacity duration-300 lg:hidden ${
                    isOpen ? 'pointer-events-auto opacity-50' : 'pointer-events-none opacity-0'
                }`}
                onClick={fechar}
            />

            <aside
                className={`fixed top-0 left-0 z-40 flex h-dvh w-64 flex-col border-r border-gray-base/30 bg-white shadow-sm transition-transform duration-300 ease-in-out dark:border-dark-border dark:bg-dark-surface lg:z-auto lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className='flex items-center justify-between px-4 pt-4 lg:justify-center'>
                    <Logo compact />
                    <button
                        type='button'
                        onClick={fechar}
                        className='rounded-md p-1 text-gray-dark hover:text-orange-base dark:text-dark-text-muted dark:hover:text-orange-light lg:hidden'
                        aria-label='Fechar menu'
                    >
                        <CloseIcon className='h-6 w-6' />
                    </button>
                </div>

                <nav className='mt-8 flex flex-1 flex-col gap-2 px-4'>
                    <NavLink
                        to='/'
                        end
                        onClick={fechar}
                        className={({ isActive }) => `${linkBaseClass} ${isActive ? linkActiveClass : linkInactiveClass}`}
                    >
                        Dashboard
                    </NavLink>
                    {isAdmin && (
                        <NavLink
                            to='/admin'
                            onClick={fechar}
                            className={({ isActive }) => `${linkBaseClass} ${isActive ? linkActiveClass : linkInactiveClass}`}
                        >
                            Admin
                        </NavLink>
                    )}
                </nav>

                <a
                    href={HUB_URL}
                    className='mx-4 mb-6 flex items-center justify-center gap-2 rounded-lg bg-red-light px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-base'
                >
                    <LogOutIcon className='h-4 w-4' />
                    Sair
                </a>
            </aside>
        </>
    )
}
