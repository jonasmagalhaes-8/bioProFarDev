import { UsuarioModel } from "./UsuarioModel";

export class EstudoCientifico {
    idEstudoCientifico: number;
    tituloResumo: string;
    resumo: string;
    referencia: string;
    linkReferencia: string;
    usuario: UsuarioModel;
    dataEdicao: string;
}
