import { EstudosPorPlanta } from './EstudosPorPlanta';
import { FormaPreparo } from './FormaPreparo';

export class Planta {
  idPlanta: number;
  nome: string;
  nomeCientifico: string | null = "";
  sinonimia: string | null = "";
  referenciaNomeCientifico: string | null = "";
  nomesPopulares: string | null = "";
  referenciaNomesPopulares: string | null;
  imagem: string | null = "";
  linkImagem: string | null;
  constaRename: string | null;
  constaRenisus: string | null;
  indicacao: string | null;
  efeitosAdversos: string | null = "";
  referenciaEfeitosAdversos: string | null = "";
  contraIndicacao: string | null = "";
  referenciaContraIndicacao: string | null = "";
  estudosPorPlanta: EstudosPorPlanta[] | null;
  formaPreparo: FormaPreparo[] | null;
  resumoTrabalhos: string | null;

  constructor(obj: Partial<Planta> = {}) {
    Object.assign(this, obj);
  }
}
