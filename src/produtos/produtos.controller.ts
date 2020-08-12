import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProdutosService } from './produtos.service';

//rota: /produtos
@Controller('produtos')
export class ProdutosController {
  //instancia o serviço para executar a função de adição
  constructor(private readonly produtosService: ProdutosService) {}
  //apenas haverá chamada a essa função ao usar o método POST do http
  @Post()
  /* retorna objeto, por isso a notação any 
    eu sou obrigado a madnar algo por body, @Body pega o body de uma request
  */
  async adicionarProduto(
    @Body() produtoReq: {
      tipo: string,
      descricao: string,
      marca: string,
      preco: number,
    }) {
    const novoProdutoId = await this.produtosService.inserirNovoProduto(
      produtoReq.tipo, 
      produtoReq.descricao, 
      produtoReq.marca, 
      produtoReq.preco)

    return {
      mensagem: "Produto gerado com sucesso",
      id: novoProdutoId
    }
  }
  
  @Get(':id')
  async retornaProduto(@Param('id') id: string) {
    return { produto: await this.produtosService.pegaProduto(id) }
  }

  @Get()
  async retornaTodosProdutos() {
    return { produtos: await this.produtosService.pegaTodosProdutos() }
  }
  

  @Put(':id')
  async alteraDadosProduto(
    @Param('id') id: string, 
    @Body() produtoReq: {
      tipo: string,
      descricao: string,
      marca: string,
      preco: number
    }){ 
      return {
        mensagem: 'Produto alterado com sucesso',
        produto: await this.produtosService.alteraProduto(
        id,
        produtoReq.tipo, 
        produtoReq.descricao, 
        produtoReq.marca, 
        produtoReq.preco
      )}
    }

  @Delete(':id')
  async removerProduto(@Param('id') id: string){
    return { result: await this.produtosService.apagarProduto(id)}
  }
}