import { MetodoPreparo } from './MetodoPreparo';
import { Planta } from './Planta';

export class FormaPreparo {
    idFormaPreparo: number;
    planta: Planta;
    metodoPreparo: MetodoPreparo;
    partePlanta: string;
    posologia: string;
    referencia: string;
    constaRename: string;
}
