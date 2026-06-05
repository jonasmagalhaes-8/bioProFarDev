import { UsuarioModel } from "./UsuarioModel"

export class MetodoPreparo {
  idMetodoPreparo: number
  descricaoMetodo: string
  detalhamento: string = ''
  referencia1: string = ''
  referencia2: string = ''
  referencia3: string = ''
  referencia4: string = ''
  referencia5: string = ''
  tipo: string = 'CASEIRA'
  usuario: UsuarioModel;
  dataEdicao: string;
}
