var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NegociacoesView, MensagemView } from '../views/index';
import { Negociacoes, Negociacao, Mensagem } from '../models/index';
import { domInject, throttle } from '../decorators/index';
import { DateHelper } from '../helpers/index';
import { NegociacaoService } from '../services/index';
import { ProxyNegociacao } from '../helpers/index';
import { ProxyMensagem } from '../helpers/index';
export class NegociacaoController {
    constructor() {
        this._ordemAtual = '';
        this._negociacaoService = new NegociacaoService();
        this._negociacoesView = new NegociacoesView('#negociacoesView');
        this._negociacoes = new ProxyNegociacao(new Negociacoes(), (model) => { this._negociacoesView.update(model); });
        this._mensagemView = new MensagemView('#mensagemView');
        this._mensagem = new ProxyMensagem(new Mensagem(), (model) => { this._mensagemView.update(model); });
        this._negociacaoService
            .lista()
            .then(negociacoes => {
            negociacoes.forEach(negociacao => {
                this._negociacoes.adiciona(negociacao);
            });
        });
    }
    adiciona(event) {
        event.preventDefault();
        let negociacao = this._criaNegociacao();
        if (negociacao) {
            this._negociacaoService
                .cadastra(negociacao)
                .then(memsagem => {
                this._negociacoes.adiciona(negociacao);
                this._mensagem.setTexto(memsagem);
                this._limpaFormulario();
            });
        }
    }
    apaga() {
        this._negociacaoService
            .apagaTudo()
            .then(memsagem => {
            this._mensagem.setTexto(memsagem);
            this._negociacoes.esvazia();
        });
    }
    ordena(coluna) {
        if (this._ordemAtual == coluna) {
            this._negociacoes.ordena(function (a, b) {
                return b[coluna] - a[coluna];
            });
        }
        else {
            this._negociacoes.ordena(function (a, b) {
                return a[coluna] - b[coluna];
            });
        }
        this._ordemAtual = coluna;
    }
    importa() {
        function isOK(res) {
            if (res.ok) {
                return res;
            }
            else {
                throw new Error(res.statusText);
            }
        }
        Promise.all([
            this._negociacaoService.obterNegociacoesDaSemana(isOK),
            this._negociacaoService.obterNegociacoesDaSemanaPassada(isOK),
            this._negociacaoService.obterNegociacoesDaRetrasada(isOK)
        ]).then(negociacoes => {
            return negociacoes
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue));
        }).then(negociacoes => {
            return negociacoes
                .filter(negociacao => !this._negociacoes.contem(negociacao));
        }).then(negociacoes => {
            negociacoes.forEach(negociacao => this._negociacoes.adiciona(negociacao));
            this._mensagem.setTexto("Negociações importadas com sucesso.");
        });
    }
    _criaNegociacao() {
        let data = DateHelper.textoParaData(this._inputData.val());
        if (!this._ehDiaUtil(data)) {
            this._mensagem.setTexto('Somente negociações em dias úteis, por favor!');
            return null;
        }
        else {
            const negociacao = new Negociacao(data, parseInt(this._inputQuantidade.val()), parseFloat(this._inputValor.val()));
            return negociacao;
        }
    }
    _ehDiaUtil(data) {
        return data.getDay() != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo;
    }
    _limpaFormulario() {
        this._inputData.val("");
        this._inputQuantidade.val(1);
        this._inputValor.val(0.0);
    }
}
__decorate([
    domInject('#data')
], NegociacaoController.prototype, "_inputData", void 0);
__decorate([
    domInject('#quantidade')
], NegociacaoController.prototype, "_inputQuantidade", void 0);
__decorate([
    domInject('#valor')
], NegociacaoController.prototype, "_inputValor", void 0);
__decorate([
    throttle()
], NegociacaoController.prototype, "importa", null);
var DiaDaSemana;
(function (DiaDaSemana) {
    DiaDaSemana[DiaDaSemana["Domingo"] = 0] = "Domingo";
    DiaDaSemana[DiaDaSemana["Segunda"] = 1] = "Segunda";
    DiaDaSemana[DiaDaSemana["Terca"] = 2] = "Terca";
    DiaDaSemana[DiaDaSemana["Quarta"] = 3] = "Quarta";
    DiaDaSemana[DiaDaSemana["Quinta"] = 4] = "Quinta";
    DiaDaSemana[DiaDaSemana["Sexta"] = 5] = "Sexta";
    DiaDaSemana[DiaDaSemana["Sabado"] = 6] = "Sabado";
})(DiaDaSemana || (DiaDaSemana = {}));
