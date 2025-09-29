<script lang="ts">
  import { onMount } from 'svelte'
  import { params } from '@roxi/routify'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import { Planta } from '@/models/Planta'
  import { controllerObterPlantaPorID } from '@/controllers/plantaController'
  import BarraTopo from '@/components/BarraTopo.svelte'
  import Accordion from '@/components/Accordion.svelte'

  const idPlanta: number = $params.id
  let titulo: string = 'Carregando Planta...'
  let planta: Planta = new Planta()

  onMount(async () => {
    planta = await controllerObterPlantaPorID(idPlanta)

    // Título base
    titulo = `${planta.nome}<br>(${planta.nomeCientifico})`

    // Inclusão nas listas
    if (planta.constaRename.toUpperCase() === 'SIM') {
      titulo += '<br>Inclusa na lista RENAME'
      if (planta.constaRenisus.toUpperCase() === 'SIM') {
        titulo += ' E ReniSUS'
      }
    } else if (planta.constaRenisus.toUpperCase() === 'SIM') {
      titulo += '<br>Inclusa na lista ReniSUS'
    }
  })
</script>

<BarraTopo {titulo} tamanhoFonte="4.35vw" />
<BotaoVoltar destino="/" />

<!-- svelte-ignore a11y_missing_attribute -->
<img
  class="imagem"
  src="https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/85ad6fe7-5071-49b1-ae8a-8dff088b77aa__alcachofra.png"
/>

<div class="container">
  <Accordion
    titulo="Outros nomes"
    texto={`Nome(s) popular(es): ${planta.nomesPopulares}<br>Nome Científico: ${planta.nomeCientifico}<br>Sinonímia: ${planta.sinonimia}`}
    filhos={[
      {
        titulo: '↑ Referências',
        link: planta.referenciaNomesPopulares,
      },
    ]}
  />

  <Accordion titulo="Indicação de Uso" texto="A definir" />

  <Accordion
    titulo="Contraindicação"
    texto={planta.contraIndicacao}
    filhos={[
      {
        titulo: '↑ Referências',
        link: planta.referenciaContraIndicacao,
      },
    ]}
  />

  <Accordion
    titulo="Efeitos Adversos"
    texto={planta.efeitosAdversos}
    filhos={[
      {
        titulo: '↑ Referências',
        link: planta.referenciaEfeitosAdversos,
      },
    ]}
  />

  <div class="opcoesNovaPagina">Como utilizar?</div>

  <div class="opcoesNovaPagina">Estudos Científicos</div>
</div>

<style>
  .imagem {
    margin-left: 5.5vw;
    width: 90%;
    border-radius: 35px;
    border: 10px solid rgb(53, 65, 40);
  }

  .container {
    margin-left: 3.5px;
  }

  .opcoesNovaPagina {
    margin-top: 15px;
    font-size: 2.54vh;
    color: #354128;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 700;
  }
</style>
