<script lang="ts">
  import { onMount } from 'svelte'
  import { goto, params } from '@roxi/routify'
  import BarraDePesquisa from '@/components/BarraDePesquisa.svelte'
  import ListagemPlantaItem from '@/components/ListagemPlantaItem.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import { Planta } from '@/models/Planta'
  import { controllerListagemPlantas, controllerObterPlantaPorID } from '@/controllers/plantaController'
  import { MetodoPreparo } from '@/models/MetodoPreparo'
  import {
    controllerCriarModoPreparo,
    controllerDeletarPorId,
    controllerObterModoPreparoPorID,
  } from '@/controllers/modoPreparoController'
  import BarraTopo from '@/components/BarraTopo.svelte'
  import { LucideEdit3, LucideTrash } from '@lucide/svelte'
  import Input from '@/components/Input.svelte'
  import Apagar from '@/components/Apagar.svelte'

  let irPara: any
  $: irPara = $goto

  const idModoPreparo: number = $params.id
  let descricao: string = 'Carregando modo de preparo...'
  let descricaoListagemPlantas: string = 'Carregando plantas...'
  let modoPreparo: MetodoPreparo
  let referenciasHTML: string = ''

  let plantas: Planta[] = []
  let termoPesquisa: string = ''

  let modalEditarModoPreparoAberto = false
  let modalApagarModoPreparoAberto = false

  const getModoPreparo = async () => {
    try {
      modoPreparo = await controllerObterModoPreparoPorID(idModoPreparo)
      descricao = modoPreparo.descricaoMetodo

      // Monta as referências como HTML, com <br>
      referenciasHTML = `
      ${modoPreparo?.referencia1 ? 'Referência 1:<br>' + modoPreparo.referencia1 + '<br><br>' : ''}
      ${modoPreparo?.referencia2 ? 'Referência 2:<br>' + modoPreparo.referencia2 + '<br><br>' : ''}
      ${modoPreparo?.referencia3 ? 'Referência 3:<br>' + modoPreparo.referencia3 + '<br><br>' : ''}
      ${modoPreparo?.referencia4 ? 'Referência 4:<br>' + modoPreparo.referencia4 + '<br><br>' : ''}
      ${modoPreparo?.referencia5 ? 'Referência 5:<br>' + modoPreparo.referencia5 + '<br>' : ''}
    `
    } catch (error) {
      alert(error.message)
    }
  }

  const onEditarModoPreparo = async (e: Event) => {
    e.preventDefault()

    if (!modoPreparo.descricaoMetodo || modoPreparo.descricaoMetodo.trim().length < 1) {
      alert('Insira uma descrição')
      return
    }

    try {
      const response = await controllerCriarModoPreparo(modoPreparo)
      termoPesquisa = ''
      await getModoPreparo()
      modalEditarModoPreparoAberto = false
    } catch (error) {
      alert(error.message)
    }
  }

  const onApagarModoPreparo = async () => {
    try {
      await controllerDeletarPorId(idModoPreparo)
      irPara('/listagem-modos-preparo')
    } catch (error) {
      alert(error.message)
    }
  }

  onMount(async () => {
    plantas = await controllerListagemPlantas(null, null, null, idModoPreparo)
    await getModoPreparo()

    if (plantas.length > 0) {
      descricaoListagemPlantas = 'Lista de fitoterápicos:'
    } else {
      descricaoListagemPlantas = 'Sem plantas cadastradas'
    }
  })

  $: plantasFiltradas = plantas.filter((planta) => {
    if (!termoPesquisa) return true
    const termo = termoPesquisa.toLowerCase()
    const nomePlanta = planta.nome.toLowerCase()
    return nomePlanta.includes(termo)
  })
</script>

<BarraTopo>
  <BotaoVoltar destino={'/listagem-modos-preparo'} />
  <BarraDePesquisa texto="Buscar Planta" bind:termoPesquisa />
</BarraTopo>

<div id="container">
  <div class="cabecalho">
    <div class="fonteDestaque">{descricao}</div>
    <div class="botoesContainer">
      <button on:click={() => (modalEditarModoPreparoAberto = true)}>
        <LucideEdit3 />
      </button>
      <button on:click={() => (modalApagarModoPreparoAberto = true)}>
        <LucideTrash />
      </button>
    </div>
  </div>
  <div class="fonteDescricao">
    {@html referenciasHTML}
  </div>
  <div class="fonteDestaque">{descricaoListagemPlantas}</div>
</div>

{#if modalEditarModoPreparoAberto}
  <div class="modal">
    <div class="modal-content">
      <h2>Criar Modo de Preparo</h2>
      <div on:submit={(e) => onEditarModoPreparo(e)}>
        <label for="Descrição">Descrição</label>
        <Input autoCapitalize="sentences" bind:value={modoPreparo.descricaoMetodo} />

        <label for="referencia1">Referência 1</label>
        <Input autoCapitalize="sentences" bind:value={modoPreparo.referencia1} />

        <label for="referencia2">Referência 2</label>
        <Input autoCapitalize="sentences" bind:value={modoPreparo.referencia2} />

        <label for="referencia3">Referência 3</label>
        <Input autoCapitalize="sentences" bind:value={modoPreparo.referencia3} />

        <label for="referencia4">Referência 4</label>
        <Input autoCapitalize="sentences" bind:value={modoPreparo.referencia4} />

        <label for="referencia5">Referência 5</label>
        <Input autoCapitalize="sentences" bind:value={modoPreparo.referencia5} />

        <button on:click={onEditarModoPreparo}>Salvar Modo de Preparo</button>
        <button
          on:click={() => {
            modalEditarModoPreparoAberto = false
          }}>Fechar</button
        >
      </div>
    </div>
  </div>
{/if}

<Apagar
  bind:aberto={modalApagarModoPreparoAberto}
  titulo="Apagar Modo de Preparo"
  mensagem="Tem certeza que deseja apagar este modo de preparo?"
  onConfirmar={onApagarModoPreparo}
  onFechar={() => (modalApagarModoPreparoAberto = false)}
/>

{#each plantasFiltradas as planta}
  <ListagemPlantaItem {planta} origemListagemRename={null} idIndicacaoUso={null} {idModoPreparo} />
{/each}

<style>
  #container {
    flex-basis: 100%;
    margin-left: 10px;
    margin-right: 10px;
  }

  .cabecalho {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .fonteDestaque {
    font-size: 3.6vh;
    color: #2e3b1f;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .fonteDescricao {
    font-size: 2vh;
    color: #3f4a2c;
    font-family: 'Roboto', Verdana, Geneva, sans-serif;
    font-weight: 400;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.4);
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .botoesContainer {
    display: flex;
    gap: 10px;
  }

  .botoesContainer button {
    padding: 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
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

  .modal-content div button:nth-of-type(1) {
    margin-top: 15px;
  }

  .modal-content div button {
    width: 100%;
  }
</style>
