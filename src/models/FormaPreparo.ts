import { MetodoPreparo } from './MetodoPreparo';
import { Planta } from './Planta';

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
}
