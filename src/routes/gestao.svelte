<script lang="ts">
  import BarraTopo from '@/components/BarraTopo.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import { controllerAtualizarUsuario, controllerListarUsuarios } from '@/controllers/usuarioController'
  import { UsuarioModel } from '@/models/UsuarioModel'
  import { usuarioStore } from '@/store'
  import { goto } from '@roxi/routify'
  import { onMount } from 'svelte'

  let irPara: any
  $: irPara = $goto

  let usuarios: UsuarioModel[] = []
  let usuariosBloqueados: boolean | null = null
  let usuariosAdmin: boolean | null = null

  async function loadUsers() {
    try {
      usuarios = await controllerListarUsuarios(usuariosBloqueados, usuariosAdmin)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }

  onMount(() => {
    if (!$usuarioStore.usuarioAdmin) {
      irPara('/')
      return
    }
    loadUsers()
  })

  export async function tornarAdmin(usuario: UsuarioModel) {
    try {
      await controllerAtualizarUsuario({ ...usuario, usuarioAdmin: true })
      loadUsers()
    } catch (error) {
      alert('Erro ao tornar usuário admin.')
    }
  }

  export async function tirarAdmin(usuario: UsuarioModel) {
    try {
      await controllerAtualizarUsuario({ ...usuario, usuarioAdmin: false })
      loadUsers()
    } catch (error) {
      alert('Erro ao tirar usuário admin.')
    }
  }

  export async function bloquearUsuario(usuario: UsuarioModel) {
    try {
      await controllerAtualizarUsuario({ ...usuario, bloqueioUsuario: true })
      loadUsers()
    } catch (error) {
      alert('Erro ao bloquear usuário.')
    }
  }

  export async function desbloquearUsuario(usuario: UsuarioModel) {
    try {
      await controllerAtualizarUsuario({ ...usuario, bloqueioUsuario: false })
      loadUsers()
    } catch (error) {
      alert('Erro ao desbloquear usuário.')
    }
  }
</script>

<BarraTopo titulo="Gestão de Usuários">
  <BotaoVoltar destino="/" />
</BarraTopo>

<main>
  <div class="selects">
    <select name="todos" bind:value={usuariosAdmin} on:change={loadUsers}>
      <option value={null}>Todos Perfis</option>
      <option value={true}>Apenas Admins</option>
      <option value={false}>Não Admins</option>
    </select>

    <select name="bloqueados" bind:value={usuariosBloqueados} on:change={loadUsers}>
      <option value={null}>Todos status</option>
      <option value={true}>Bloqueados</option>
      <option value={false}>Ativos</option>
    </select>
  </div>

  <div class="usuariosContainer">
    {#each usuarios as usuario}
      <div class="usuario">
        <div class="info">
          <p><strong>Nome:</strong> {usuario.nomeUsuario}</p>
          <p><strong>Email:</strong> {usuario.emailUsuario}</p>
          <p><strong>Cargo:</strong> {usuario.usuarioAdmin ? 'Administrador' : 'Usuário'}</p>
        </div>

        <div class="acoes">
          {#if usuario.usuarioAdmin}
            <button class="btn-secondary" on:click={() => tirarAdmin(usuario)}> Remover Perfil Admin </button>
          {:else}
            <button class="btn-primary" on:click={() => tornarAdmin(usuario)}> Tornar Admin </button>
          {/if}

          {#if usuario.bloqueioUsuario}
            <button class="btn-success" on:click={() => desbloquearUsuario(usuario)}> Desbloquear Usuário </button>
          {:else}
            <button class="btn-danger" on:click={() => bloquearUsuario(usuario)}> Bloquear Usuário </button>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</main>

<style>
  main h2 {
    text-align: center;
    margin-top: 20px;
    color: #2e3b1f;
  }

  p {
    margin: 2px 0;
    font-size: 14px;
  }

  .selects {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px;
  }

  select {
    padding: 8px;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: white;
    flex: 1;
    max-width: 200px;
  }

  .usuariosContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-bottom: 50px;
  }

  .usuario {
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 500px;
    background-color: #ffffffdd;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    gap: 15px;
  }

  .info {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }

  .acoes {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  /* Ajuste para centralização total do texto */
  button {
    width: 100%;
    min-height: 44px; /* Altura mínima para toque */
    padding: 10px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition:
      opacity 0.2s,
      background-color 0.2s;

    /* Centralização Flexbox */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  button:active {
    opacity: 0.7;
    transform: scale(0.98); /* Leve feedback de clique */
  }

  .btn-primary {
    background-color: #7a8863;
    color: white;
  }
  .btn-secondary {
    background-color: #6b7280;
    color: white;
  }
  .btn-danger {
    background-color: #ef4444;
    color: white;
  }
  .btn-success {
    background-color: #22c55e;
    color: white;
  }
</style>
