<script lang="ts">
  import { onMount } from 'svelte'
  import { goto, params, url } from '@roxi/routify'
  import BarraTopo from '@/components/BarraTopo.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import { controllerObterPlantaPorID } from '@/controllers/plantaController'
  import { Planta } from '@/models/Planta'
  import { usuarioStore } from '@/store'
  
  let irPara: any
  $: irPara = $goto
  
  const idPlanta: number = $params.id
  let planta: Planta = new Planta()
  
  $: titulo = planta.nome ? `${planta.nome}<br>(${planta.nomeCientifico})` : 'Carregando Planta...'
  
  onMount(async () => {
    const usuarioStorage = localStorage.getItem('usuario')
    if (usuarioStorage != null && usuarioStorage == '') {
      usuarioStore.set(JSON.parse(usuarioStorage))
    }
    
    try {
      planta = await controllerObterPlantaPorID(idPlanta, $usuarioStore?.idUsuario || null)
    } catch (error) {
      alert('Erro ao carregar a planta.')
    }
  })
</script>

<BarraTopo {titulo} tamanhoFonte="1.5rem">
  <BotaoVoltar destino={$url('/paginaPlanta', { id: idPlanta })} />
</BarraTopo>

<div id="container">
  <div class="cabecalho">
    <div class="fonteDestaque">Estudos Científicos</div>
  </div>

  {#if planta.resumoTrabalhos && planta.resumoTrabalhos.trim() !== ''}
    <div class="fonteDescricao">
      <strong>Resumo Geral dos Trabalhos:</strong><br><br>
      {planta.resumoTrabalhos}
    </div>
  {/if}

  {#if planta.estudosPorPlanta && planta.estudosPorPlanta.length > 0}
    {#each planta.estudosPorPlanta as estudo}
      <div class="fonteDescricao">
        <strong>{estudo.estudoCientifico.tituloResumo || 'Estudo sem título'}</strong><br><br>
        
        {estudo.estudoCientifico.resumo}<br><br>
        
        <strong>Referências:</strong><br>
        {@html estudo.estudoCientifico.referencia}<br>
        {#if estudo.estudoCientifico.linkReferencia}
           <a class="linkItem" href={estudo.estudoCientifico.linkReferencia.startsWith('http') ? estudo.estudoCientifico.linkReferencia : `https://${estudo.estudoCientifico.linkReferencia}`} target="_blank" rel="noopener noreferrer">
             Acessar referência
           </a>
        {/if}
      </div>
    {/each}
  {:else}
    <div class="fonteDescricao">
      Não há estudos científicos cadastrados para esta planta.
    </div>
  {/if}
</div>

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
  
  .linkItem {
    color: #354128;
    font-size: 1.97vh;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-block;
    margin-top: 10px;
  }

  .linkItem:hover {
    text-decoration: underline;
    transform: translateX(3px);
  }
</style>
