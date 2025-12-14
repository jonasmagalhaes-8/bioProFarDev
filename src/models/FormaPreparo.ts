import { MetodoPreparo } from './MetodoPreparo';
import { Planta } from './Planta';
import { UsuarioModel } from './UsuarioModel';

export class FormaPreparo {
    idFormaPreparo: number;
    planta: Planta;
    metodoPreparo: MetodoPreparo;
    tipo: string;
    composicaoConcentracao: string;
    constaRename: string;
    referencia: string;
    posologiaCaseiro: string;
    partePlantaCaseiro: string;
    usuario: UsuarioModel;
    dataEdicao: string;
}
