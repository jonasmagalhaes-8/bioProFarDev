<script lang="ts">
  import Input from '@/components/Input.svelte'
  import { Eye, EyeOff } from '@lucide/svelte'
  import { goto } from '@roxi/routify'
  import { UsuarioModel } from '@/models/UsuarioModel'
  import {
    controllerLoginUsuario,
    controllerEnviarEmailRecuperarSenhaUsuario,
    controllerValidarTokenRecuperacaoSenhaUsuario,
    controllerSalvarNovaSenhaRecuperacaoUsuario,
  } from '@/controllers/usuarioController'

  let irPara: any
  $: irPara = $goto

  const usuario = new UsuarioModel()
  let mostrarSenha = false
  let error: string

  let modalRecuperacaoSenha = false
  let modalType: 'email' | 'token' | 'senha' = 'email'

  let emailParaRecuperacao = ''
  let tokenRecuperacao = ''
  let idUsuarioRecuperacao: number

  let senhaNovaRecuperacao = ''
  let senhaNovaRecuperacaoConfirmacao = ''

  const onEnviarEmailRecuperacao = async () => {
    try {
      await controllerEnviarEmailRecuperarSenhaUsuario(emailParaRecuperacao)
      modalType = 'token'
    } catch (error) {
      alert('Erro ao enviar email de recuperação.')
    }

    modalType = 'token'
  }

  const onValidarTokenRecuperacao = async () => {
    try {
      idUsuarioRecuperacao = await controllerValidarTokenRecuperacaoSenhaUsuario(tokenRecuperacao)
      modalType = 'senha'
    } catch (error) {
      alert('Token inválido.')
    }

    modalType = 'senha'
  }

  const onSalvarNovaSenhaRecuperacao = async () => {
    try {
      await controllerSalvarNovaSenhaRecuperacaoUsuario(
        idUsuarioRecuperacao,
        senhaNovaRecuperacao,
        senhaNovaRecuperacaoConfirmacao,
      )
      alert('Senha alterada com sucesso.')
      modalRecuperacaoSenha = false
      modalType = 'email'
    } catch (error) {
      alert('Erro ao salvar nova senha.')
    }
  }

  const onEntrar = async (e: Event) => {
    e.preventDefault()
    try {
      const response = await controllerLoginUsuario(usuario)
      localStorage.setItem('usuario', JSON.stringify(response))
      irPara('/')
    } catch (err) {
      if (err instanceof Error) {
        error = err.message
      }
    }
  }
</script>

<div class="center">
  <img src="/assets/splash.png" alt="BioProFar" class="logo" />

  <form class="container" on:submit={onEntrar}>
    {#if error}
      <p class="error">{error}</p>
    {/if}

    <label for="emailUsuario">Email:</label>
    <Input keyboardType="email-address" bind:value={usuario.emailUsuario} />

    <label for="senhaUsuario">Senha:</label>
    <div class="passwordInput">
      <Input keyboardType={mostrarSenha ? 'default' : 'password'} bind:value={usuario.senhaUsuario} />
      <div class="passwordButton" on:click={() => (mostrarSenha = !mostrarSenha)}>
        {#if mostrarSenha}
          <Eye />
        {:else}
          <EyeOff />
        {/if}
      </div>
    </div>

    <button class="submitButton" type="submit">Entrar</button>
  </form>

  <a href="/register">Criar uma conta?</a>
  <a on:click={() => (modalRecuperacaoSenha = true)}>Esqueci minha senha</a>

  {#if modalRecuperacaoSenha}
    <div class="modal">
      <div class="modalContent">
        <h3>Recuperação de Senha</h3>
        {#if modalType == 'email'}
          <label for="emailRecuperacao">Digite seu email:</label>
          <Input keyboardType="email-address" bind:value={emailParaRecuperacao} />
          <button class="modal-button" on:click={onEnviarEmailRecuperacao}>Enviar Email</button>
        {:else if modalType == 'token'}
          <label for="tokenRecuperacao">Digite o token recebido:</label>
          <Input bind:value={tokenRecuperacao} />
          <button class="modal-button" on:click={onValidarTokenRecuperacao}>Validar Token</button>
        {:else}
          <label for="novaSenhaRecuperacao">Digite sua nova senha:</label>
          <Input keyboardType="password" bind:value={senhaNovaRecuperacao} />

          <label for="novaSenhaRecuperacao">Confirme sua nova senha:</label>
          <Input keyboardType="password" bind:value={senhaNovaRecuperacaoConfirmacao} />
          <button class="modal-button" on:click={onSalvarNovaSenhaRecuperacao}>Salvar Nova Senha</button>
        {/if}
        <button on:click={() => (modalRecuperacaoSenha = false)}>Fechar</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .center {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h2 {
    font-weight: bold;
  }

  .error {
    background-color: red;
    color: white;
    width: 100%;
    text-align: center;
    padding: 10px;
  }

  .container {
    display: flex;
    flex-direction: column;
    width: 80%;
    max-width: 400px;
  }

  .passwordInput {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  .passwordButton {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .submitButton {
    margin-top: 20px;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modalContent {
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 95%;
    max-width: 420px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
  }

  .modalContent h3 {
    margin-bottom: 20px;
  }

  .modal-button {
    margin-top: 20px;
  }
</style>
