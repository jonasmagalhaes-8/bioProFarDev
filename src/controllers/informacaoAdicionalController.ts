import { InformacaoAdicional } from '@/models/InformacaoAdicional'
import {
  serviceDeletarPorId,
  serviceListagemInformacaoAdicional,
  serviceSalvarInformacaoAdicional,
} from '@/services/informacaoAdicionalService'

export async function controllerSalvarInformacaoAdicional(
  titulo: string,
  texto: string,
  link: string,
  idInformacaoAdicional?: number
) {
  try {
    const info = new InformacaoAdicional()
    if (idInformacaoAdicional) {
      info.idInformacaoAdicional = idInformacaoAdicional
    }
    info.titulo = titulo
    info.texto = texto
    info.link = link

    return await serviceSalvarInformacaoAdicional(info)
  } catch (error) {
    throw error
  }
}

export async function controllerListagemInformacoesAdicionais() {
  try {
    return await serviceListagemInformacaoAdicional()
  } catch (error) {
    throw error
  }
}

export async function controllerDeletarPorId(id: number) {
  try {
    return await serviceDeletarPorId(id)
  } catch (error) {
    throw error
  }
}
