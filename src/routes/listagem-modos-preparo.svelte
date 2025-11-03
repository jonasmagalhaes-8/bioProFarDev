<script lang="ts">
  import { onMount } from 'svelte'
  import { params } from '@roxi/routify'
  import BarraDePesquisa from '@/components/BarraDePesquisa.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import { controllerListagemModosPreparo } from '@/controllers/modoPreparoController'
  import { MetodoPreparo } from '@/models/MetodoPreparo'
  import ListagemModosPreparo from '@/components/ListagemModosPreparo.svelte'
  import BarraTopo from '@/components/BarraTopo.svelte'

  let descricaoListagemModosPreparo: string = 'Carregando Modos de Preparo...'

  let modosPreparo: MetodoPreparo[] = [] // Inicializa como array vazio para evitar erros

  // 1. Variável para receber o termo de pesquisa do componente filho
  let termoPesquisa: string = ''

  onMount(async () => {
    modosPreparo = await controllerListagemModosPreparo()
    if (modosPreparo.length > 0) {
      descricaoListagemModosPreparo = 'Buscar Modo de Preparo'
    } else {
      descricaoListagemModosPreparo = 'Sem Modos de Preparo cadastrados'
    }
  })

  // 2. Variável reativa/derivada para a lista filtrada
  // O $ faz com que essa variável seja recalculada sempre que `modosPreparo` ou `termoPesquisa` mudar.
  $: modosPreparoFiltradas = modosPreparo.filter((modopreparo) => {
    // Se o termo de pesquisa estiver vazio, retorna a lista completa
    if (!termoPesquisa) return true

    // Converte o termo de pesquisa e o atributo da modopreparo para minúsculas
    const termo = termoPesquisa.toLowerCase()

    const nomeModoPreparo = modopreparo.descricaoMetodo.toLowerCase()

    return nomeModoPreparo.includes(termo)
  })
</script>

<BarraTopo>
  <BotaoVoltar destino={'/'} />
  <BarraDePesquisa texto={descricaoListagemModosPreparo} bind:termoPesquisa />
</BarraTopo>

{#each modosPreparoFiltradas as modoPreparo}
  <ListagemModosPreparo {modoPreparo} />
{/each}

<style>
</style>
