import { MetodoPreparo } from '@/models/MetodoPreparo'
import { Response } from '@/models/Response'
import { usuarioStore } from '@/store'
import { api } from '@/util/api'
import { get } from 'svelte/store'

export async function serviceCriarModoPreparo(modoPreparo: MetodoPreparo) {
  try {
    const usuario = get(usuarioStore)

    const json = await api.post('/metodopreparo', {
      ...modoPreparo,
      usuario: usuario,
    })

    const requisicao = new Response(json.data)

    return requisicao.response as MetodoPreparo
  } catch (err: any) {
    throw new Error(err.message)
  }
}

export async function serviceListagemModosPreparo() {
  try {
    const json = await api.get('/metodopreparo/listagem')

    const requisicao = new Response(json.data)

    return requisicao.response as MetodoPreparo[]
  } catch (err: any) {
    throw new Error(err.message)
  }
}

export async function servicerObterDeletarPorId(idModoPreparo: number) {
  try {
    const json = await api.delete('/metodopreparo/deletarPorId', {
      params: { id: idModoPreparo },
    })

    const requisicao = new Response(json.data)

    return requisicao.mensagem
  } catch (err: any) {
    throw new Error(err.message)
  }
}

export async function servicerObterModoPreparoPorID(idModoPreparo: number) {
  try {
    const json = await api.get('/metodopreparo/obterPorId', {
      params: { id: idModoPreparo },
    })

    const requisicao = new Response(json.data)

    return requisicao.response as MetodoPreparo
  } catch (err: any) {
    throw new Error(err.message)
  }
}
