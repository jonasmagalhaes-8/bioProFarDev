import { EstudoCientifico } from './EstudoCientifico';
import { Planta } from './Planta';
import { UsuarioModel } from './UsuarioModel';

export class EstudosPorPlanta {
    idEstudosPorPlanta: number = 0;

    planta: Planta;

    estudoCientifico: EstudoCientifico;

    usuario: UsuarioModel;
}
