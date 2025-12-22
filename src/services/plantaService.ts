import { Planta } from '@/models/Planta'
import { Response } from '@/models/Response'
import { api } from '@/util/api'

export async function serviceCriarPlanta(planta: Planta) {
  try {
    const json = await api.post('/planta/criarPlanta', planta)

    const requisicao = new Response(json.data)

    console.log(requisicao.response)

    return requisicao.response as number
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function serviceListagemPlantas(
  filtroRename?: string,
  filtroReniSUS?: string,
  idIndicacaoUso?: Number,
  idMetodoPreparo?: Number,
  idUsuario?: Number
) {
  try {

    const json = await api.get('/planta/listagem', {
      params: { filtroRename, filtroReniSUS, idIndicacaoUso, idMetodoPreparo, idUsuario },
    })

    const requisicao = new Response(json.data)

    return requisicao.response as Planta[]
  } catch (err: any) {
    throw new Error(err.message)
  }
}

export async function servicerFavoritarPlanta(idPlanta: number, idUsuario: number) {
  try {
    const json = await api.post(
      '/planta/plantaFavorita',
      null, // body vazio
      {
        params: {
          idPlanta,
          idUsuario,
        },
      },
    )

    const requisicao = new Response(json.data)
    return requisicao.mensagem
  } catch (err: any) {
    throw new Error(err.message)
  }
}


export async function servicerObterPlantaPorID(idPlanta: number, idUsuario: number) {
  try {
    const json = await api.get('/planta/obterPorId', {
      params: { id: idPlanta, usuarioId: idUsuario },
    })

    const requisicao = new Response(json.data)

    return requisicao.response as Planta
  } catch (err: any) {
    throw new Error(err.message)
  }
}

export async function serviceAtualizarImagem(id: number, imagem: File) {
  try {
    const formData = new FormData()
    formData.append('idPlanta', id.toString())
    formData.append('imagemPlanta', imagem)

    const json = await api.post('/planta', formData)

    const requisicao = new Response(json.data)

    return requisicao.response as string
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function serviceAtualizarPlanta(planta: Planta) {
  try {
    const json = await api.put('/planta/editarPlanta', planta)

    const requisicao = new Response(json.data)

    return requisicao.response as number
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function serviceDeletarPorId(id: number) {
  try {
    const json = await api.delete('/planta/deletarPorId', {
      params: { id: id },
    })

    const requisicao = new Response(json.data)

    return requisicao.response as Planta
  } catch (error) {
    throw new Error(error.message)
  }
}
