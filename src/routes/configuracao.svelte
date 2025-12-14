<script lang="ts">
  import BarraTopo from '@/components/BarraTopo.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import Input from '@/components/Input.svelte'
  import { controllerSalvarNovaSenhaRecuperacaoUsuario } from '@/controllers/usuarioController'
  import { usuarioStore } from '@/store'
  import { LucideUser } from '@lucide/svelte'
  import { goto } from '@roxi/routify'

  let irPara: any
  $: irPara = $goto

  const usuario = $usuarioStore

  let modalTrocarSenha = false
  let senha = ''
  let senhaConfirmar = ''

  async function onMudarSenha() {
    try {
      const response = await controllerSalvarNovaSenhaRecuperacaoUsuario($usuarioStore.idUsuario, senha, senhaConfirmar)
      irPara('/')
    } catch (error) {
      alert(error.message)
    }
  }

  function onSair() {
    modalTrocarSenha = false
    senha = ''
    senhaConfirmar = ''
  }
</script>

<BarraTopo>
  <BotaoVoltar destino={'/'} />
</BarraTopo>

<div id="main">
  <div>
    <LucideUser color="white" />
  </div>
  <span style="display: flex; flex-direction: column;">
    <span>Nome: {usuario.nomeUsuario}</span>
    <span>Email: {usuario.emailUsuario}</span>
  </span>
  <button on:click={() => (modalTrocarSenha = true)}>Mudar senha</button>
</div>

{#if modalTrocarSenha}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal" on:click={onSair}>
    <div class="modal-content" on:click|stopPropagation>
      <h2>Mudar senha</h2>

      <label for="senha">Senha:</label>
      <Input keyboardType="default" secureTextEntry bind:value={senha} />

      <label for="senha">Confirmar senha:</label>
      <Input keyboardType="default" secureTextEntry bind:value={senhaConfirmar} />

      <div class="botoesContainer">
        <button on:click={onSair}>Fechar</button>
        <button on:click={onMudarSenha}>Confirmar</button>
      </div>
    </div>
  </div>
{/if}

<style>
  #main {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
  }

  #main div {
    display: flex;
    background: linear-gradient(120deg, #7a8863, #a1b07d);
    padding: 20px;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
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

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 95%;
    max-width: 500px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.25);
    position: relative;
    max-height: 95%;
    overflow: scroll;
  }

  .modal-content h2 {
    text-align: center;
  }

  .botoesContainer {
    display: flex;
    justify-content: end;
    margin-top: 10px;
    gap: 10px;
  }
</style>
