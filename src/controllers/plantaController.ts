import { FormaPreparo } from '@/models/FormaPreparo'
import { Planta } from '@/models/Planta'
import { UsuarioModel } from '@/models/UsuarioModel'
import {
  serviceAtualizarImagem,
  serviceCriarPlanta,
  serviceDeletarPorId,
  serviceListagemPlantas,
  servicerObterPlantaPorID,
} from '@/services/plantaService'

export async function controllerCriarPlanta(
  planta: Planta & { indicacoes?: number[] },
  referenciasContraIndicacoes: string[],
  referenciasEfeitosAdversos: string[],
  formasPreparo: (FormaPreparo & { referencias?: string[] })[],
  usuario: UsuarioModel,
) {
  planta.referenciaContraIndicacao = referenciasContraIndicacoes.filter((ref) => ref.trim() !== '').join('|')
  planta.referenciaEfeitosAdversos = referenciasEfeitosAdversos.filter((ref) => ref.trim() !== '').join('|')
  planta.formaPreparo = formasPreparo.map((f) => {
    f.referencia = f.referencias?.filter((ref) => ref.trim() !== '').join('|')
    f.referencias = undefined
    return f
  })
  planta.usuario = usuario

  return await serviceCriarPlanta(planta)
}

export async function controllerListagemPlantas(
  filtroRename?: string,
  filtroReniSUS?: string,
  idIndicacaoUso?: Number,
  idMetodoPreparo?: Number,
) {
  return await serviceListagemPlantas(filtroRename, filtroReniSUS, idIndicacaoUso, idMetodoPreparo)
}

export async function controllerObterPlantaPorID(idPlanta: number) {
  return await servicerObterPlantaPorID(idPlanta)
}

export async function controllerAtualizarImagem(id: number, imagem: File) {
  return await serviceAtualizarImagem(id, imagem)
}

export async function controllerDeletarPorId(id: number) {
  return await serviceDeletarPorId(id)
}
