import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { NegociacaoService } from './negociacao.service';


@Controller('negociacoes')
export class NegociacaoController {
  constructor(private readonly negociacaoService: NegociacaoService) {}

  @Get()
    retornaNegociacoes(){
      return { negociacoes: this.negociacaoService.pegaNegociacoes() }
    }

  async geraNegociacoes(
    @Body() keyReq: {
      pipedrive_domain: string,
      key_pipedrive: string,
      bling_domain: string
      key_bling: string,
    }) {
      return await this.negociacaoService.geraNegociacoes(
        keyReq.pipedrive_domain,
        keyReq.key_pipedrive,
        keyReq.key_bling,
      ) 
  }

}