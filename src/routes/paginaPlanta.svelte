<script lang="ts">
  import { onMount } from 'svelte'
  import { goto, params, url } from '@roxi/routify'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import {
    controllerAtualizarImagem,
    controllerDeletarPorId,
    controllerObterPlantaPorID,
  } from '@/controllers/plantaController'
  import BarraTopo from '@/components/BarraTopo.svelte'
  import Accordion from '@/components/Accordion.svelte'
  import { getPrefix } from '@/util/obterPrefixoTipoImagem'
  import { FormaPreparo } from '@/models/FormaPreparo'
  import { Planta } from '@/models/Planta'
  import { EstudosPorPlanta } from '@/models/EstudosPorPlanta'
  import { usuarioStore } from '@/store'
  import { LucideEdit3, LucideTrash } from '@lucide/svelte'
  import Input from '@/components/Input.svelte'
  import MultiSelectDropdown from '@/components/MultiSelectDropdown.svelte'
  import { controllerListagemIndicacoesUso } from '@/controllers/indicacoesUsoController'
  import { controllerListagemModosPreparo } from '@/controllers/modoPreparoController'
  import { IndicacaoUso } from '@/models/IndicacaoUso'
  import { MetodoPreparo } from '@/models/MetodoPreparo'
  import Apagar from '@/components/Apagar.svelte'

  let irPara: any
  $: irPara = $goto

  const idPlanta: number = $params.id
  const origemListagemRename: string = $params.rename
  const idIndicacaoUso: string = $params.idIndicacaoUso
  const idModoPreparo: string = $params.idModoPreparo

  let indicacoes: IndicacaoUso[] = []
  let modosPreparo: MetodoPreparo[] = []

  let planta: Planta = new Planta()
  let plantaReferencia: Planta = new Planta()

  let fileInput: HTMLInputElement

  // --- ESTADO DO MODAL ---
  let modalAberto:
    | 'nomes'
    | 'indicacao'
    | 'contraindicacao'
    | 'efeitos'
    | 'estudos'
    | 'formasPreparo'
    | 'comoUtilizar'
    | null = null
  let refsEmEdicao: string[] = []
  let itemEmEdicao: any = null
  let indexEmEdicao: number | null = null

  let modalDeletar = false

  // --- HELPERS (sem mudanças) ---
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

  function processarMultiplasReferencias(campoReferencia: string | null, titulo: string = 'Referências') {
    if (!campoReferencia || campoReferencia.trim() === '') {
      return [{ titulo, texto: 'Não informado', link: null }]
    }
    const listaDeReferencias = campoReferencia.split('|')
    return listaDeReferencias.map((refString) => {
      const { texto, link } = extrairLinkReferencia(refString.trim())
      return {
        titulo: titulo,
        texto: texto,
        link: link,
      }
    })
  }

  // --- DECLARAÇÕES REATIVAS ($:) (sem mudanças) ---
  $: titulo = planta.nome ? `${planta.nome}<br>(${planta.nomeCientifico})` : 'Carregando Planta...'
  $: filhosOutrosNomes = planta.idPlanta
    ? [
        {
          titulo: 'Referências Nomes Populares',
          ...extrairLinkReferencia(planta.referenciaNomesPopulares),
        },
        {
          titulo: 'Referências Nomes Científicos',
          ...extrairLinkReferencia(planta.referenciaNomeCientifico),
        },
      ]
    : []
  $: filhosContraIndicacao = processarMultiplasReferencias(planta.referenciaContraIndicacao)
  $: filhosEfeitosAdversos = processarMultiplasReferencias(planta.referenciaEfeitosAdversos)
  $: filhosEstudos = (() => {
    if (!planta.estudosPorPlanta || planta.estudosPorPlanta.length === 0) {
      return [
        {
          titulo: 'Nenhum estudo científico encontrado',
          texto: 'Não há estudos científicos cadastrados para esta planta.',
        },
      ]
    }
    return planta.estudosPorPlanta.map((EstudosPorPlanta) => ({
      titulo: EstudosPorPlanta.estudoCientifico.tituloResumo,
      texto: `${EstudosPorPlanta.estudoCientifico.resumo}`,
      filhos: [
        {
          titulo: 'Referências',
          texto: EstudosPorPlanta.estudoCientifico.referencia,
          link: EstudosPorPlanta.estudoCientifico.linkReferencia,
        },
      ],
    }))
  })()
  $: filhosComoUtilizar = (() => {
    if (!planta.formaPreparo || planta.formaPreparo.length === 0) {
      return [
        {
          titulo: 'Nenhuma forma de preparo cadastrada',
          texto: 'Não há formas de preparo ou uso cadastradas para esta planta.',
        },
      ]
    }
    const formasCaseiras: any[] = []
    const formasFarmaceuticas: any[] = []
    planta.formaPreparo.forEach((f) => {
      if (f.tipo?.toUpperCase() === 'CASEIRA') formasCaseiras.push(f)
      else formasFarmaceuticas.push(f)
    })
    const filhosResult: any[] = []
    if (formasCaseiras.length > 0) {
      filhosResult.push({
        titulo: 'Preparo Caseiro',
        filhos: formasCaseiras.map((f) => {
          const refFilhos = processarMultiplasReferencias(f.referencia)
          return {
            titulo: f.metodoPreparo?.descricaoMetodo || f.tipo,
            texto: `Parte da planta: ${f.partePlantaCaseiro || 'Não informado'}<br>Posologia: ${f.posologiaCaseiro || 'Não informado'}`,
            filhos: refFilhos,
            ...(f.metodoPreparo?.descricaoMetodo
              ? { rota: '/modo-preparo', params: { id: f.metodoPreparo.idMetodoPreparo } }
              : {}),
          }
        }),
      })
    }
    if (formasFarmaceuticas.length > 0) {
      filhosResult.push({
        titulo: 'Forma(s) Farmacêutica(s)',
        filhos: formasFarmaceuticas.map((f) => {
          const refFilhos = processarMultiplasReferencias(f.referencia)
          return {
            titulo: f.metodoPreparo?.descricaoMetodo || f.tipo,
            texto: `Composição/Concentração: ${f.composicaoConcentracao || 'Não informado'}<br>Disponibilidade: ${f.tem_rename?.toUpperCase() === 'SIM' ? 'Disponível na RENAME' : 'Não disponível na RENAME'}`,
            filhos: refFilhos,
            ...(f.metodoPreparo?.descricaoMetodo
              ? { rota: '/modo-preparo', params: { id: f.metodoPreparo.idMetodoPreparo } }
              : {}),
          }
        }),
      })
    }
    return filhosResult
  })()

  // --- LÓGICA DE MONTAGEM E AÇÕES ---

  async function loadPlanta() {
    planta = await controllerObterPlantaPorID(idPlanta)
    plantaReferencia = planta
  }

  onMount(async () => {
    await loadPlanta()
    if ($usuarioStore.usuarioAdmin) {
      try {
        const response = await controllerListagemIndicacoesUso()
        indicacoes = response
      } catch (error) {
        alert('Erro ao carregar indicações de uso.')
      }

      try {
        const response = await controllerListagemModosPreparo()
        modosPreparo = response
      } catch (error) {
        alert('Erro ao carregar métodos de preparo.')
      }
    }
  })

  function abrirModal(
    tipo: 'nomes' | 'indicacao' | 'contraindicacao' | 'efeitos' | 'estudos' | 'formasPreparo' | 'comoUtilizar' | null,
  ) {
    modalAberto = tipo
    itemEmEdicao = null
    indexEmEdicao = null
    if (tipo === 'contraindicacao') {
      refsEmEdicao = (planta.referenciaContraIndicacao || '').split('|').filter((ref) => ref.trim() !== '')
    } else if (tipo === 'efeitos') {
      refsEmEdicao = (planta.referenciaEfeitosAdversos || '').split('|').filter((ref) => ref.trim() !== '')
    } else {
      refsEmEdicao = []
    }
  }

  // Funções do Editor de Referências (Simples)
  function adicionarReferencia() {
    refsEmEdicao = [...refsEmEdicao, '']
  }
  function removerReferencia(index: number) {
    refsEmEdicao = refsEmEdicao.filter((_, i) => i !== index)
  }

  // --- Funções Mestre-Detalhe (Forma de Preparo) ---
  function editarFormaPreparo(forma: FormaPreparo, index: number) {
    itemEmEdicao = { ...forma }
    indexEmEdicao = index
    refsEmEdicao = (forma.referencia || '').split('|').filter((ref) => ref.trim() !== '')
  }

  function adicionarFormaPreparo() {
    itemEmEdicao = new FormaPreparo()
    itemEmEdicao.tipo = 'CASEIRA'
    indexEmEdicao = -1
    refsEmEdicao = []
  }

  function removerFormaPreparo(index: number) {
    if (confirm('Tem certeza que deseja remover esta forma de preparo?')) {
      planta.formaPreparo = planta.formaPreparo.filter((_, i) => i !== index)
    }
  }

  function salvarItemFormaPreparo() {
    itemEmEdicao.referencia = refsEmEdicao.filter((ref) => ref.trim() !== '').join('|')
    if (indexEmEdicao === -1) {
      planta.formaPreparo = [...planta.formaPreparo, itemEmEdicao]
    } else {
      const listaAtualizada = [...planta.formaPreparo]
      listaAtualizada[indexEmEdicao] = itemEmEdicao
      planta.formaPreparo = listaAtualizada
    }
    itemEmEdicao = null
    indexEmEdicao = null
    refsEmEdicao = []
  }

  // --- Funções Mestre-Detalhe (Estudos Científicos) ---
  function editarEstudo(estudo: EstudosPorPlanta, index: number) {
    itemEmEdicao = {
      ...estudo,
      estudoCientifico: { ...estudo.estudoCientifico },
    }
    indexEmEdicao = index
  }

  // *** BUG CORRIGIDO AQUI ***
  function adicionarEstudo() {
    // Precisamos criar o objeto com a ESTRUTURA COMPLETA que o formulário
    // espera, senão o 'bind:value' falha em 'estudoCientifico'
    itemEmEdicao = {
      // idEstudosPorPlanta: null, // (ou 0, dependendo do seu modelo)
      planta: { idPlanta: planta.idPlanta },
      estudoCientifico: {
        // idEstudoCientifico: null, // (ou 0)
        tituloResumo: '',
        resumo: '',
        referencia: '',
        linkReferencia: '',
      },
    }
    indexEmEdicao = -1 // Sinaliza que é um novo item
  }

  function removerEstudo(index: number) {
    if (confirm('Tem certeza que deseja remover este estudo?')) {
      planta.estudosPorPlanta = planta.estudosPorPlanta.filter((_, i) => i !== index)
    }
  }

  function salvarItemEstudo() {
    if (indexEmEdicao === -1) {
      planta.estudosPorPlanta = [...planta.estudosPorPlanta, itemEmEdicao]
    } else {
      const listaAtualizada = [...planta.estudosPorPlanta]
      listaAtualizada[indexEmEdicao] = itemEmEdicao
      planta.estudosPorPlanta = listaAtualizada
    }

    itemEmEdicao = null
    indexEmEdicao = null
  }

  function cancelarItemEdicao() {
    itemEmEdicao = null
    indexEmEdicao = null
    refsEmEdicao = []
  }

  async function onCancelar() {
    switch (modalAberto) {
      case 'nomes':
        planta.nome = plantaReferencia.nome
        planta.nomesPopulares = plantaReferencia.nomesPopulares
        planta.referenciaNomesPopulares = plantaReferencia.referenciaNomesPopulares
        planta.nomeCientifico = plantaReferencia.nomeCientifico
        planta.referenciaNomeCientifico = plantaReferencia.referenciaNomeCientifico
        planta.sinonimia = plantaReferencia.sinonimia
        planta.constaRename = plantaReferencia.constaRename
        planta.constaRenisus = plantaReferencia.constaRenisus
        break
      case 'indicacao':
        planta.indicacao = plantaReferencia.indicacao
        planta.indicacoesPlanta = plantaReferencia.indicacoesPlanta
        break
      case 'contraindicacao':
        planta.contraIndicacao = plantaReferencia.contraIndicacao
        planta.referenciaContraIndicacao = plantaReferencia.referenciaContraIndicacao
        break
      case 'efeitos':
        // Lógica para sair do modal de efeitos adversos
        break
      case 'estudos':
        // Lógica para sair do modal de estudos científicos
        break
      case 'formasPreparo':
        // Lógica para sair do modal de formas de preparo
        break
      case 'comoUtilizar':
        // Lógica para sair do modal de como utilizar
        break
      default:
        break
    }
  }

  function openFilePicker() {
    if (!$usuarioStore.usuarioAdmin) return
    fileInput.click()
  }

  async function mudarImagemPlanta(e: Event & { currentTarget: HTMLInputElement }) {
    if (!e.currentTarget.files || e.currentTarget.files.length < 1) return

    const imagem = e.currentTarget.files[0]

    try {
      await controllerAtualizarImagem(planta.idPlanta, imagem)
      await loadPlanta()
    } catch (error) {
      alert(error.message)
    }
  }

  // --- Função Principal de SALVAR ---
  async function handleSave() {
    if (!planta) return
    if (modalAberto === 'contraindicacao') {
      planta.referenciaContraIndicacao = refsEmEdicao.filter((ref) => ref.trim() !== '').join('|')
    } else if (modalAberto === 'efeitos') {
      planta.referenciaEfeitosAdversos = refsEmEdicao.filter((ref) => ref.trim() !== '').join('|')
    }

    try {
      // const plantaSalva = await controllerAtualizarPlanta(planta)
      //planta = null

      planta.imagemBase64 = null
      console.log(JSON.stringify(planta))
      modalAberto = null
      itemEmEdicao = null
      indexEmEdicao = null
      refsEmEdicao = []
      alert('Planta atualizada com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Falha ao atualizar a planta.')
    }
  }

  async function onDeletarPlanta() {
    try {
      await controllerDeletarPorId(idPlanta)

      if (idIndicacaoUso && idIndicacaoUso !== 'null') {
        irPara('/plantasIndicacao', { idIndicacaoUso })
      } else if (idModoPreparo && idModoPreparo !== 'null') {
        irPara('/modo-preparo', { id: idModoPreparo })
      } else {
        // Tratamento seguro para evitar crash se 'origemListagemRename' for undefined
        const valorRename = origemListagemRename ? origemListagemRename.toString() : 'true'

        irPara('/listagemplantas', { rename: valorRename })
      }
    } catch (error) {
      alert(error.message)
    }
  }
