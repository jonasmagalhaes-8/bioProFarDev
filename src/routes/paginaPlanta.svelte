<script lang="ts">
  import { onMount } from 'svelte'
  import { params, url } from '@roxi/routify'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import { Planta } from '@/models/Planta'
  import { controllerObterPlantaPorID } from '@/controllers/plantaController'
  import BarraTopo from '@/components/BarraTopo.svelte'
  import Accordion from '@/components/Accordion.svelte'

  const idPlanta: number = $params.id
  const origemListagemRename: string = $params.rename
  const idIndicacaoUso: string = $params.idIndicacaoUso
  const idModoPreparo: string = $params.idModoPreparo

  let titulo: string = 'Carregando Planta...'
  let planta: Planta = new Planta()

  let filhosEstudos: any[] = []
  let filhosComoUtilizar: any[] = []

  onMount(async () => {
    planta = await controllerObterPlantaPorID(idPlanta)
    titulo = `${planta.nome}<br>(${planta.nomeCientifico})`

    // listas oficiais
    if (planta.constaRename?.toUpperCase() === 'SIM') {
      titulo += '<br>Inclusa na lista RENAME'
      if (planta.constaRenisus?.toUpperCase() === 'SIM') {
        titulo += ' E ReniSUS'
      }
    } else if (planta.constaRenisus?.toUpperCase() === 'SIM') {
      titulo += '<br>Inclusa na lista ReniSUS'
    }

    // --- ESTUDOS CIENTÍFICOS ---
    if (planta.estudosPorPlanta?.length > 0) {
      filhosEstudos = planta.estudosPorPlanta.map((estudoPorPlanta) => ({
        titulo: estudoPorPlanta.estudoCientifico.tituloResumo,
        texto: `
          ${estudoPorPlanta.estudoCientifico.resumo}
          <br><br>
          <b>Resumo Simplificado:</b> ${estudoPorPlanta.resumoSimplificado || 'Não informado'}
        `,
        filhos: [
          {
            titulo: 'Referências',
            texto: estudoPorPlanta.estudoCientifico.referencia,
          },
          {
            titulo: 'Link para Leitura',
            link: estudoPorPlanta.estudoCientifico.linkReferencia, // externo
          },
        ],
      }))
    } else {
      filhosEstudos = [
        {
          titulo: 'Nenhum estudo científico encontrado',
          texto: 'Não há estudos científicos cadastrados para esta planta.',
        },
      ]
    }

    // --- COMO UTILIZAR ---
    if (planta.formaPreparo?.length > 0) {
      const formasCaseiras: any[] = []
      const formasFarmaceuticas: any[] = []

      planta.formaPreparo.forEach((f) => {
        if (f.tipo?.toUpperCase() === 'CASEIRA') formasCaseiras.push(f)
        else formasFarmaceuticas.push(f)
      })

      filhosComoUtilizar = []

      // CASEIRAS
      if (formasCaseiras.length > 0) {
        filhosComoUtilizar.push({
          titulo: 'Preparo Caseiro',
          filhos: formasCaseiras.map((f) => ({
            titulo: f.metodoPreparo?.descricaoMetodo || 'Método não informado',
            texto: `
              Parte da planta: ${f.partePlantaCaseiro || 'Não informado'}<br>
              Posologia: ${f.posologiaCaseiro || 'Não informado'}
            `,
            rota: '/modo-preparo', // 🔗 rota interna
            params: { id: f.metodoPreparo?.idMetodoPreparo }, // passa o id
            filhos: [
              {
                titulo: 'Referências',
                texto: f.referencia || 'Não informado',
              },
            ],
          })),
        })
      }

      // FARMACÊUTICAS
      if (formasFarmaceuticas.length > 0) {
        filhosComoUtilizar.push({
          titulo: 'Forma(s) Farmacêutica(s)',
          filhos: formasFarmaceuticas.map((f) => ({
            titulo: f.metodoPreparo?.descricaoMetodo || 'Método não informado',
            texto: `
              Composição/Concentração: ${f.composicaoConcentracao || 'Não informado'}<br>
              Disponibilidade: ${
                f.constaRename?.toUpperCase() === 'SIM' ? 'Disponível na RENAME' : 'Não disponível na RENAME'
              }
            `,
            rota: '/modo-preparo',
            params: { id: f.metodoPreparo?.idMetodoPreparo },
            filhos: [
              {
                titulo: 'Referências',
                texto: f.referencia || 'Não informado',
              },
            ],
          })),
        })
      }

      if (filhosComoUtilizar.length === 0) {
        filhosComoUtilizar = [
          {
            titulo: 'Nenhuma forma de preparo encontrada',
            texto: 'Não há dados cadastrados sobre formas de preparo desta planta.',
          },
        ]
      }
    }
  })
</script>

<BarraTopo {titulo} tamanhoFonte="4.9vw">
  <BotaoVoltar
    destino={idIndicacaoUso != 'null'
      ? $url('/plantasIndicacao', { idIndicacaoUso })
      : idModoPreparo != 'null'
        ? $url('/modo-preparo', { id: idModoPreparo })
        : $url('/listagemplantas', { rename: origemListagemRename.toString() })}
  />
</BarraTopo>

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
      { titulo: 'Referências Nomes Populares', texto: planta.referenciaNomesPopulares },
      { titulo: 'Referências Nomes Científicos', texto: planta.referenciaNomeCientifico },
    ]}
  />

  <Accordion titulo="Indicação de Uso" texto={planta.indicacao} />

  <Accordion
    titulo="Contraindicação"
    texto={planta.contraIndicacao}
    filhos={[{ titulo: 'Referências', texto: planta.referenciaContraIndicacao }]}
  />

  <Accordion
    titulo="Efeitos Adversos"
    texto={planta.efeitosAdversos}
    filhos={[{ titulo: 'Referências', texto: planta.referenciaEfeitosAdversos }]}
  />

  <Accordion titulo="Como utilizar?" filhos={filhosComoUtilizar} />

  <Accordion
    titulo="Estudos Científicos"
    texto={planta.resumoTrabalhos || 'Nenhum resumo disponível.'}
    filhos={filhosEstudos}
  />
</div>

<style>
  .imagem {
    display: block;
    margin: 7px auto;
    width: 65%;
    border-radius: 35px;
    border: 10px solid rgb(53, 65, 40);
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }
  .imagem:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
  }
  .container {
    margin: 0 auto;
  }
</style>
