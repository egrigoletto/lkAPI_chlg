import { Module } from "@nestjs/common";
import { ProdutosController } from "./produtos.controller";
import { ProdutosService } from "./produtos.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProdutoSchema } from './models/produtos.model'

@Module({
  //torna mongoose injetável para qq dependência dentro do módulo
  //forFeature configura os dados que serão passados os por por injeção
  imports: [MongooseModule.forFeature([{
    name: 'Produto',
    schema: ProdutoSchema,
  }])],
  controllers: [ProdutosController],
  providers: [ProdutosService],
})
export class ProdutosModule {}