import { Response } from '@/models/Response'
import { UsuarioModel } from '@/models/UsuarioModel'
import { api } from '@/util/api'

export async function serviceSalvarUsuario(usuario: UsuarioModel) {
  try {
    const json = await api.post('/usuario/salvar', {
      ...usuario,
    })

    return json.data.response as UsuarioModel
  } catch (err: any) {
    throw new Error(err.response.data.mensagem)
  }
}

export async function serviceLoginUsuario(usuario: UsuarioModel) {
  try {
    const json = await api.post('/usuario/login', {
      ...usuario,
    })

    return json.data.response as UsuarioModel
  } catch (err: any) {
    console.log('test')
    console.log(err.response.data.mensagem)
    throw new Error(err.response.data.mensagem)
  }
}

export async function serviceRecuperarSenhaUsuario(emailUsuario: string) {
  try {
    await api.post('/usuario/solicitarRecuperacaoSenha', {
      emailUsuario,
    })
  } catch (err: any) {
    throw new Error(err.response.data.mensagem)
  }
}

export async function serviceValidarTokenRecuperacaoSenhaUsuario(tokenRecuperacao: string) {
  try {
    const json = await api.post('/usuario/validarToken', {
      tokenRecuperacaoSenha: tokenRecuperacao,
    })

    return json.data.response.idUsuario as number
  } catch (err: any) {
    throw new Error(err.response.data.mensagem)
  }
}

export async function serviceSalvarNovaSenhaRecuperacaoUsuario(idUsuario: number, novaSenhaUsuario: string) {
  try {
    await api.put('/usuario/atualizarSenha', {
      idUsuario,
      senhaUsuario: novaSenhaUsuario,
    })
  } catch (err: any) {
    throw new Error(err.response.data.mensagem)
  }
}

export async function serviceListarUsuarios(usuariosBloqueados: boolean | null, usuariosAdmin: boolean | null) {
  try {
    const response = await api.get('/usuario/listagem', {
      params: {
        usuariosBloqueados,
        usuariosAdmin,
      },
    })

    const requisicao = new Response(response.data)

    return requisicao.response as UsuarioModel[]
  } catch (err: any) {
    throw new Error(err.response.data.mensagem)
  }
}
