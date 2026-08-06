export interface MeInfo {
    permission: string
    branches: number[]
    isAdmin: boolean
}

export interface BaseRow {
    IDEMPRESA: number
    NOME_EMPRESA: string
}

export interface VendaBrutaRow extends BaseRow {
    VALOR_VENDA_BRUTA: number
}

export interface LucroBrutoRow extends BaseRow {
    LUCRO_BRUTO: number
}

export interface LucroLiquidoRow extends BaseRow {
    LUCRO_LIQUIDO: number
}

export interface CancelamentosRow extends BaseRow {
    VALOR_CANCELAMENTOS: number
}

export interface DevolucoesRow extends BaseRow {
    VALOR_DEVOLUCOES: number
}

export interface CuponsRow extends BaseRow {
    N_CUPONS: number
}

export interface TicketMedioRow extends BaseRow {
    TICKET_MEDIO: number
}

export interface EstoqueRow extends BaseRow {
    VALOR_ESTOQUE: number
}

export interface ContasReceberAbertoRow extends BaseRow {
    VALOR_RECEBER_ABERTO: number
}

export interface ContasPagarAbertoRow extends BaseRow {
    VALOR_PAGAR_ABERTO: number
}

export interface LiquidezCorrenteRow extends BaseRow {
    LIQUIDEZ_CORRENTE: number
}
