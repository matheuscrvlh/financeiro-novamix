export function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatNumber(value: number) {
    return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
}
