import { InformacaoAdicional } from '@/models/InformacaoAdicional'
import { Response } from '@/models/Response'
import { api } from '@/util/api'

export async function serviceSalvarInformacaoAdicional(informacaoAdicional: InformacaoAdicional) {
  try {
    const json = await api.post('/informacaoadicional', informacaoAdicional)
    const requisicao = new Response(json.data)
    return requisicao.response as InformacaoAdicional
  } catch (err: any) {
    throw new Error(err.message)
  }
}

export async function serviceListagemInformacaoAdicional() {
  try {
    const json = await api.get('/informacaoadicional/listagem')
    const requisicao = new Response(json.data)
    return requisicao.response as InformacaoAdicional[]
  } catch (err: any) {
    throw new Error(err.message)
  }
}

export async function serviceDeletarPorId(id: number) {
  try {
    const json = await api.delete('/informacaoadicional/deletarPorId', {
      params: { id },
    })
    const requisicao = new Response(json.data)
    return requisicao.mensagem
  } catch (err: any) {
    throw new Error(err.message)
  }
}
