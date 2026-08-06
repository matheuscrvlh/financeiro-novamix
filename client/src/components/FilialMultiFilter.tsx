import { FILIAIS } from '../constants/filiais'

type FilialMultiFilterProps = {
    branches: number[]
    selected: number[]
    onChange: (value: number[]) => void
}

export default function FilialMultiFilter({ branches, selected, onChange }: FilialMultiFilterProps) {
    const baseClass = 'px-4 py-2 rounded-lg text-sm font-medium transition border'
    const activeClass = 'bg-orange-base text-white border-orange-base'
    const inactiveClass =
        'bg-white text-gray-text border-gray-base/30 hover:border-orange-base dark:bg-dark-surface dark:text-dark-text dark:border-dark-border'

    const todasSelecionadas = branches.every((id) => selected.includes(id))

    function toggle(id: number) {
        if (selected.includes(id)) {
            const restante = selected.filter((sid) => sid !== id)
            onChange(restante.length > 0 ? restante : branches)
            return
        }
        onChange([...selected, id])
    }

    return (
        <div className='flex flex-wrap gap-2'>
            {branches.length > 1 && (
                <button
                    type='button'
                    className={`${baseClass} ${todasSelecionadas ? activeClass : inactiveClass}`}
                    onClick={() => onChange(branches)}
                >
                    Todas
                </button>
            )}
            {branches.map((id) => (
                <button
                    key={id}
                    type='button'
                    className={`${baseClass} ${selected.includes(id) ? activeClass : inactiveClass}`}
                    onClick={() => toggle(id)}
                >
                    {FILIAIS[id] ?? `Filial ${id}`}
                </button>
            ))}
        </div>
    )
}
