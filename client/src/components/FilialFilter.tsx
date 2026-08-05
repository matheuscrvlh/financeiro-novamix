import { FILIAIS } from '../constants/filiais'

type FilialFilterProps = {
    branches: number[]
    selected: number | 'todas'
    onChange: (value: number | 'todas') => void
}

export default function FilialFilter({ branches, selected, onChange }: FilialFilterProps) {
    const baseClass = 'px-4 py-2 rounded-lg text-sm font-medium transition border'
    const activeClass = 'bg-orange-base text-white border-orange-base'
    const inactiveClass =
        'bg-white text-gray-text border-gray-base/30 hover:border-orange-base dark:bg-dark-surface dark:text-dark-text dark:border-dark-border'

    return (
        <div className='flex flex-wrap gap-2'>
            {branches.length > 1 && (
                <button
                    type='button'
                    className={`${baseClass} ${selected === 'todas' ? activeClass : inactiveClass}`}
                    onClick={() => onChange('todas')}
                >
                    Todas
                </button>
            )}
            {branches.map((id) => (
                <button
                    key={id}
                    type='button'
                    className={`${baseClass} ${selected === id ? activeClass : inactiveClass}`}
                    onClick={() => onChange(id)}
                >
                    {FILIAIS[id] ?? `Filial ${id}`}
                </button>
            ))}
        </div>
    )
}
