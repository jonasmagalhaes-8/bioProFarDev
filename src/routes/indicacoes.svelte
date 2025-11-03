<script lang="ts">
  import BarraDePesquisa from '@/components/BarraDePesquisa.svelte'
  import BotaoVoltarHome from '@/components/BotaoVoltar.svelte'
  import MenuIndicacoes from '@/components/IndicacoesItem.svelte'
  import { controllerListagemIndicacoesUso } from '@/controllers/indicacoesUsoController'
  import { IndicacaoUso } from '@/models/IndicacaoUso'
  import { onMount } from 'svelte'
  import BarraTopo from '@/components/BarraTopo.svelte'

  let indicacoesUso: IndicacaoUso[] = [] // Inicializa como array vazio para evitar erros
  let descricaoBuscaIndicacoes: string = 'Carregando Indicações...'
  let termoPesquisa: string = ''

  $: indicacoesUsoFiltradas = indicacoesUso.filter((indicacao) => {
    // Se o termo de pesquisa estiver vazio, retorna a lista completa
    if (!termoPesquisa) return true

    // Converte o termo de pesquisa e o atributo da planta para minúsculas
    const termo = termoPesquisa.toLowerCase()

    const nomeIndicacao = indicacao.nomeIndicacao.toLowerCase()

    return nomeIndicacao.includes(termo)
  })

  onMount(async () => {
    indicacoesUso = await controllerListagemIndicacoesUso()
    descricaoBuscaIndicacoes = 'Buscar Indicações'
  })
</script>

<BarraTopo>
  <BotaoVoltarHome destino={'/'} />
  <BarraDePesquisa texto={descricaoBuscaIndicacoes} bind:termoPesquisa />
</BarraTopo>

{#each indicacoesUsoFiltradas as item}
  <MenuIndicacoes indicacao={item} />
{/each}

<style>
</style>
