<script lang="ts">
  import { onMount } from 'svelte'
  import { params } from '@roxi/routify'
  import BarraDePesquisa from '@/components/BarraDePesquisa.svelte'
  import ListagemPlantaItem from '@/components/ListagemPlantaItem.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import { Planta } from '@/models/Planta'
  import { controllerListagemPlantas } from '@/controllers/plantaController'

  const idIndicacaoUso: Number = Number.parseInt($params.idIndicacaoUso)

  let plantas: Planta[] = [] // Inicializa como array vazio para evitar erros

  let descricaoBuscaPlantas: string = 'Carregando Plantas...'

  // 1. Variável para receber o termo de pesquisa do componente filho
  let termoPesquisa: string = ''

  onMount(async () => {
    plantas = await controllerListagemPlantas(null, null, idIndicacaoUso)
    if (plantas.length > 0) {
      descricaoBuscaPlantas = 'Buscar Planta'
    } else {
      descricaoBuscaPlantas = 'Sem Plantas para essa indicação'
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

<BarraDePesquisa texto={descricaoBuscaPlantas} backgroundColor="#929e77" bind:termoPesquisa />
<BotaoVoltar destino={'/indicacoes'} />

{#each plantasFiltradas as planta}
  <ListagemPlantaItem {planta} origemListagemRename={null} {idIndicacaoUso} />
{/each}

<style>
</style>
