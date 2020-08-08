import * as mongoose from 'mongoose'

export const ProdutoSchema = new mongoose.Schema({
    tipo: { type: String, required: true },
    desc: { type: String, required: false },
    marca: { type: String, required: true },
    preco: { type: Number, requeired: true },
});

export interface Produto extends mongoose.Document{
  id: string;
  tipo: string;
  desc: string;
  marca: string;
  preco: number;
}