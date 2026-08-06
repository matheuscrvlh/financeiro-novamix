import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'
import type { BaseRow } from '../types/financeiro'

export function useRelatorioAtual<T extends BaseRow>(endpoint: string, enabled: boolean) {
    const [rows, setRows] = useState<T[]>([])
    const [erro, setErro] = useState<string | null>(null)
    const [carregado, setCarregado] = useState(false)

    const loading = enabled && !carregado

    useEffect(() => {
        if (!enabled) return

        let cancelled = false

        apiGet<T[]>(endpoint)
            .then((data) => {
                if (cancelled) return
                setRows(data)
                setErro(null)
                setCarregado(true)
            })
            .catch((err) => {
                if (cancelled) return
                setErro(err.message)
                setCarregado(true)
            })

        return () => {
            cancelled = true
        }
    }, [enabled, endpoint])

    return { rows, loading, erro }
}
