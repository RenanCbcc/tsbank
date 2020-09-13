import { Negociacao, Negociacoes } from "../models/index";
import { IProxyNegociacao } from "./IProxyNegociacao";

export class ProxyNegociacao implements IProxyNegociacao {

    constructor(private _list: Negociacoes, private _armadilha: Function) {
        this._armadilha(this);
    }

    public adiciona(negociacao: Negociacao): void {
        this._list.adiciona(negociacao)
        this._armadilha(this)        
    }
    public esvazia(): void {
        this._list.esvazia();
        this._armadilha(this)        
    }

    public paraArray(): Negociacao[] {
        return this._list.paraArray();
    }

}