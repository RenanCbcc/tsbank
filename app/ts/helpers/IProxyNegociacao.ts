import { Negociacao } from "../models/Negociacao";

export interface IProxyNegociacao {
    ordena(criteria: SortingFunction): void
    adiciona(negociacao: Negociacao): void
    contem(negociacao: Negociacao): boolean
    esvazia(): void
    paraArray(): Negociacao[]
}

export interface SortingFunction {
    (a: any, b: any): number
}