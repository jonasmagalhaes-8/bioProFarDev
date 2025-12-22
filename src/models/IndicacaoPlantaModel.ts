import { IndicacaoUso } from './IndicacaoUso'
import { MetodoPreparo } from './MetodoPreparo'
import { Planta } from './Planta'
import { UsuarioModel } from './UsuarioModel'

export class IndicacaoPlantaModel {
  idIndicacaoPlanta?: number
  planta: Planta
  usuario: UsuarioModel
  dataEdicao: string
  indicacaoUso: IndicacaoUso

  constructor(obj: Partial<IndicacaoPlantaModel> = {}) {
    Object.assign(this, obj)
  }
}
