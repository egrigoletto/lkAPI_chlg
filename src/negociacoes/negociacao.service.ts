import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Negociacao } from "./models/negociacao.model";
import { Model } from "mongoose";
import axios from "axios";
import xmlBuilder from "xmlbuilder";

@Injectable()
export class NegociacaoService {
  constructor(@InjectModel('Negociacao') private readonly negociacaoModel: Model<Negociacao>) {}

  async geraNegociacoes(
    domainPipeDrive: string,
    keyPipeDrive: string,
    keyBling: string,
  ) {
    let todasNegociacoes
    let negociacoesGanhas
    let responseXml
    axios.get(`https://${domainPipeDrive}/api/v1/deals?api_token=${keyPipeDrive}`)
    .then(async (response) => {
      todasNegociacoes = response.data
      todasNegociacoes.map((negociacao) => {
        if (negociacao.status === 'won')
          negociacoesGanhas.push()
      })
      if (negociacoesGanhas) {
        responseXml = await this.montaXmlVendas(keyBling, negociacoesGanhas)
        return responseXml
      }
    else {
      throw new NotFoundException('Não há negociações ganhas')
    }  
    })
    .catch((error) => {
      throw new InternalServerErrorException(`Houve um erro ao obter os dados de negociações do pipedrive`, error)
    });
  }

  async pegaNegociacoes() {
    let todasNegociacoes
    try {
      todasNegociacoes = await this.negociacaoModel.find()
    } catch(error) {
      throw new InternalServerErrorException(`Houve um erro buscar as negociações produtos`, error.message)
    } 
   
    return todasNegociacoes.map((negociacao) => ({
      id: negociacao.id,
      data: negociacao.marca,
      total: negociacao.total
    }));
  }

  montaXmlVendas(keyBling, negociacoesGanhas) {
    negociacoesGanhas.map((negociacao) => {
      let xmlPedido = xmlBuilder.create('root')
      .ele('data', negociacao.won_time.substring(0,10).replace(/\//g, ''))
      .ele('pedido')
        .ele('cliente')
          .ele('nome', negociacao.title)
        .ele('items')
          .ele('item')
            .ele('descricao', negociacao.title)
            .ele('qtde', 1)
            .ele('vlr_unit', negociacao.value)
        .ele('parcela', negociacao.value)
      .end({pretty: true})
      axios.get(`https://bling.com.br/Api/v2/pedido?apiKey=${keyBling}&xml=${xmlPedido}`)
      .then(() => {
        this.insereNegociacao(negociacao.won_time, negociacao.formatted_value)
      })
      .catch((error) => {
        throw new InternalServerErrorException(`Houve um erro ao criar o pedido no bling`, error)
      });
    })
    return {
      message: `negociações feitas com sucesso`
    }
  }

  async insereNegociacao(
    data: string,
    total: string,) {
      const novaNegociacao =  new this.negociacaoModel({
        data: data, 
        total: total, 
      });
      let result 
      try {
        result = await novaNegociacao.save();
      } catch(error) {
        throw new InternalServerErrorException(`Houve um erro ao cadastrar a negociacao`, error.message)
      }
    }
}

