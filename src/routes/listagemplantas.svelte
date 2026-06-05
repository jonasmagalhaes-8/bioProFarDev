<script lang="ts">
  import { onMount } from 'svelte'
  import { params } from '@roxi/routify'
  import BarraDePesquisa from '@/components/BarraDePesquisa.svelte'
  import ListagemPlantaItem from '@/components/ListagemPlantaItem.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import { Planta } from '@/models/Planta'
  import { controllerListagemPlantas } from '@/controllers/plantaController'
  import BarraTopo from '@/components/BarraTopo.svelte'
  import { usuarioStore } from '@/store'

  const rename: boolean = $params.rename === 'true'
  const titulo: string = rename ? 'O que é a RENAME?' : 'O que é a lista ReniSUS?'
  const descricao: string = rename
    ? 'A Relação Nacional de Medicamentos essenciais (Rename) é um importante instrumento orientador sobre o uso de medicamentos e insumos no Sistema Único de Saúde (SUS). Atualizada a cada dois anos, a Rename 2024 apresenta os medicamentos disponíveis no SUS em todos os níveis de atenção e organizados por responsabilidades de financiamento.'
    : 'A Relação Nacional de Plantas Medicinais de Interesse ao Sistema Único de Saúde (Renisus) é uma lista elaborada pelo Ministério da Saúde que reúne espécies vegetais com potencial de uso terapêutico para orientar pesquisas, desenvolvimento de medicamentos fitoterápicos e políticas públicas no SUS. O objetivo é fortalecer o uso seguro e eficaz de plantas medicinais, promover a produção científica e regulamentar o uso dessas espécies na atenção básica em saúde.'
  let descricaoListagemPlantas: string = 'Carregando plantas...'

  let plantas: Planta[] = [] // Inicializa como array vazio para evitar erros

  // 1. Variável para receber o termo de pesquisa do componente filho
  let termoPesquisa: string = ''

  onMount(async () => {
    plantas = await controllerListagemPlantas(rename ? 'SIM' : null, !rename ? 'SIM' : null, null, null, null)
    if (plantas.length > 0) {
      descricaoListagemPlantas = rename ? 'Lista de fitoterápicos inclusos na RENAME:' : 'Lista ReniSUS:'
    } else {
      descricaoListagemPlantas = 'Sem plantas cadastradas'
    }
  })

  // 2. Variável reativa/derivada para a lista filtrada
  // O $ faz com que essa variável seja recalculada sempre que `plantas` ou `termoPesquisa` mudar.
  $: plantasFiltradas = plantas.filter((planta) => {
    // Se o termo de pesquisa estiver vazio, retorna a lista completa
    if (!termoPesquisa) return true

    // Converte o termo de pesquisa e o atributo da planta para minúsculas
    const termo = termoPesquisa.toLowerCase()

    const nomePlanta = planta.nome.toLowerCase()

    return nomePlanta.includes(termo)
  })
</script>

<BarraTopo>
  <BotaoVoltar destino="/" />
  <BarraDePesquisa texto="Buscar Planta" bind:termoPesquisa />
</BarraTopo>

<div id="container">
  <div class="fonteDestaque">{titulo}</div>
  <div class="fonteDescricao">
    {descricao}
    <a class="link" href="https://www.google.com" target="_blank" rel="noopener noreferrer">Saiba mais</a>
  </div>
  <div class="fonteDestaque">
    {descricaoListagemPlantas}
  </div>
</div>

{#if $usuarioStore.usuarioAdmin}
  <a href={`/criar-planta?rename=${rename}`} class="criar-planta"> Criar planta </a>
{/if}

{#each plantasFiltradas as planta}
  <ListagemPlantaItem
    {planta}
    origemListagemFavoritos={null}
    origemListagemRename={rename}
    idIndicacaoUso={null}
    idModoPreparo={null}
  />
{/each}

<style>
  #container {
    flex-basis: 100%;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 10px;
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

  .criar-planta {
    background: linear-gradient(120deg, #7a8863, #a1b07d);
    border-radius: 15px;
    margin: 10px 10px 12px 10px;
    cursor: pointer;
    color: white;
    display: block;
    text-align: center;
    padding: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    font-size: 2.2vh;
    color: #fff;
  }
</style>
