<script lang="ts">
  import Accordion from '@/components/Accordion.svelte'
  import BarraTopo from '@/components/BarraTopo.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import {
    controllerDeletarPorId,
    controllerListagemInformacoesAdicionais,
    controllerSalvarInformacaoAdicional,
  } from '@/controllers/informacaoAdicionalController'
  import { InformacaoAdicional } from '@/models/InformacaoAdicional'
  import { usuarioStore } from '@/store'
  import { onMount } from 'svelte'

  let informacoes: InformacaoAdicional[] = []
  let carregando = false
  let abrirModal = false

  let idInfoEditar: number | null = null
  let tituloInfo = ''
  let textoInfo = ''
  let linkInfo = ''

  onMount(async () => {
    await carregarInformacoes()
  })

  async function carregarInformacoes() {
    try {
      informacoes = await controllerListagemInformacoesAdicionais()
    } catch (e) {
      console.error('Erro ao buscar informações adicionais:', e)
    }
  }

  async function salvarInformacao() {
    if (!tituloInfo.trim()) {
      alert('Informe um título para a informação.')
      return
    }
    carregando = true
    try {
      await controllerSalvarInformacaoAdicional(tituloInfo, textoInfo, linkInfo, idInfoEditar || undefined)
      await carregarInformacoes()
      fecharModal()
    } catch (e) {
      alert('Erro ao salvar informação adicional.')
    }
    carregando = false
  }

  async function excluirInformacao(info: InformacaoAdicional) {
    if (confirm(`Deseja realmente excluir "${info.titulo}"?`)) {
      try {
        const resultado = await controllerDeletarPorId(info.idInformacaoAdicional)
        alert(resultado)
        await carregarInformacoes()
      } catch (e) {
        alert('Erro ao excluir informação.')
      }
    }
  }

  function abrirModalParaEdicao(info: InformacaoAdicional) {
    idInfoEditar = info.idInformacaoAdicional
    tituloInfo = info.titulo
    textoInfo = info.texto
    linkInfo = info.link
    abrirModal = true
  }

  function fecharModal() {
    abrirModal = false
    idInfoEditar = null
    tituloInfo = ''
    textoInfo = ''
    linkInfo = ''
  }

  function cliqueFora(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      fecharModal()
    }
  }
</script>

<BarraTopo titulo="Informações Adicionais">
  <BotaoVoltar destino="/" />
</BarraTopo>

{#if $usuarioStore?.usuarioAdmin}
  <div class="container-btn">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="itemCriar" on:click={() => (abrirModal = true)}>
      <div class="botao">+</div>
      <div class="textoCriar">Criar Informação</div>
      <div class="containerNavegacao"></div>
    </div>
  </div>
{/if}

<div id="container">
  {#each informacoes as item}
    <Accordion
      titulo={item.titulo}
      texto={item.texto}
      link={item.link}
      mostrarAcoes={$usuarioStore?.usuarioAdmin}
      on:editar={() => abrirModalParaEdicao(item)}
      on:excluir={() => excluirInformacao(item)}
    />
  {/each}
</div>

{#if abrirModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-overlay" on:click={cliqueFora}>
    <div class="modal" on:click|stopPropagation>
      <h2>Salvar Informação</h2>

      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label>Título:</label>
      <input type="text" bind:value={tituloInfo} />

      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label>Texto (HTML permitido):</label>
      <textarea bind:value={textoInfo}></textarea>

      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label>Link externo:</label>
      <input type="text" bind:value={linkInfo} />

      <div class="modal-actions">
        <div class="itemBotaoModal btn-confirmar" on:click={salvarInformacao}>
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
  #container {
    flex-basis: 100%;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
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
