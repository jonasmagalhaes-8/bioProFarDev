<script lang="ts">
  import { onMount } from 'svelte'
  import { params, url } from '@roxi/routify'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import { Planta } from '@/models/Planta'
  import { controllerObterPlantaPorID } from '@/controllers/plantaController'
  import BarraTopo from '@/components/BarraTopo.svelte'
  import Accordion from '@/components/Accordion.svelte'
  import { getPrefix } from '@/util/obterPrefixoTipoImagem'

  const idPlanta: number = $params.id
  const origemListagemRename: string = $params.rename
  const idIndicacaoUso: string = $params.idIndicacaoUso
  const idModoPreparo: string = $params.idModoPreparo

  let titulo: string = 'Carregando Planta...'
  let planta: Planta = new Planta()

  let filhosEstudos: any[] = []
  let filhosComoUtilizar: any[] = []
  let filhosOutrosNomes: any[] = []
  let filhosContraIndicacao: any[] = []
  let filhosEfeitosAdversos: any[] = []

  // HELPER 1: Extrai o link de UMA ÚNICA string de referência
  function extrairLinkReferencia(referenciaCompleta: string | null) {
    if (!referenciaCompleta || referenciaCompleta.trim() === '') {
      return { texto: 'Não informado', link: null }
    }
    const urlRegex = /(https?:\/\/[^\s]+)/
    const match = referenciaCompleta.match(urlRegex)
    if (match && match[0]) {
      const link = match[0]
      let texto = referenciaCompleta.replace(link, '').trim()
      if (texto === '') {
        texto = 'Acessar referência'
      }
      return { texto, link }
    } else {
      return { texto: referenciaCompleta, link: null }
    }
  }

  /**
   * HELPER 2: Processa um campo de texto que pode ter MÚLTIPLAS
   * referências separadas por pipe (|), gerando um array de filhos.
   */
  function processarMultiplasReferencias(campoReferencia: string | null, titulo: string = 'Referências') {
    if (!campoReferencia || campoReferencia.trim() === '') {
      return [{ titulo, texto: 'Não informado', link: null }]
    }

    // 1. Quebra a string em uma lista, usando "|" como divisor
    const listaDeReferencias = campoReferencia.split('|')

    // 2. Mapeia cada item da lista para o formato de "filho"
    //    reutilizando a função extrairLinkReferencia
    return listaDeReferencias.map((refString) => {
      const { texto, link } = extrairLinkReferencia(refString.trim())
      return {
        titulo: titulo, // O título será o mesmo para todos (ex: "Referências")
        texto: texto,
        link: link,
      }
    })
  }

  onMount(async () => {
    planta = await controllerObterPlantaPorID(idPlanta)
    titulo = `${planta.nome}<br>(${planta.nomeCientifico})`

    // (Código RENAME/ReniSUS... sem mudanças)
    if (planta.constaRename?.toUpperCase() === 'SIM') {
      //...
    }

    // --- PROCESSAR REFERÊNCIAS ---

    // "Outros Nomes" (tratamento especial com duas refs separadas)
    const refPop = extrairLinkReferencia(planta.referenciaNomesPopulares)
    const refCient = extrairLinkReferencia(planta.referenciaNomeCientifico)

    filhosOutrosNomes = [
      {
        titulo: 'Referências Nomes Populares',
        texto: refPop.texto,
        link: refPop.link,
      },
      {
        titulo: 'Referências Nomes Científicos',
        texto: refCient.texto,
        link: refCient.link,
      },
    ]

    // "Contraindicação" (Agora usa o novo helper para criar MÚLTIPLOS filhos)
    filhosContraIndicacao = processarMultiplasReferencias(planta.referenciaContraIndicacao)

    // "Efeitos Adversos" (Também usa o novo helper)
    filhosEfeitosAdversos = processarMultiplasReferencias(planta.referenciaEfeitosAdversos)

    // "Estudos Científicos" (Já estava correto)
    if (planta.estudosPorPlanta?.length > 0) {
      filhosEstudos = planta.estudosPorPlanta.map((estudoPorPlanta) => ({
        titulo: estudoPorPlanta.estudoCientifico.tituloResumo,
        texto: `${estudoPorPlanta.estudoCientifico.resumo}`,
        filhos: [
          {
            titulo: 'Referências',
            texto: estudoPorPlanta.estudoCientifico.referencia,
            link: estudoPorPlanta.estudoCientifico.linkReferencia,
          },
        ],
      }))
    } else {
      //... (lógica de 'Nenhum estudo')
    }

    // "Como Utilizar" (Também precisa usar o "processarMultiplasReferencias")
    if (planta.formaPreparo?.length > 0) {
      //... (código que separa caseiras e farmaceuticas)
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
          filhos: formasCaseiras.map((f) => {
            const refFilhos = processarMultiplasReferencias(f.referencia)
            return {
              titulo: f.metodoPreparo?.descricaoMetodo || f.tipo,
              texto: `
    Parte da planta: ${f.partePlantaCaseiro || 'Não informado'}<br>
    Posologia: ${f.posologiaCaseiro || 'Não informado'}
  `,
              filhos: refFilhos,
              ...(f.metodoPreparo?.descricaoMetodo
                ? {
                    rota: '/modo-preparo',
                    params: { id: f.metodoPreparo.idMetodoPreparo },
                  }
                : {}),
            }
          }),
        })
      }

      // FARMACÊUTICAS
      if (formasFarmaceuticas.length > 0) {
        filhosComoUtilizar.push({
          titulo: 'Forma(s) Farmacêutica(s)',
          filhos: formasFarmaceuticas.map((f) => {
            const refFilhos = processarMultiplasReferencias(f.referencia)
            return {
              titulo: f.metodoPreparo?.descricaoMetodo || f.tipo,
              texto: `
    Composição/Concentração: ${f.composicaoConcentracao || 'Não informado'}<br>
    Disponibilidade: ${f.tem_rename?.toUpperCase() === 'SIM' ? 'Disponível na RENAME' : 'Não disponível na RENAME'}
  `,
              filhos: refFilhos,
              ...(f.metodoPreparo?.descricaoMetodo
                ? {
                    rota: '/modo-preparo',
                    params: { id: f.metodoPreparo.idMetodoPreparo },
                  }
                : {}),
            }
          }),
        })
      }

      // ... (resto do código "Como Utilizar")
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

{#if planta.imagemBase64 && planta.imagemBase64.trim() !== ''}
  <img class="imagem" src={getPrefix(planta.imagemBase64) + planta.imagemBase64} alt={planta.nome} />
{:else}
  <img class="imagem" src="/img/placeholder-planta.png" alt="Imagem não disponível" />
{/if}

<div class="container">
  <Accordion
    titulo="Outros nomes"
    texto={`Nome(s) popular(es): ${planta.nomesPopulares?.trim() || 'Não informado'}
  <br>Nome Científico: ${planta.nomeCientifico?.trim() || 'Não informado'}
  <br>Sinonímia: ${planta.sinonimia?.trim() || 'Não informado'}`}
    filhos={filhosOutrosNomes}
  />

  <Accordion titulo="Indicação de Uso" texto={planta.indicacao} />

  <Accordion titulo="Contraindicação" texto={planta.contraIndicacao} filhos={filhosContraIndicacao} />

  <Accordion titulo="Efeitos Adversos" texto={planta.efeitosAdversos} filhos={filhosEfeitosAdversos} />

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
