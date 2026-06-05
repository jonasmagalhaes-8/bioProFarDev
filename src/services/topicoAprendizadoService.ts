import { Response } from '@/models/Response'
import { TopicoAprendizado } from '@/models/TopicoAprendizado'
import { api } from '@/util/api'

export async function serviceSalvarTopicoAprendizado(topicoAprendizado: TopicoAprendizado) {
  try {
    const json = await api.post('/topicoaprendizado', topicoAprendizado)
    const requisicao = new Response(json.data)
    return requisicao.response as TopicoAprendizado
  } catch (err: any) {
    throw new Error(err.message)
  }
}

export async function serviceListagemTopicoAprendizado() {
  try {
    const json = await api.get('/topicoaprendizado/listagem')
    const requisicao = new Response(json.data)
    return requisicao.response as TopicoAprendizado[]
  } catch (err: any) {
    throw new Error(err.message)
  }
}

export async function serviceDeletarPorId(id: number) {
  try {
    const json = await api.delete('/topicoaprendizado/deletarPorId', {
      params: { id },
    })
    const requisicao = new Response(json.data)
    return requisicao.mensagem
  } catch (err: any) {
    throw new Error(err.message)
  }
}
