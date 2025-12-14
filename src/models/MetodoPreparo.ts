import { UsuarioModel } from "./UsuarioModel"

export class MetodoPreparo {
  idMetodoPreparo: number
  descricaoMetodo: string
  referencia1: string = ''
  referencia2: string = ''
  referencia3: string = ''
  referencia4: string = ''
  referencia5: string = ''
  usuario: UsuarioModel;
  dataEdicao: string;
}
