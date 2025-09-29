<script lang="ts">
  import { onMount } from 'svelte'
  import { params } from '@roxi/routify'
  import BarraDePesquisa from '@/components/BarraDePesquisa.svelte'
  import ListagemPlantaItem from '@/components/ListagemPlantaItem.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import { Planta } from '@/models/Planta'
  import { controllerListagemPlantas } from '@/controllers/plantaController'

  const rename: boolean = $params.rename === 'true'
  const titulo: string = rename ? 'O que é a RENAME?' : 'O que é a lista ReniSUS?'
  const descricao: string = rename
    ? 'A Relação Nacional de Medicamentos essenciais (Rename) é um importante instrumento orientador sobre o uso de medicamentos e insumos no Sistema Único de Saúde (SUS). Atualizada a cada dois anos, a Rename 2024 apresenta os medicamentos disponíveis no SUS em todos os níveis de atenção e organizados por responsabilidades de financiamento.'
    : 'A Relação Nacional de Plantas Medicinais de Interesse ao Sistema Único de Saúde (Renisus) é uma lista elaborada pelo Ministério da Saúde que reúne espécies vegetais com potencial de uso terapêutico para orientar pesquisas, desenvolvimento de medicamentos fitoterápicos e políticas públicas no SUS. O objetivo é fortalecer o uso seguro e eficaz de plantas medicinais, promover a produção científica e regulamentar o uso dessas espécies na atenção básica em saúde.'
  const descricaoListagemPlantas: string = rename ? 'Lista de fitoterápicos inclusos na RENAME:' : 'Lista ReniSUS:'

  let plantas: Planta[] = [] // Inicializa como array vazio para evitar erros
  let mensagem: string

  // 1. Variável para receber o termo de pesquisa do componente filho
  let termoPesquisa: string = ''

  onMount(async () => {
    plantas = await controllerListagemPlantas(rename ? 'SIM' : null, !rename ? 'SIM' : null)
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

<BarraDePesquisa texto="Buscar Planta" backgroundColor="#929e77" bind:termoPesquisa />
<BotaoVoltar destino={'/'} />
<div id="container">
  <div class="fonteDestaque">{titulo}</div>
  <div class="fonteDescricao">
    {descricao}
    <a class="link" href="www.google.com">Saiba mais</a>
  </div>
  <div class="fonteDestaque">
    {descricaoListagemPlantas}
  </div>
</div>

{#each plantasFiltradas as planta}
  <ListagemPlantaItem {planta} />
{/each}

<style>
  .fonteDestaque {
    font-size: 3.6vh;
    color: #354128;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 600;
  }

  .link {
    color: #2461ae;
    font-family: Verdana, Geneva, sans-serif;
    font-size: 2vh;
  }

  .fonteDescricao {
    font-size: 1.9vh;
    color: #354128;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 400;
    line-height: 16px;
  }

  #container {
    flex-basis: 100%;
    margin-left: 10px;
    margin-right: 3.64px;
  }
</style>
