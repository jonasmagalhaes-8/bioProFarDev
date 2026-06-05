<script lang="ts">
  import BarraTopo from '@/components/BarraTopo.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import {
    controllerDeletarPorId,
    controllerListagemTopicosAprendizado,
    controllerSalvarTopicoAprendizado,
  } from '@/controllers/topicoAprendizadoController'
  import { TopicoAprendizado } from '@/models/TopicoAprendizado'
  import { usuarioStore } from '@/store'
  import { onMount } from 'svelte'

  let topicos: TopicoAprendizado[] = []
  let carregando = false
  let abrirModal = false

  let idTopicoEditar: number | null = null
  let tituloTopico = ''
  let descricaoTopico = ''

  onMount(async () => {
    await carregarTopicos()
  })

  async function carregarTopicos() {
    try {
      topicos = await controllerListagemTopicosAprendizado()
    } catch (e) {
      console.error('Erro ao buscar tópicos de aprendizado:', e)
    }
  }

  async function salvarTopico() {
    if (!tituloTopico.trim()) {
      alert('Informe um título para o tópico.')
      return
    }
    carregando = true
    try {
      await controllerSalvarTopicoAprendizado(tituloTopico, descricaoTopico, idTopicoEditar || undefined)
      await carregarTopicos()
      fecharModal()
    } catch (e) {
      alert('Erro ao salvar tópico de aprendizado.')
    }
    carregando = false
  }

  async function excluirTopico(topico: TopicoAprendizado) {
    if (confirm(`Deseja realmente excluir "${topico.titulo}"?`)) {
      try {
        const resultado = await controllerDeletarPorId(topico.idTopicoAprendizado)
        alert(resultado)
        await carregarTopicos()
      } catch (e) {
        alert('Erro ao excluir tópico.')
      }
    }
  }

  function abrirModalParaEdicao(topico: TopicoAprendizado) {
    idTopicoEditar = topico.idTopicoAprendizado
    tituloTopico = topico.titulo
    descricaoTopico = topico.descricao
    abrirModal = true
  }

  function fecharModal() {
    abrirModal = false
    idTopicoEditar = null
    tituloTopico = ''
    descricaoTopico = ''
  }

  function cliqueFora(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      fecharModal()
    }
  }
</script>

<BarraTopo titulo={'Aprenda a usar o aplicativo'}>
  <BotaoVoltar destino={'/'} />
</BarraTopo>

{#if $usuarioStore?.usuarioAdmin}
  <div class="container-btn">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="itemCriar" on:click={() => (abrirModal = true)}>
      <div class="botao">+</div>
      <div class="textoCriar">Criar Tópico</div>
      <div class="containerNavegacao"></div>
    </div>
  </div>
{/if}

<div>
  <div id="container">
    {#each topicos as topico}
      <div class="fonteTituloTopico">{topico.titulo}</div>
      <div class="fonteDescricaoTopico">{topico.descricao}</div>
      {#if $usuarioStore?.usuarioAdmin}
        <div class="acoesTopico">
          <button class="btn-editar" on:click={() => abrirModalParaEdicao(topico)}>Editar</button>
          <button class="btn-excluir" on:click={() => excluirTopico(topico)}>Excluir</button>
        </div>
      {/if}
    {/each}
  </div>
</div>

{#if abrirModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-overlay" on:click={cliqueFora}>
    <div class="modal" on:click|stopPropagation>
      <h2>Salvar Tópico</h2>

      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label>Título:</label>
      <input type="text" bind:value={tituloTopico} />

      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label>Descrição:</label>
      <textarea bind:value={descricaoTopico}></textarea>

      <div class="modal-actions">
        <div class="itemBotaoModal btn-confirmar" on:click={salvarTopico}>
          <div class="textoCriar">{carregando ? 'Salvando...' : 'Salvar'}</div>
          <div class="containerNavegacao"></div>
        </div>

        <div class="itemBotaoModal btn-cancelar" on:click={fecharModal}>
          <div class="textoCriar">Cancelar</div>
          <div class="containerNavegacao"></div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  * {
    box-sizing: border-box;
  }

  .fonteDescricaoTopico {
    font-size: 2.15vh;
    color: #3f4a2c;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 400;
    line-height: 1.6;
    margin-bottom: 8px;
  }

  #container {
    flex-basis: 100%;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 10px;
    padding-top: 0px;
    padding-right: 0px;
    padding-bottom: 20px;
    padding-left: 0px;
  }

  .fonteTituloTopico {
    font-size: 2.54vh;
    color: #354128;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 700;
  }

  .fonteTituloTopico::after {
    content: '';
    display: block;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, #7a8863, #a1b07d);
    border-radius: 2px;
    margin-top: 4px;
    margin-bottom: 8px;
  }

  .acoesTopico {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 24px;
  }

  .acoesTopico button {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    font-size: 1.7vh;
    cursor: pointer;
    font-weight: 600;
    color: white;
  }

  .btn-editar {
    background-color: #6b7280;
  }

  .btn-excluir {
    background-color: #ef4444;
  }

  .btn-editar:active, .btn-excluir:active {
    opacity: 0.8;
  }

  .container-btn {
    display: flex;
    justify-content: center;
    margin: 10px 20px;
  }

  .itemCriar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    padding: 0 20px;
    background: linear-gradient(120deg, #7a8863, #a1b07d);
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    color: #fff;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: slideIn 0.5s ease-out backwards;
  }

  .itemCriar:hover {
    transform: translateX(8px) translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    background: linear-gradient(120deg, #8a9873, #b1c08d);
  }

  .textoCriar {
    font-size: 2.2vh;
    color: #fff;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 500;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  }

  .containerNavegacao {
    display: flex;
    align-items: center;
  }

  .botao {
    color: rgba(255, 255, 255, 1);
    font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
    font-size: 3.5vh;
    font-weight: 700;
    transition: transform 0.3s;
  }

  .itemCriar:hover .botao {
    transform: translateX(5px);
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 95%;
    max-width: 420px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.25);
  }

  .modal input[type='text'],
  .modal textarea {
    width: 100%;
    margin-top: 6px;
    margin-bottom: 14px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  .modal textarea {
    resize: vertical;
    min-height: 80px;
  }

  .modal h2 {
    font-size: 24px;
    margin-bottom: 15px;
  }

  .modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
  }

  .itemBotaoModal {
    width: 48%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    padding: 0 12px;
    background: linear-gradient(120deg, #7a8863, #a1b07d);
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    color: #fff;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .itemBotaoModal:hover {
    transform: translateX(5px) translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
    background: linear-gradient(120deg, #8a9873, #b1c08d);
  }

  .btn-cancelar {
    background: linear-gradient(120deg, #888, #aaa);
  }
  .btn-cancelar:hover {
    background: linear-gradient(120deg, #999, #bbb);
  }
</style>
