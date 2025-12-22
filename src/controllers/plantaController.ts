import { FormaPreparo } from '@/models/FormaPreparo'
import { IndicacaoUso } from '@/models/IndicacaoUso'
import { Planta } from '@/models/Planta'
import { UsuarioModel } from '@/models/UsuarioModel'
import {
  serviceAtualizarImagem,
  serviceAtualizarPlanta,
  serviceCriarPlanta,
  serviceDeletarPorId,
  serviceListagemPlantas,
  servicerFavoritarPlanta,
  servicerObterPlantaPorID,
} from '@/services/plantaService'

export async function controllerCriarPlanta(
  imagem: File,
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

  planta.imagemBase64 = undefined

  return await serviceCriarPlanta(planta).then((d) => {
    return serviceAtualizarImagem(d, imagem)
  })
}

export async function controllerListagemPlantas(
  filtroRename?: string,
  filtroReniSUS?: string,
  idIndicacaoUso?: Number,
  idMetodoPreparo?: Number,
  idUsuario?: Number,
) {
  return await serviceListagemPlantas(filtroRename, filtroReniSUS, idIndicacaoUso, idMetodoPreparo, idUsuario)
}

export async function controllerObterPlantaPorID(idPlanta: number, idUsuario: number) {
  return await servicerObterPlantaPorID(idPlanta, idUsuario)
}

export async function controllerFavoritarPlanta(idPlanta: number, idUsuario: number) {
  return await servicerFavoritarPlanta(idPlanta, idUsuario)
}

export async function controllerAtualizarImagem(id: number, imagem: File) {
  return await serviceAtualizarImagem(id, imagem)
}

export async function controllerAtualizarPlanta(planta: Planta) {
  planta.imagemBase64 = undefined

  return await serviceAtualizarPlanta(planta)
}

export async function controllerDeletarPorId(id: number) {
  return await serviceDeletarPorId(id)
}
