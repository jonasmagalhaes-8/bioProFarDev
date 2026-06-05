import { TopicoAprendizado } from '@/models/TopicoAprendizado'
import {
  serviceDeletarPorId,
  serviceListagemTopicoAprendizado,
  serviceSalvarTopicoAprendizado,
} from '@/services/topicoAprendizadoService'

export async function controllerSalvarTopicoAprendizado(
  titulo: string,
  descricao: string,
  idTopicoAprendizado?: number
) {
  try {
    const topico = new TopicoAprendizado()
    if (idTopicoAprendizado) {
      topico.idTopicoAprendizado = idTopicoAprendizado
    }
    topico.titulo = titulo
    topico.descricao = descricao

    return await serviceSalvarTopicoAprendizado(topico)
  } catch (error) {
    throw error
  }
}

export async function controllerListagemTopicosAprendizado() {
  try {
    return await serviceListagemTopicoAprendizado()
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
