import { EstudosPorPlanta } from './EstudosPorPlanta';
import { FormaPreparo } from './FormaPreparo';

export class IndicacaoUso {
  idIndicacaoUso: number;
  nomeIndicacao: string;
  imagemIndicacao: string | null = "";

  constructor(obj: Partial<IndicacaoUso> = {}) {
    Object.assign(this, obj);
  }
}