</script>

<BarraTopo {titulo} tamanhoFonte="1.5rem">
  <BotaoVoltar
    destino={idIndicacaoUso != 'null'
      ? $url('/plantasIndicacao', { idIndicacaoUso })
      : idModoPreparo != 'null'
        ? $url('/modo-preparo', { id: idModoPreparo })
        : $url('/listagemplantas', { rename: origemListagemRename.toString() })}
  />
</BarraTopo>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="topContainer">
  <div
    class="imagemContainer"
    on:click={openFilePicker}
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key == 'Enter' && openFilePicker()}
  >
    {#if planta.imagemBase64 && planta.imagemBase64.trim() !== ''}
      <img class="imagem" src={getPrefix(planta.imagemBase64) + planta.imagemBase64} alt={planta.nome} />
    {:else}
      <img class="imagem" src="/img/placeholder-planta.png" alt="Imagem não disponível" />
    {/if}
    <span>
      <LucideEdit3 />
    </span>
    <input type="file" accept="image/*" bind:this={fileInput} on:change={mudarImagemPlanta} hidden />
  </div>

  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="trash" on:click={() => (modalDeletar = true)}>
    <LucideTrash color="#FF5555" />
  </div>
</div>

<div class="container">
  <div class="edit-section">
    <Accordion
      titulo="Nomes"
      texto={`Nome(s) popular(es): ${planta.nomesPopulares?.trim() || 'Não informado'}
    <br>Nome Científico: ${planta.nomeCientifico?.trim() || 'Não informado'}
    <br>Sinonímia: ${planta.sinonimia?.trim() || 'Não informado'}`}
      filhos={filhosOutrosNomes}
    />
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    {#if $usuarioStore?.usuarioAdmin}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="edit-btn" on:click={() => abrirModal('nomes')}><LucideEdit3 color="black" size={20} /></div>
    {/if}
  </div>

  <div class="edit-section">
    <Accordion titulo="Indicação de Uso" texto={planta.indicacao} />
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    {#if $usuarioStore?.usuarioAdmin}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="edit-btn" on:click={() => abrirModal('indicacao')}><LucideEdit3 color="black" size={20} /></div>
    {/if}
  </div>

  <div class="edit-section">
    <Accordion titulo="Contraindicação" texto={planta.contraIndicacao} filhos={filhosContraIndicacao} />
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    {#if $usuarioStore?.usuarioAdmin}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="edit-btn" on:click={() => abrirModal('contraindicacao')}><LucideEdit3 color="black" size={20} /></div>
    {/if}
  </div>

  <div class="edit-section">
    <Accordion titulo="Efeitos Adversos" texto={planta.efeitosAdversos} filhos={filhosEfeitosAdversos} />
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    {#if $usuarioStore?.usuarioAdmin}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="edit-btn" on:click={() => abrirModal('efeitos')}><LucideEdit3 color="black" size={20} /></div>
    {/if}
  </div>

  <div class="edit-section">
    <Accordion titulo="Como utilizar?" filhos={filhosComoUtilizar} />
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    {#if $usuarioStore?.usuarioAdmin}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="edit-btn" on:click={() => abrirModal('comoUtilizar')}><LucideEdit3 color="black" size={20} /></div>
    {/if}
  </div>

  <div class="edit-section">
    <Accordion
      titulo="Estudos Científicos"
      texto={planta.resumoTrabalhos || 'Nenhum resumo disponível.'}
      filhos={filhosEstudos}
    />
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    {#if $usuarioStore?.usuarioAdmin}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="edit-btn" on:click={() => abrirModal('estudos')}><LucideEdit3 color="black" size={20} /></div>
    {/if}
  </div>
</div>

<!-- MODAIS DE EDIÇÃO -->

{#if modalAberto}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal" on:click={() => (modalAberto = null)}>
    <div class="modal-content" on:click={(e) => e.stopPropagation()}>
      {#if modalAberto === 'nomes'}
        <div class="modal-body">
          <label for="nome-comum">Nome da Planta:</label>
          <Input keyboardType="default" bind:value={planta.nome} />

          <label for="nomesPopulares">Nomes Populares:</label>
          <Input keyboardType="default" bind:value={planta.nomesPopulares} />

          <label for="referenciaNomesPopulares">Referência Nomes Populares: (Única)</label>
          <Input keyboardType="default" bind:value={planta.referenciaNomesPopulares} />

          <label for="nome-cientifico">Nome Científico:</label>
          <Input keyboardType="default" bind:value={planta.nomeCientifico} />

          <label for="referenciaNomeCientifico">Referência Nome Científico: (Única)</label>
          <Input keyboardType="default" bind:value={planta.referenciaNomeCientifico} />

          <label for="sinonimia">Sinonimia:</label>
          <Input keyboardType="default" bind:value={planta.sinonimia} />

          <label for="constaAonde">Consta aonde?</label>

          <div class="checkbox-container">
            <label for="rename"
              ><input
                type="checkbox"
                name="rename"
                id="rename"
                checked={planta.constaRename == 'SIM'}
                on:change={(e) => {
                  const { checked } = e.target as HTMLInputElement

                  if (checked) {
                    planta.constaRename = 'SIM'
                  } else {
                    planta.constaRename = 'NÃO'
                  }
                }}
              />Rename</label
            >
          </div>

          <div class="checkbox-container">
            <label for="rename"
              ><input
                type="checkbox"
                name="renisus"
                id="renisus"
                checked={planta.constaRenisus == 'SIM'}
                on:change={(e) => {
                  const { checked } = e.target as HTMLInputElement

                  if (checked) {
                    planta.constaRenisus = 'SIM'
                  } else {
                    planta.constaRenisus = 'NÃO'
                  }
                }}
              />ReniSUS</label
            >
          </div>
        </div>
      {/if}

      {#if modalAberto === 'indicacao'}
        <div class="modal-body">
          <label for="indicacaoTxt">Indicação:</label>
          <Input keyboardType="default" bind:value={planta.indicacao} style="margin-bottom: 10px;" />

          <MultiSelectDropdown
            options={indicacoes.map((indicacao) => ({
              id: indicacao,
              value: indicacao.nomeIndicacao,
            }))}
            bind:selected={planta.indicacoesPlanta}
            placeholder="Selecione indicações..."
          />
        </div>
      {/if}

      {#if modalAberto === 'contraindicacao'}
        <div class="modal-body">
          <label for="contraTxt">Contraindicação:</label>
          <Input keyboardType="default" bind:value={planta.contraIndicacao} />

          <label for="contraindicacoesreferencias">Referências:</label>
          {#each refsEmEdicao as ref, i}
            <div class="ref-editor-item">
              <Input keyboardType="default" bind:value={refsEmEdicao[i]} />
              <button class="btn-remover-ref" on:click={() => removerReferencia(i)} title="Remover Referência"
                ><LucideTrash /></button
              >
            </div>
          {/each}
          <button class="btn-adicionar-ref" on:click={adicionarReferencia}>+ Adicionar Referência</button>
        </div>
      {/if}

      {#if modalAberto === 'efeitos'}
        <h2 class="modal-header">Editar Efeitos Adversos</h2>
        <div class="modal-body">
          <label for="efeitosTxt">Efeitos Adversos:</label>
          <!-- svelte-ignore element_invalid_self_closing_tag -->
          <textarea id="efeitosTxt" bind:value={planta.efeitosAdversos} />
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label>Referências:</label>
          {#each refsEmEdicao as ref, i}
            <div class="ref-editor-item">
              <input type="text" bind:value={refsEmEdicao[i]} />
              <button class="btn-remover-ref" on:click={() => removerReferencia(i)} title="Remover Referência"
                >🗑️</button
              >
            </div>
          {/each}
          <button class="btn-adicionar-ref" on:click={adicionarReferencia}>+ Adicionar Referência</button>
        </div>
      {/if}

      {#if modalAberto === 'comoUtilizar'}
        <div class="modal-body">
          {#if itemEmEdicao === null}
            <div class="mestre-lista">
              {#each planta.formaPreparo as forma, i}
                <div class="mestre-item">
                  <span>{forma.metodoPreparo?.descricaoMetodo || ''} {forma.tipo} </span>
                  <div class="mestre-item-botoes">
                    <button class="btn-sub-editar" on:click={() => editarFormaPreparo(forma, i)} title="Editar"
                      >✏️</button
                    >
                    <button class="btn-sub-remover" on:click={() => removerFormaPreparo(i)} title="Remover">🗑️</button>
                  </div>
                </div>
              {:else}
                <p>Nenhuma forma de preparo cadastrada.</p>
              {/each}
            </div>
            <button class="btn-adicionar-ref" on:click={adicionarFormaPreparo}> + Nova Forma de Preparo </button>
          {:else}
            <label for="formaTipo">Tipo:</label>
            <select id="formaTipo" bind:value={itemEmEdicao.tipo}>
              <option value="CASEIRA">Caseira</option>
              <option value="FARMACEUTICA">Farmacêutica</option>
            </select>

            {#if itemEmEdicao.tipo === 'CASEIRA'}
              <label for="formaParte">Parte da Planta:</label>
              <input id="formaParte" type="text" bind:value={itemEmEdicao.partePlantaCaseiro} />
              <label for="formaPosologia">Posologia (Caseira):</label>
              <!-- svelte-ignore element_invalid_self_closing_tag -->
              <textarea id="formaPosologia" bind:value={itemEmEdicao.posologiaCaseiro} />
            {:else}
              <label for="formaComp">Composição/Concentração:</label>
              <input id="formaComp" type="text" bind:value={itemEmEdicao.composicaoConcentracao} />
              <label for="formaRename">Tem na RENAME?</label>
              <select id="formaRename" bind:value={itemEmEdicao.tem_rename}>
                <option value="NAO">Não</option>
                <option value="SIM">Sim</option>
              </select>
            {/if}

            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>Referências:</label>
            {#each refsEmEdicao as ref, i}
              <div class="ref-editor-item">
                <input type="text" bind:value={refsEmEdicao[i]} />
                <button class="btn-remover-ref" on:click={() => removerReferencia(i)} title="Remover Referência"
                  >🗑️</button
                >
              </div>
            {/each}
            <button class="btn-adicionar-ref" on:click={adicionarReferencia}>+ Adicionar Referência</button>

            <div class="modal-sub-footer">
              <button class="btn-sub-cancelar" on:click={cancelarItemEdicao}>Cancelar Edição</button>
              <button class="btn-sub-salvar" on:click={salvarItemFormaPreparo}>Salvar Item</button>
            </div>
          {/if}
        </div>
      {/if}

      {#if modalAberto === 'estudos'}
        <div class="modal-body">
          <label for="estudosResumo">Resumo Geral dos Trabalhos:</label>
          <!-- svelte-ignore element_invalid_self_closing_tag -->
          <textarea id="estudosResumo" bind:value={planta.resumoTrabalhos} />

          {#if itemEmEdicao === null}
            <div class="mestre-lista">
              {#each planta.estudosPorPlanta as estudo, i}
                <div class="mestre-item">
                  <span>{estudo.estudoCientifico.tituloResumo || 'Estudo sem título'}</span>
                  <div class="mestre-item-botoes">
                    <button class="btn-sub-editar" on:click={() => editarEstudo(estudo, i)} title="Editar">✏️</button>
                    <button class="btn-sub-remover" on:click={() => removerEstudo(i)} title="Remover">🗑️</button>
                  </div>
                </div>
              {:else}
                <p>Nenhum estudo cadastrado.</p>
              {/each}
            </div>
            <button class="btn-adicionar-ref" on:click={adicionarEstudo}> + Novo Estudo </button>
          {:else}
            <label for="estudoTitulo">Título/Resumo:</label>
            <input id="estudoTitulo" type="text" bind:value={itemEmEdicao.estudoCientifico.tituloResumo} />

            <label for="estudoResumo">Resumo Completo:</label>
            <!-- svelte-ignore element_invalid_self_closing_tag -->
            <textarea id="estudoResumo" bind:value={itemEmEdicao.estudoCientifico.resumo} />

            <label for="estudoRefTexto">Referência (Texto):</label>
            <input id="estudoRefTexto" type="text" bind:value={itemEmEdicao.estudoCientifico.referencia} />

            <label for="estudoRefLink">Link da Referência:</label>
            <input id="estudoRefLink" type="text" bind:value={itemEmEdicao.estudoCientifico.linkReferencia} />

            <div class="modal-sub-footer">
              <button class="btn-sub-cancelar" on:click={cancelarItemEdicao}>Cancelar Edição</button>
              <button class="btn-sub-salvar" on:click={salvarItemEstudo}>Salvar Item</button>
            </div>
          {/if}
        </div>
      {/if}

      {#if itemEmEdicao === null || (modalAberto !== 'comoUtilizar' && modalAberto !== 'estudos')}
        <div class="modal-footer">
          <button class="btn-cancel" on:click={() => (modalAberto = null)}>Cancelar</button>
          <button class="btn-save" on:click={handleSave}>SALVAR</button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<Apagar
  aberto={modalDeletar}
  titulo="Apagar Planta"
  mensagem="Tem certeza que deseja apagar essa planta?"
  onConfirmar={onDeletarPlanta}
  onFechar={() => (modalDeletar = false)}
/>

<style>
  /* --- Estilos Anteriores (sem mudança) --- */
  .topContainer {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .topContainer div img {
    width: 100%;
  }

  .imagemContainer {
    position: relative;
    display: flex;
    width: 65%;
  }

  .imagemContainer span {
    position: absolute;
    background-color: #f9f6ee;
    right: 0px;
    bottom: 0px;
    display: flex;
    justify-items: center;
    align-items: center;
    padding: 5px;
    border-radius: 100%;
  }

  .topContainer .trash {
    position: absolute;
    right: 10px;
    top: 10px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .imagem {
    display: block;
    margin: 7px 0;
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
    padding-bottom: 30px;
  }
  .edit-section {
    position: relative;
  }
  .edit-btn {
    position: absolute;
    top: 11px;
    right: 50px;
    border-style: none;
    border-radius: 50%;
    cursor: pointer;
  }
  .edit-btn:hover {
    background: #e0e0e0;
  }

  /* --- Estilos do Modal (sem mudança) --- */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    position: fixed;
    top: 29.5%;
    left: 29.5%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 8px;
    border-radius: 10px;
    z-index: 100;
    width: 55.7%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    max-height: 85vh;
  }
  .modal-header {
    margin-top: 0;

    border-bottom: 1px solid #eee;
  }

  .modal-body input[type='text'],
  .modal-body textarea,
  .modal-body select {
    width: 100%;
    padding: 4.5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-family: inherit;
    font-size: 1.03rem;
  }

  .modal-footer {
    padding-top: 5px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
  }
  .modal-footer button {
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-weight: bold;
  }
  .modal-footer .btn-cancel {
    background-color: #f1f1f1;
    margin-right: 10px;
  }
  .modal-footer .btn-save {
    background-color: rgb(53, 65, 40);
    color: white;
  }

  .btn-remover-ref {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
  }

  .btn-adicionar-ref {
    background-color: rgb(53, 65, 40);
    border: none;
    border-radius: 5px;

    cursor: pointer;

    width: 100%;
    font-weight: bold;
  }

  .mestre-lista {
    border: 1px solid #ddd;
    border-radius: 5px;
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 10px;
  }
  .mestre-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  .mestre-item:last-child {
    border-bottom: none;
  }
  .mestre-item span {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 10px;
  }
  /* Estilo dos botões de ícone Mestre-Detalhe */
  .mestre-item-botoes button {
    margin-left: 5px;
    padding: 0; /* Removido padding */
    font-size: 1rem; /* Tamanho do ícone */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 30px; /* Largura fixa */
    height: 30px; /* Altura fixa */
    line-height: 30px; /* Centralizar ícone */
    text-align: center;
  }
  .btn-sub-editar {
    background-color: #2196f3; /* Azul */
    color: white;
  }
  .btn-sub-remover {
    background-color: #f44336; /* Vermelho */
    color: white;
  }

  /* Rodapé do formulário de sub-edição */
  .modal-sub-footer {
    margin-top: 25px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
  }
  .modal-sub-footer button {
    padding: 0px 8px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-weight: bold;
  }
  .btn-sub-cancelar {
    background-color: #f1f1f1;
    margin-right: 10px;
  }
  .btn-sub-salvar {
    background-color: #4caf50; /* Verde */
    color: white;
  }
  .checkbox-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .checkbox-container label {
    font-size: 14px;
  }

  .checkbox-container label input {
    margin-right: 5px;
  }
</style>
