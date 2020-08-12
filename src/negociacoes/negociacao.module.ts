import { Module } from "@nestjs/common";
import { NegociacaoController } from "./negociacao.controller";
import { NegociacaoService } from "./negociacao.service";
import { MongooseModule } from "@nestjs/mongoose";
import { NegociacaoSchema } from './models/negociacao.model';

@Module({
  imports: [MongooseModule.forFeature([{
    name: 'Negociacao',
    schema: NegociacaoSchema,
  }])],
  controllers: [NegociacaoController],
  providers: [NegociacaoService],
})
export class NegociacaoModule {}