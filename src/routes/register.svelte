<script lang="ts">
  import Input from '@/components/Input.svelte'
  import { controllerSalvarUsuario } from '@/controllers/usuarioController'
  import { UsuarioModel } from '@/models/UsuarioModel'
  import { usuarioStore } from '@/store'
  import { Eye, EyeOff } from '@lucide/svelte'
  import { goto } from '@roxi/routify'

  let mostrarSenha = false
  let irPara: any
  $: irPara = $goto

  const usuario = new UsuarioModel()
  let error: string

  const onRegistrar = async (e: Event) => {
    e.preventDefault()
    try {
      const response = await controllerSalvarUsuario(usuario)
      localStorage.setItem('usuario', JSON.stringify(response))
      usuarioStore.set(response)
      irPara('/')
    } catch (err: any) {
      error = err.message
    }
  }
</script>

<div class="center">
  <h2>Criar conta</h2>

  <form class="container" on:submit={onRegistrar}>
    {#if error}
      <p class="error">{error}</p>
    {/if}

    <label for="nomeUsuario">Nome:</label>
    <Input keyboardType="default" bind:value={usuario.nomeUsuario} />

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

    <label for="celular">Celular:</label>
    <Input keyboardType="phone-pad" mask={['(00) 0000-0000', '(00) 00000-0000']} bind:value={usuario.celularUsuario} />

    <label for="cpf">CPF:</label>
    <Input keyboardType="phone-pad" mask="000.000.000-00" bind:value={usuario.cpfUsuario} />

    <button class="submitButton" type="submit">Registrar</button>
  </form>

  <a href="/login">Já tem uma conta?</a>
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
</style>
