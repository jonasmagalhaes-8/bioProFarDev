export class UsuarioModel {
  idUsuario: number
  nomeUsuario: string
  emailUsuario: string
  senhaUsuario: string
  dataCadastroUsuario: string
  celularUsuario: string
  cpfUsuario: string
  usuarioAdmin: boolean = false
  bloqueioUsuario: boolean
}
