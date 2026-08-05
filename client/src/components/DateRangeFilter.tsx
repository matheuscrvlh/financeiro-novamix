type DateRangeFilterProps = {
    inicio: string
    fim: string
    onChangeInicio: (value: string) => void
    onChangeFim: (value: string) => void
}

export default function DateRangeFilter({ inicio, fim, onChangeInicio, onChangeFim }: DateRangeFilterProps) {
    const inputClass =
        'rounded-lg border border-gray-base/30 bg-white px-3 py-2 text-sm text-gray-text dark:bg-dark-surface dark:border-dark-border dark:text-dark-text'

    return (
        <div className='flex items-center gap-2'>
            <input
                type='date'
                value={inicio}
                onChange={(e) => onChangeInicio(e.target.value)}
                className={inputClass}
            />
            <span className='text-sm text-gray-dark dark:text-dark-text-muted'>até</span>
            <input
                type='date'
                value={fim}
                onChange={(e) => onChangeFim(e.target.value)}
                className={inputClass}
            />
        </div>
    )
}
