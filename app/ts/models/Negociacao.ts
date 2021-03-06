export class Negociacao {

    private _data: Date;
    private _quantidade: number;
    private _valor: number;


    constructor(data: Date, quantidade: number, valor: number) {
        this._data = new Date(data.getTime());
        this._quantidade = quantidade;
        this._valor = valor;
    }

    get data() {
        return new Date(this._data.getTime());
    }

    get quantidade() {

        return this._quantidade;

    }

    get valor() {

        return this._valor;
    }

    get volume() {

        return this._quantidade * this._valor;
    }

    ehIgual(negociacao: Negociacao) {
        return JSON.stringify(this) == JSON.stringify(negociacao)

    }

}