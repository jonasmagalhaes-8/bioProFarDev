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
  
  function processarMultiplasReferencias(campoReferencia: string | null) {
    if (!campoReferencia || campoReferencia.trim() === '') {
      return []
    }
    const listaDeReferencias = campoReferencia.split('|')
    return listaDeReferencias.map((refString) => {
      const urlRegex = /(https?:\/\/[^\s]+)/
      const match = refString.match(urlRegex)
      if (match && match[0]) {
        const link = match[0]
        let texto = refString.replace(link, '').trim()
        if (texto === '') {
          texto = 'Acessar referência'
        }
        return { texto, link }
      } else {
        return { texto: refString, link: null }
      }
    })
  }
</script>

<BarraTopo {titulo} tamanhoFonte="1.5rem">
  <BotaoVoltar destino={$url('/paginaPlanta', { id: idPlanta })} />
</BarraTopo>

<div id="container">
  <div class="cabecalho">
    <div class="fonteDestaque">Como Utilizar?</div>
  </div>

  {#if planta.formaPreparo && planta.formaPreparo.length > 0}
    {#each planta.formaPreparo as forma}
      <div class="fonteDescricao">
        <strong>{forma.metodoPreparo?.descricaoMetodo || forma.tipo}</strong><br><br>
        
        {#if forma.tipo === 'CASEIRA' || forma.tipo === 'CASEIRO'}
          <strong>Parte da Planta:</strong> {forma.partePlantaCaseiro || 'Não informado'}<br>
          <strong>Posologia:</strong> {forma.posologiaCaseiro || 'Não informado'}<br><br>
        {:else}
          <strong>Composição/Concentração:</strong> {forma.composicaoConcentracao || 'Não informado'}<br>
          <strong>Disponibilidade:</strong> {forma.tem_rename?.toUpperCase() === 'SIM' ? 'Disponível na RENAME' : 'Não disponível na RENAME'}<br><br>
        {/if}
        
        {#if forma.referencia && forma.referencia.trim() !== ''}
          <strong>Referências:</strong><br>
          {#each processarMultiplasReferencias(forma.referencia) as ref}
            {@html ref.texto}
            {#if ref.link}
               <a href={ref.link} target="_blank" rel="noopener noreferrer">{ref.link}</a>
            {/if}
            <br>
          {/each}
          <br>
        {/if}
        
        {#if forma.metodoPreparo?.idMetodoPreparo}
          <a class="linkItem" href={$url('/modo-preparo', { id: forma.metodoPreparo.idMetodoPreparo, fromPlantId: idPlanta })}>
            Toque aqui para saber mais sobre esse método de preparo
          </a>
        {/if}
      </div>
    {/each}
  {:else}
    <div class="fonteDescricao">
      Não há formas de preparo ou uso cadastradas para esta planta.
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
