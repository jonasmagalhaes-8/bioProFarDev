<script lang="ts">
  import BarraDePesquisa from '@/components/BarraDePesquisa.svelte'
  import BarraTopo from '@/components/BarraTopo.svelte'
  import BotaoVoltarHome from '@/components/BotaoVoltar.svelte'
  import MenuIndicacoes from '@/components/IndicacoesItem.svelte'
  import {
    controllerDeletarPorId,
    controllerListagemIndicacoesUso,
    controllerSalvarIndicacoesUso,
  } from '@/controllers/indicacoesUsoController'
  import { IndicacaoUso } from '@/models/IndicacaoUso'
  import { usuarioStore } from '@/store'
  import { getPrefix } from '@/util/obterPrefixoTipoImagem'
  import { onMount } from 'svelte'

  let indicacoesUso: IndicacaoUso[] = []
  let descricaoBuscaIndicacoes = 'Carregando Indicações...'
  let termoPesquisa = ''
  let idIndicacaoEditar: number | null = null
  let abrirModal = false
  let nomeIndicacao = ''
  let imagem: File | null = null
  let previewUrl: string | null = null
  let carregando = false

  $: indicacoesUsoFiltradas = indicacoesUso.filter((indicacao) => {
    if (!termoPesquisa) return true
    return indicacao.nomeIndicacao.toLowerCase().includes(termoPesquisa.toLowerCase())
  })

  onMount(async () => {
    indicacoesUso = await controllerListagemIndicacoesUso()
    descricaoBuscaIndicacoes = 'Buscar Indicações'
  })

  async function salvarIndicacao() {
    if (!nomeIndicacao.trim()) {
      alert('Informe um nome para a indicação.')
      return
    }

    carregando = true

    try {
      if (idIndicacaoEditar) {
        // Chamar serviço de edição (que você precisa criar)
        const editada = await controllerSalvarIndicacoesUso(nomeIndicacao, imagem || undefined, idIndicacaoEditar)
        // Atualizar a lista local
        indicacoesUso = indicacoesUso.map((i) => (i.idIndicacaoUso === idIndicacaoEditar ? editada : i))
      } else {
        // Criar nova
        const nova = await controllerSalvarIndicacoesUso(nomeIndicacao, imagem || undefined)
        indicacoesUso = [nova, ...indicacoesUso]
      }

      fecharModal()
    } catch (e) {
      alert('Erro ao salvar indicação.')
    }

    carregando = false
  }

  async function excluirIndicacao(indicacao: IndicacaoUso) {
    if (confirm(`Deseja realmente excluir "${indicacao.nomeIndicacao}"?`)) {
      try {
        indicacoesUso = indicacoesUso.filter((i) => i.idIndicacaoUso !== indicacao.idIndicacaoUso)
        const resultado = await controllerDeletarPorId(indicacao.idIndicacaoUso)
        alert(resultado)
      } catch (e) {
        alert('Erro ao excluir indicação.')
      }
    }
  }

  function abrirModalParaEdicao(indicacao: IndicacaoUso) {
    idIndicacaoEditar = indicacao.idIndicacaoUso
    nomeIndicacao = indicacao.nomeIndicacao
    previewUrl = getPrefix(indicacao.imagemIndicacao) + indicacao.imagemIndicacao
    imagem = null // só substituir se o usuário carregar nova imagem
    abrirModal = true
  }

  function fecharModal() {
    abrirModal = false
    nomeIndicacao = ''
    imagem = null
    previewUrl = null
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      imagem = target.files[0]
      previewUrl = URL.createObjectURL(imagem)
    } else {
      imagem = null
      previewUrl = null
    }
  }

  function cliqueFora(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      fecharModal()
    }
  }
</script>

<BarraTopo>
  <BotaoVoltarHome destino="/" />
  <BarraDePesquisa texto={descricaoBuscaIndicacoes} bind:termoPesquisa />
</BarraTopo>

<!-- BOTÃO CRIAR INDICAÇÃO -->
{#if $usuarioStore?.usuarioAdmin}
  <div class="container-btn">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="itemCriar" on:click={() => (abrirModal = true)}>
      <div class="botao">+</div>
      <div class="textoCriar">Criar Indicação</div>
      <div class="containerNavegacao"></div>
    </div>
  </div>
{/if}

<!-- LISTAGEM -->
{#each indicacoesUsoFiltradas as item}
  <MenuIndicacoes indicacao={item} abrirModalFn={abrirModalParaEdicao} excluirIndicacaoFn={excluirIndicacao} />
{/each}

<!-- MODAL -->
{#if abrirModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-overlay" on:click={cliqueFora}>
    <div class="modal" on:click|stopPropagation>
      <h2>Salvar Indicação</h2>

      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label>Nome da Indicação:</label>
      <input type="text" bind:value={nomeIndicacao} />

      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label>Imagem:</label>
      <input type="file" accept="image/*" on:change={handleFileChange} />
      {#if previewUrl}
        <img class="preview" src={previewUrl} alt="Preview da Imagem" />
      {/if}

      <div class="modal-actions">
        <div class="itemBotaoModal btn-confirmar" on:click={salvarIndicacao}>
          <div class="textoCriar">{carregando ? 'Salvando...' : 'Criar'}</div>
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
  .container-btn {
    display: flex;
    justify-content: center;
    margin: 10px;
  }

  /* BOTÃO ESTILO ITEM */
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

  /* MODAL */
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
  .modal input[type='file'] {
    width: 100%;
    margin-top: 6px;
    margin-bottom: 14px;
  }

  .modal h2 {
    font-size: 33px; /* diminua conforme quiser: 18px, 19px, etc */
  }

  .preview {
    width: 100%;
    max-height: 200px;
    object-fit: contain;
    margin-bottom: 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
  }

  /* BOTÕES MODAL MESMO ESTILO ITEM */
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
</style>
