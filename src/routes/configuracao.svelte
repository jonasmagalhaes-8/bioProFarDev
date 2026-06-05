<script lang="ts">
  import BarraTopo from '@/components/BarraTopo.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import Input from '@/components/Input.svelte'
  import {
    controllerSalvarNovaSenhaRecuperacaoUsuario,
    controllerAtualizarUsuario,
  } from '@/controllers/usuarioController'
  import { usuarioStore } from '@/store'
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { onMount } from 'svelte'
  import { UsuarioModel } from '@/models/UsuarioModel'

  let irPara: any
  $: irPara = $goto

  let senha = ''
  let senhaConfirmar = ''
  let modalTrocarSenha = false

  // cópia editável
  let usuarioEditavel = { ...get(usuarioStore) }

  // mantém sincronizado se o store mudar
  $: if ($usuarioStore) {
    usuarioEditavel = { ...$usuarioStore }
  }

  onMount(() => {
    const dadosSalvos = localStorage.getItem('usuario')
    const usuarioLogado = get(usuarioStore)

    if (!usuarioLogado?.idUsuario && !dadosSalvos) {
      const desejaIdentificar = confirm(
        'Você não está logado, deseja ser redirecionado para fazer login ou cadastrar-se?',
      )

      if (desejaIdentificar) {
        irPara('/login')
      } else {
        irPara('/')
      }
    }
  })

  async function onSalvarAlteracoes() {
    try {
      const usuarioAtualizado = await controllerAtualizarUsuario(usuarioEditavel)
      usuarioStore.update(() => usuarioAtualizado)
      localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado))
      alert('Dados atualizados com sucesso.')
    } catch (error) {
      alert('Erro ao salvar alterações.')
    }
  }

  async function onMudarSenha() {
    try {
      await controllerSalvarNovaSenhaRecuperacaoUsuario($usuarioStore.idUsuario, senha, senhaConfirmar)
      alert('Senha alterada com sucesso!')
      onSairSenha()
    } catch (error: any) {
      alert(error.message)
    }
  }

  function onLogout() {
    usuarioStore.set(new UsuarioModel())
    localStorage.removeItem('usuario')
    irPara('/')
  }

  function onSairSenha() {
    modalTrocarSenha = false
    senha = ''
    senhaConfirmar = ''
  }
</script>

<BarraTopo titulo="Seu Perfil">
  <BotaoVoltar destino={'/'} />
</BarraTopo>

<div id="main">
  <div class="dadosUsuario">
    <label>Nome:</label>
    <Input bind:value={usuarioEditavel.nomeUsuario} />

    <label>Email:</label>
    <Input keyboardType="email-address" bind:value={usuarioEditavel.emailUsuario} />
  </div>

  <div class="acoes">
    <button on:click={onSalvarAlteracoes}> Salvar </button>

    <button on:click={() => (modalTrocarSenha = true)}> Mudar senha </button>

    <button on:click={onLogout}> Sair da Conta </button>
  </div>
</div>

{#if modalTrocarSenha}
  <div class="modal" on:click={onSairSenha}>
    <div class="modal-content" on:click|stopPropagation>
      <h2>Mudar senha</h2>

      <label>Senha:</label>
      <Input keyboardType="password" bind:value={senha} />

      <label>Confirmar senha:</label>
      <Input keyboardType="password" bind:value={senhaConfirmar} />

      <div class="botoesContainer">
        <button on:click={onSairSenha}>Fechar</button>
        <button on:click={onMudarSenha}>Confirmar</button>
      </div>
    </div>
  </div>
{/if}

<style>
  #main {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .dadosUsuario {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 300px;
  }

  .acoes {
    display: flex;
    flex-direction: column;
    gap: 15px; /* Aumentei um pouco o gap para respirar como na imagem */
    width: 100%;
    max-width: 300px;
  }

  /* Estilo dos botões para bater com a imagem enviada */
  .acoes button {
    width: 100%;
    padding: 14px;
    cursor: pointer;

    /* Alinhamento Central */
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    /* Estética da Imagem */
    background-color: #9fb284; /* Verde aproximado da foto */
    color: white;
    border: none;
    border-radius: 50px; /* Deixa bem arredondado nas pontas */
    font-weight: bold;
    text-transform: uppercase; /* SALVAR, MUDAR SENHA... */
    letter-spacing: 1px;
  }

  .modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 95%;
    max-width: 500px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.25);
    max-height: 95%;
    overflow: auto;
  }

  .modal-content h2 {
    text-align: center;
  }

  .botoesContainer {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
    gap: 10px;
  }

  .botoesContainer button {
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
</style>
