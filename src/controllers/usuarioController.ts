import { UsuarioModel } from '@/models/UsuarioModel'
import {
  serviceListarUsuarios,
  serviceLoginUsuario,
  serviceRecuperarSenhaUsuario,
  serviceSalvarNovaSenhaRecuperacaoUsuario,
  serviceSalvarUsuario,
  serviceValidarTokenRecuperacaoSenhaUsuario,
} from '@/services/usuarioService'
import * as CPF from 'gerador-validador-cpf'

export async function controllerSalvarUsuario(usuario: UsuarioModel) {
  if (!usuario.nomeUsuario) {
    throw new Error('Nome de usuário é obrigatório')
  }

  if (
    !usuario.emailUsuario ||
    !usuario.emailUsuario.match(
      /(?:[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+(?:\.[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9\x2d]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
    )
  ) {
    throw new Error('Email de usuário é obrigatório e deve ser válido')
  }

  if (!usuario.senhaUsuario || usuario.senhaUsuario.length < 6) {
    throw new Error('Senha de usuário é obrigatória e deve ter pelo menos 6 caracteres')
  }

  if (!usuario.celularUsuario || usuario.celularUsuario.length < 13) {
    throw new Error('Celular de usuário é obrigatório e deve ter pelo menos 13 caracteres')
  }

  if (!usuario.cpfUsuario || usuario.cpfUsuario.length < 14 || !CPF.validate(usuario.cpfUsuario)) {
    throw new Error('CPF de usuário é obrigatório, deve ter pelo menos 14 caracteres e ser válido')
  }

  usuario.usuarioAdmin = false

  return serviceSalvarUsuario(usuario)
}

export async function controllerLoginUsuario(usuario: UsuarioModel) {
  try {
    if (
      !usuario.emailUsuario ||
      !usuario.emailUsuario.match(
        /(?:[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+(?:\.[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9\x2d]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
      )
    ) {
      throw new Error('Email de usuário é obrigatório e deve ser válido')
    }

    if (!usuario.senhaUsuario || usuario.senhaUsuario.length < 6) {
      throw new Error('Senha de usuário é obrigatória e deve ter pelo menos 6 caracteres')
    }

    return serviceLoginUsuario(usuario)
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function controllerEnviarEmailRecuperarSenhaUsuario(emailUsuario: string) {
  if (
    !emailUsuario ||
    !emailUsuario.match(
      /(?:[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+(?:\.[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9\x2d]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
    )
  ) {
    throw new Error('Email é obrigatório e deve ser válido')
  }

  return serviceRecuperarSenhaUsuario(emailUsuario)
}

export async function controllerValidarTokenRecuperacaoSenhaUsuario(tokenRecuperacao: string) {
  if (!tokenRecuperacao || tokenRecuperacao.length < 6) {
    throw new Error('Token de recuperação é obrigatório e deve ter pelo menos 6 caracteres')
  }

  return serviceValidarTokenRecuperacaoSenhaUsuario(tokenRecuperacao)
}

export async function controllerSalvarNovaSenhaRecuperacaoUsuario(
  idUsuario: number,
  novaSenhaUsuario: string,
  confirmacaoNovaSenhaUsuario: string,
) {
  if (!idUsuario) {
    throw new Error('ID do usuário é obrigatório')
  }

  if (!novaSenhaUsuario || novaSenhaUsuario.length < 6) {
    throw new Error('Nova senha é obrigatória e deve ter pelo menos 6 caracteres')
  }

  if (novaSenhaUsuario !== confirmacaoNovaSenhaUsuario) {
    throw new Error('Confirmação da nova senha não confere')
  }

  return serviceSalvarNovaSenhaRecuperacaoUsuario(idUsuario, novaSenhaUsuario)
}

export async function controllerListarUsuarios(usuariosBloqueados: boolean | null, usuariosAdmin: boolean | null) {
  return await serviceListarUsuarios(usuariosBloqueados, usuariosAdmin)
}

export async function controllerAtualizarUsuario(usuario: UsuarioModel) {
  return serviceSalvarUsuario(usuario)
}
