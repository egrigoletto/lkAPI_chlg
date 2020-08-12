import * as mongoose from 'mongoose'

export const NegociacaoSchema = new mongoose.Schema({
    data: { type: String, required: true },
    total: { type: Number, required: true },
});

export interface Negociacao extends mongoose.Document{
  id: string;
  data: string;
  total: number;
}