import { MetodoPreparo } from '@/models/MetodoPreparo'
import ModoPreparo from '@/routes/modo-preparo.svelte'
import {
  serviceCriarModoPreparo,
  serviceListagemModosPreparo,
  servicerObterDeletarPorId,
  servicerObterModoPreparoPorID,
} from '@/services/modoPreparoService'

export async function controllerCriarModoPreparo(modoPreparo: MetodoPreparo) {
  return await serviceCriarModoPreparo(modoPreparo)
}

export async function controllerListagemModosPreparo() {
  return await serviceListagemModosPreparo()
}

export async function controllerObterModoPreparoPorID(idModoPreparo: number) {
  return await servicerObterModoPreparoPorID(idModoPreparo)
}

export async function controllerDeletarPorId(idModoPreparo: number) {
  return await servicerObterDeletarPorId(idModoPreparo)
}
