import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Produto } from "./models/produtos.model";
import { Model } from "mongoose";

@Injectable()
export class ProdutosService {
  private produtos: Produto[] = [];
  
  //O construtor aqui vai levar como base um modelo, este é o modelo declarado anteriormente no app.mdoule injetado
  // ele se associa com o schema que foi criado
  // o Model é importado porque produtoModel é um modelo genérico, para fazer a declaraçãpo corretamente eu o defino aqui
  constructor(@InjectModel('Produto') private readonly produtoModel: Model<Produto>) {}

  async inserirNovoProduto(
    tipo: string,
    desc: string,
    marca: string,
    preco: number) {
      const novoProduto =  new this.produtoModel({
        tipo: tipo, 
        desc: desc, 
        marca: marca, 
        preco: preco,
      });
      //salva produto na base de dados, é nativo do mongoose
      // o async é para evitar then
      let result 
      try {
        result = await novoProduto.save();
      } catch(error) {
        throw new InternalServerErrorException(`Houve um erro ao cadastrar um produto`, error.message)
      }
      return result.id
    }

    async pegaTodosProdutos() {
      let todosProdutos
      try {
         //busca todos os produtos na base e encapsula num array com todos os elementos tratados um a um
        todosProdutos = await this.produtoModel.find()
      } catch(error) {
        throw new InternalServerErrorException(`Houve um erro buscar os produtos`, error.message)
      } 
     
      return todosProdutos.map((prod) => ({
        id: prod.id,
        tipo: prod.tipo,
        marca: prod.marca,
        descricao: prod.desc,
        preco: prod.preco
      }));
    }

    async pegaProduto(id: string) {
      const produtoSelecionado =  await this.filtroProduto(id)
      return {
        id: produtoSelecionado.id,
        tipo: produtoSelecionado.tipo,
        marca: produtoSelecionado.marca,
        descricao: produtoSelecionado.desc,
        preco: produtoSelecionado.preco,
      }
    }

    async apagarProduto(id: string) {
      let produtoDeletado = await this.filtroProduto(id)
      try {
        // uma vez carregado o objeto pode-se utilizar as funções nativas do mesmo
       // aqui a função deleta o documento baseado no valor já carregado do objeto
        produtoDeletado.remove()
      } catch(error) {
        throw new InternalServerErrorException(`Houve um erro ao remover um produto`, error.message)
      }
      return {
        mensagem: `Produto id ${id} removido com sucesso`
      } 
    }

    async alteraProduto(
      id: string, 
      tipo: string,
      desc: string,
      marca: string,
      preco: number) {
      // A lógica aqui é carregar um objeto do tipo produto
      // com todas as funções já carregadas pertinanetes ao objeto
      let produtoAtualizado = await this.filtroProduto(id)
  
      if (tipo)
        produtoAtualizado.tipo = tipo
      if (desc)
        produtoAtualizado.desc = desc
      if (marca)
        produtoAtualizado.marca = marca
      if (preco)
        produtoAtualizado.preco = preco
      // uma vez carregado o objeto pode-se utilizar as funções nativas do mesmo
      // aqui a função salva o objeto carregado com os novos valores
      produtoAtualizado.save();

      return {
        id: produtoAtualizado.id,
        tipo: produtoAtualizado.tipo,
        marca: produtoAtualizado.marca,
        descricao: produtoAtualizado.desc,
        preco: produtoAtualizado.preco,
      }
    }

    private async filtroProduto(id): Promise<Produto> {
      let selectProd;
      try {
        selectProd = await this.produtoModel.findById(id)
      } catch (error) {
        throw new NotFoundException(`Produto não encontrado`)
      } 
      return selectProd
    }
}