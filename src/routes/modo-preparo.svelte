<script lang="ts">
  import { onMount } from 'svelte'
  import { params } from '@roxi/routify'
  import BarraDePesquisa from '@/components/BarraDePesquisa.svelte'
  import ListagemPlantaItem from '@/components/ListagemPlantaItem.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import { Planta } from '@/models/Planta'
  import { controllerListagemPlantas, controllerObterPlantaPorID } from '@/controllers/plantaController'
  import { MetodoPreparo } from '@/models/MetodoPreparo'
  import { controllerObterModoPreparoPorID } from '@/controllers/modoPreparoController'
  import BarraTopo from '@/components/BarraTopo.svelte'

  const idModoPreparo: number = $params.id
  let descricao: string = 'Carregando modo de preparo...'
  let descricaoListagemPlantas: string = 'Carregando plantas...'
  let modoPreparo: MetodoPreparo
  let referenciasHTML: string = ''

  let plantas: Planta[] = []
  let termoPesquisa: string = ''

  onMount(async () => {
    plantas = await controllerListagemPlantas(null, null, null, idModoPreparo)
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
  <div class="fonteDestaque">{descricao}</div>
  <div class="fonteDescricao">
    {@html referenciasHTML}
  </div>
  <div class="fonteDestaque">{descricaoListagemPlantas}</div>
</div>

{#each plantasFiltradas as planta}
  <ListagemPlantaItem {planta} origemListagemRename={null} idIndicacaoUso={null} {idModoPreparo} />
{/each}

<style>
  #container {
    flex-basis: 100%;
    margin-left: 10px;
    margin-right: 10px;
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

  .link {
    color: #3d7dd9;
    font-family: 'Roboto', Verdana, Geneva, sans-serif;
    font-size: 2vh;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    position: relative;
  }

  .link:hover {
    color: #1a4fa0;
    text-decoration: underline;
  }
</style>
