import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProdutosModule } from './produtos/produtos.module';
import { NegociacaoModule } from './negociacoes/negociacao.module';
import { MongooseModule } from '@nestjs/mongoose';

//é obrigatória a importação deste módulo, para que o nest enxergue a rota na request
// importa os métodos para mongoose
@Module({
  imports: [ ProdutosModule, NegociacaoModule,
    MongooseModule.forRoot(
    'mongodb+srv://userTeste2:teste@123@cluster0.5g9o4.gcp.mongodb.net/nestjs-teste?retryWrites=true&w=majority'
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
