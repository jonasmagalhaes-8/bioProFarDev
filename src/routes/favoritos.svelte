<script lang="ts">
  import { onMount } from 'svelte'
  import { params, goto } from '@roxi/routify'
  import BarraDePesquisa from '@/components/BarraDePesquisa.svelte'
  import ListagemPlantaItem from '@/components/ListagemPlantaItem.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import { Planta } from '@/models/Planta'
  import { controllerListagemPlantas } from '@/controllers/plantaController'
  import BarraTopo from '@/components/BarraTopo.svelte'
  import { usuarioStore } from '@/store'
  import { get } from 'svelte/store'

  // Estados reativos (Svelte 5)
  let descricaoListagemPlantas = $state('Carregando plantas...')
  let plantas = $state<Planta[]>([])
  let termoPesquisa = $state('')

  onMount(async () => {
    // 1. Verificação de autenticação (mesma lógica do Perfil)
    const dadosSalvos = localStorage.getItem('usuario')
    const usuarioLogado = get(usuarioStore)

    if (!usuarioLogado?.idUsuario && !dadosSalvos) {
      const desejaIdentificar = confirm(
        'Funcionalidade disponível apenas para usuários logados, deseja ser redirecionado para fazer login ou cadastrar-se?',
      )

      if (desejaIdentificar) {
        $goto('/login')
      } else {
        $goto('/') // Volta para Home se cancelar
      }
      return // Interrompe a execução para não tentar buscar plantas sem ID
    }

    // 2. Se houver dados no storage mas o store estiver vazio (ex: F5), recupera o store
    if (dadosSalvos && !usuarioLogado?.idUsuario) {
      usuarioStore.set(JSON.parse(dadosSalvos))
    }

    // 3. Busca as plantas favoritadas usando o ID do usuário
    try {
      const idUsuario = get(usuarioStore).idUsuario
      const resultado = await controllerListagemPlantas(null, null, null, null, idUsuario)

      plantas = resultado || []

      if (plantas.length > 0) {
        descricaoListagemPlantas = 'Plantas favoritadas'
      } else {
        descricaoListagemPlantas = 'Sem plantas favoritadas'
      }
    } catch (error) {
      descricaoListagemPlantas = 'Erro ao carregar favoritos'
      console.error(error)
    }
  })

  // 4. Filtro reativo baseado no termo de pesquisa
  let plantasFiltradas = $derived(
    plantas.filter((planta) => {
      if (!termoPesquisa) return true
      const termo = termoPesquisa.toLowerCase()
      const nomePlanta = planta.nome.toLowerCase()
      return nomePlanta.includes(termo)
    }),
  )
</script>

<BarraTopo>
  <BotaoVoltar destino="/" />
  <BarraDePesquisa texto="Buscar Planta" bind:termoPesquisa />
</BarraTopo>

<div id="container">
  <div class="fonteDestaque">
    {descricaoListagemPlantas}
  </div>
</div>

{#each plantasFiltradas as planta}
  <ListagemPlantaItem
    {planta}
    origemListagemRename={null}
    origemListagemFavoritos={true}
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

  /* Estilos preservados conforme o original */
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
