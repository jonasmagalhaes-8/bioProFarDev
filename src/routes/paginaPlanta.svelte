<script lang="ts">
  import { onMount } from 'svelte'
  import { goto, params, url } from '@roxi/routify'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import {
    controllerAtualizarImagem,
    controllerAtualizarPlanta,
    controllerDeletarPorId,
    controllerObterPlantaPorID,
    controllerFavoritarPlanta, // Adicionado
  } from '@/controllers/plantaController'
  import BarraTopo from '@/components/BarraTopo.svelte'
  import Accordion from '@/components/Accordion.svelte'
  import { getPrefix } from '@/util/obterPrefixoTipoImagem'
  import { FormaPreparo } from '@/models/FormaPreparo'
  import { Planta } from '@/models/Planta'
  import { EstudosPorPlanta } from '@/models/EstudosPorPlanta'
  // IMPORTANTE: Importar o novo Model
  import { IndicacaoPlantaModel } from '@/models/IndicacaoPlantaModel'
  import { usuarioStore } from '@/store'
  import { LucideEdit3, LucideTrash, LucidePlus, LucideCheck, LucideStar } from '@lucide/svelte' // Adicionado LucideStar
  import Input from '@/components/Input.svelte'
  import MultiSelectDropdown from '@/components/MultiSelectDropdown.svelte'
  import { controllerListagemIndicacoesUso } from '@/controllers/indicacoesUsoController'
  import { controllerListagemModosPreparo } from '@/controllers/modoPreparoController'
  import { IndicacaoUso } from '@/models/IndicacaoUso'
  import { MetodoPreparo } from '@/models/MetodoPreparo'
  import Apagar from '@/components/Apagar.svelte'
  import { toast } from '@zerodevx/svelte-toast'
  import { get } from 'svelte/store'

  let irPara: any
  $: irPara = $goto

  const idPlanta: number = $params.id
  const origemListagemRename: string = $params.rename
  const idIndicacaoUso: string = $params.idIndicacaoUso
  const idModoPreparo: string = $params.idModoPreparo

  let indicacoes: IndicacaoUso[] = []
  let modosPreparo: MetodoPreparo[] = []

  // Variável temporária para controlar o MultiSelectDropdown
  // O Dropdown seleciona 'Indicações', mas a planta salva 'IndicacaoPlantaModel'
  let indicacoesSelecionadasDropdown: number[] = []

  let planta: Planta = new Planta()
  let plantaReferencia: Planta = new Planta()

  let fileInput: HTMLInputElement

  // --- ESTADO DO MODAL ---
  let modalAberto: 'nomes' | 'indicacao' | 'contraindicacao' | 'efeitos' | 'estudos' | 'comoUtilizar' | null = null
  let refsEmEdicao: string[] = []
  let itemEmEdicao: any = null
  let indexEmEdicao: number | null = null

  let modalDeletar = false

  // Sub-modais para adicionar/editar
  let modalComoUtilizarAdicionar = false
  let modalEstudosCientificoAdicionar = false

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

  function processarMultiplasReferencias(campoReferencia: string | null, titulo: string = 'Referência') {
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

  // --- DECLARAÇÕES REATIVAS ($:) ---
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
  // filhosEstudos e filhosComoUtilizar foram removidos, pois agora são páginas separadas

  // --- LÓGICA DE MONTAGEM E AÇÕES ---

  async function loadPlanta() {
    planta = await controllerObterPlantaPorID(idPlanta, $usuarioStore.idUsuario)
    // Deep Clone simples para garantir que referências nested não sejam alteradas diretamente
    plantaReferencia = JSON.parse(JSON.stringify(planta))
  }

  let imagem: File | undefined
  let imagemPreview: string = ''

  onMount(async () => {
    const usuarioStorage = localStorage.getItem('usuario')

    if (usuarioStorage != null && usuarioStorage == '') {
      usuarioStore.set(JSON.parse(usuarioStorage))
    }

    await loadPlanta()
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
  })

  // --- NOVA FUNÇÃO DE FAVORITAR ---
  async function toggleFavorito() {
    const usuarioLogado = get(usuarioStore)

    // Se não estiver logado, pergunta se deseja ir para o login
    if (!usuarioLogado?.idUsuario) {
      const desejaLogar = confirm(
        'Funcionalidade disponível apenas para usuários logados, deseja ser redirecionado para fazer login ou cadastrar-se?',
      )
      if (desejaLogar) {
        irPara('/login')
      }
      return
    }

    // Lógica original de favoritar
    planta.plantaFavoritadaUsuario = !planta.plantaFavoritadaUsuario
    planta = planta

    try {
      await controllerFavoritarPlanta(planta.idPlanta, usuarioLogado.idUsuario)
    } catch (error) {
      planta.plantaFavoritadaUsuario = !planta.plantaFavoritadaUsuario
      planta = planta
      alert('Erro ao atualizar favorito: ' + error.message)
    }
  }

  function abrirModal(tipo: 'nomes' | 'indicacao' | 'contraindicacao' | 'efeitos' | 'estudos' | 'comoUtilizar' | null) {
    modalAberto = tipo
    itemEmEdicao = null
    indexEmEdicao = null

    switch (tipo) {
      case 'indicacao':
        if (planta.indicacoesPlanta && planta.indicacoesPlanta.length > 0) {
          indicacoesSelecionadasDropdown = planta.indicacoesPlanta?.map((ip) => ip.indicacaoUso.idIndicacaoUso) ?? []
        } else {
          indicacoesSelecionadasDropdown = []
        }
        break

      case 'contraindicacao':
        refsEmEdicao = (planta.referenciaContraIndicacao || '').split('|').filter((ref) => ref.trim() !== '')
        break
      case 'efeitos':
        refsEmEdicao = (planta.referenciaEfeitosAdversos || '').split('|').filter((ref) => ref.trim() !== '')
        break
      case 'estudos':
        break
      case 'comoUtilizar':
        break
      default:
        refsEmEdicao = []
        break
    }
  }

  // ... (Funções de referências e formas de preparo mantidas iguais) ...
  function adicionarReferencia() {
    refsEmEdicao = [...refsEmEdicao, '']
  }
  function removerReferencia(index: number) {
    refsEmEdicao = refsEmEdicao.filter((_, i) => i !== index)
  }

  function editarFormaPreparo(forma: FormaPreparo, index: number) {
    itemEmEdicao = { ...forma, referencias: (forma.referencia || '').split('|').filter((ref) => ref.trim() !== '') }
    indexEmEdicao = index
    modalComoUtilizarAdicionar = true
  }

  function adicionarFormaPreparo() {
    itemEmEdicao = {
      ...new FormaPreparo(),
      tipo: 'CASEIRA',
      metodoPreparo: new MetodoPreparo(),
      referencias: [''],
    }
    itemEmEdicao.metodoPreparo.idMetodoPreparo = null
    indexEmEdicao = -1
    modalComoUtilizarAdicionar = true
  }

  function removerFormaPreparo(index: number) {
    if (confirm('Tem certeza que deseja remover esta forma de preparo?')) {
      planta.formaPreparo = planta.formaPreparo.filter((_, i) => i !== index)
    }
  }

  function salvarItemFormaPreparo() {
    itemEmEdicao.referencia = itemEmEdicao.referencias.filter((ref) => ref.trim() !== '').join('|')

    const { referencias, ...formaPreparoSemReferencias } = itemEmEdicao

    if (indexEmEdicao === -1) {
      planta.formaPreparo = [...planta.formaPreparo, formaPreparoSemReferencias]
    } else {
      const listaAtualizada = [...planta.formaPreparo]
      listaAtualizada[indexEmEdicao] = formaPreparoSemReferencias
      planta.formaPreparo = listaAtualizada
    }
    itemEmEdicao = null
    indexEmEdicao = null
    modalComoUtilizarAdicionar = false
  }

  function editarEstudo(estudo: EstudosPorPlanta, index: number) {
    itemEmEdicao = {
      ...estudo,
      estudoCientifico: { ...estudo.estudoCientifico },
    }
    indexEmEdicao = index
    modalEstudosCientificoAdicionar = true
  }

  function adicionarEstudo() {
    itemEmEdicao = {
      planta: { idPlanta: planta.idPlanta },
      estudoCientifico: {
        tituloResumo: '',
        resumo: '',
        referencia: '',
        linkReferencia: '',
      },
    }
    indexEmEdicao = -1
    modalEstudosCientificoAdicionar = true
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
    modalEstudosCientificoAdicionar = false
  }

  function cancelarItemEdicao() {
    itemEmEdicao = null
    indexEmEdicao = null
    refsEmEdicao = []
    modalComoUtilizarAdicionar = false
    modalEstudosCientificoAdicionar = false
  }

  async function onCancelar() {
    switch (modalAberto) {
      case 'nomes':
        // Reverter campos simples
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
        // Reverter listas
        planta.indicacao = plantaReferencia.indicacao
        // Fazendo um parse/stringify para garantir nova referencia
        planta.indicacoesPlanta = JSON.parse(JSON.stringify(plantaReferencia.indicacoesPlanta))
        break
      case 'contraindicacao':
        planta.contraIndicacao = plantaReferencia.contraIndicacao
        planta.referenciaContraIndicacao = plantaReferencia.referenciaContraIndicacao
        break
      case 'efeitos':
        planta.efeitosAdversos = plantaReferencia.efeitosAdversos
        planta.referenciaEfeitosAdversos = plantaReferencia.referenciaEfeitosAdversos
        break
      case 'estudos':
        planta.estudosPorPlanta = JSON.parse(JSON.stringify(plantaReferencia.estudosPorPlanta))
        break
      case 'comoUtilizar':
        planta.formaPreparo = JSON.parse(JSON.stringify(plantaReferencia.formaPreparo))
        break
      default:
        break
    }

    modalAberto = null
  }

  function openFilePicker() {
    if (!$usuarioStore || !$usuarioStore.usuarioAdmin) return
    fileInput.click()
  }

  async function mudarImagemPlanta(e: Event & { currentTarget: HTMLInputElement }) {
    if (!e.currentTarget.files || e.currentTarget.files.length < 1) return

    imagem = e.currentTarget.files[0]

    if (imagemPreview) {
      URL.revokeObjectURL(imagemPreview)
    }

    imagemPreview = URL.createObjectURL(imagem)
  }

  // --- Função Principal de SALVAR ---
  async function handleSave() {
    if (!planta) return

    // Tratamento específico por modal antes de fechar
    if (modalAberto === 'contraindicacao') {
      planta.referenciaContraIndicacao = refsEmEdicao.filter((ref) => ref.trim() !== '').join('|')
    } else if (modalAberto === 'efeitos') {
      planta.referenciaEfeitosAdversos = refsEmEdicao.filter((ref) => ref.trim() !== '').join('|')
    } else if (modalAberto === 'indicacao') {
      // CONVERSÃO INVERSA: Lista Simples do Dropdown -> Modelo Complexo para o Backend
      // Mapeia o array de IndicacaoUso selecionadas para IndicacaoPlantaModel
      planta.indicacoesPlanta = indicacoesSelecionadasDropdown.map((idIndicacao) => {
        const existente = plantaReferencia.indicacoesPlanta?.find(
          (ip) => ip.indicacaoUso.idIndicacaoUso === idIndicacao,
        )

        if (existente) return existente

        const indicacaoUso = indicacoes.find((i) => i.idIndicacaoUso === idIndicacao)

        const nova = new IndicacaoPlantaModel()
        nova.indicacaoUso = indicacaoUso!
        return nova
      })
    }

    modalAberto = null
    itemEmEdicao = null
    indexEmEdicao = null
    refsEmEdicao = []
  }

  async function salvarTudo() {
    try {
      await controllerAtualizarPlanta(planta)
      if (imagem) {
        await controllerAtualizarImagem(planta.idPlanta, imagem)
      }
      // Atualiza a referência após salvar com sucesso
      plantaReferencia = JSON.parse(JSON.stringify(planta))
      alert('Planta salva com sucesso!')
    } catch (error) {
      alert(error.message)
    }
  }

  // ... (onDeletarPlanta mantido igual) ...
  async function onDeletarPlanta() {
    try {
      await controllerDeletarPorId(idPlanta)

      if (idIndicacaoUso && idIndicacaoUso !== 'null') {
        irPara('/plantasIndicacao', { idIndicacaoUso })
      } else if (idModoPreparo && idModoPreparo !== 'null') {
        irPara('/modo-preparo', { id: idModoPreparo })
      } else if (origemListagemRename !== 'null') {
        const valorRename = origemListagemRename ? origemListagemRename.toString() : 'true'
        irPara('/listagemplantas', { rename: valorRename })
      } else {
        irPara('/favoritos')
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
        : origemListagemRename != 'null'
          ? $url('/listagemplantas', { rename: origemListagemRename.toString() })
          : $url('/favoritos')}
  />
</BarraTopo>

<div class="topContainer">
  <div
    class="imagemContainer"
    on:click={openFilePicker}
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key == 'Enter' && openFilePicker()}
  >
    {#if imagemPreview}
      <img src={imagemPreview} alt="Pré-visualização da imagem" class="imagem" />
    {:else if planta.imagemBase64 && planta.imagemBase64.trim() !== ''}
      <img class="imagem" src={getPrefix(planta.imagemBase64) + planta.imagemBase64} alt={planta.nome} />
    {:else}
      <img class="imagem" src="/img/placeholder-planta.png" alt="Carregando Imagem..." />
    {/if}

    {#if $usuarioStore && $usuarioStore.usuarioAdmin}
      <span>
        <LucideEdit3 />
      </span>
    {/if}
    <input
      type="file"
      accept="image/jpeg,image/png,image/bmp,image/gif,.jpg,.jpeg,.png,.bmp,.gif"
      bind:this={fileInput}
      on:change={mudarImagemPlanta}
      hidden
    />
  </div>

  {#if !modalAberto}
    <div class="top-actions">
      <div class="action-btn" on:click={toggleFavorito} title="Favoritar">
        <LucideStar
          color={planta.plantaFavoritadaUsuario ? '#FFD700' : '#808080'}
          fill={planta.plantaFavoritadaUsuario ? '#FFD700' : 'none'}
        />
      </div>

      {#if $usuarioStore && $usuarioStore.usuarioAdmin}
        <div class="action-btn" on:click={() => (modalDeletar = true)} title="Apagar Planta">
          <LucideTrash color="#FF5555" />
        </div>
      {/if}
    </div>
  {/if}
</div>

<div class="container">
  <div class="edit-section">
    <Accordion
      titulo="Sobre a Planta"
      texto={`Nome(s) popular(es): ${planta.nomesPopulares?.trim() || 'Não informado'}
    <br>Nome Científico: ${planta.nomeCientifico?.trim() || 'Não informado'}
    <br>Sinonímia: ${planta.sinonimia?.trim() || 'Não informado'}`}
      filhos={filhosOutrosNomes}
    />
    {#if $usuarioStore && $usuarioStore?.usuarioAdmin}
      <div class="edit-btn" on:click={() => abrirModal('nomes')}><LucideEdit3 color="black" size={24.5} /></div>
    {/if}
  </div>

  <div class="edit-section">
    <Accordion titulo="Indicação de Uso" texto={planta.indicacao} />
    {#if $usuarioStore && $usuarioStore?.usuarioAdmin}
      <div class="edit-btn" on:click={() => abrirModal('indicacao')}><LucideEdit3 color="black" size={24.5} /></div>
    {/if}
  </div>

  <div class="edit-section">
    <Accordion titulo="Contraindicação" texto={planta.contraIndicacao} filhos={filhosContraIndicacao} />
    {#if $usuarioStore && $usuarioStore?.usuarioAdmin}
      <div class="edit-btn" on:click={() => abrirModal('contraindicacao')}>
        <LucideEdit3 color="black" size={24.5} />
      </div>
    {/if}
  </div>

  <div class="edit-section">
    <Accordion titulo="Efeitos Adversos" texto={planta.efeitosAdversos} filhos={filhosEfeitosAdversos} />
    {#if $usuarioStore && $usuarioStore?.usuarioAdmin}
      <div class="edit-btn" on:click={() => abrirModal('efeitos')}><LucideEdit3 color="black" size={24.5} /></div>
    {/if}
  </div>

  <div class="edit-section">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="link-pagina" on:click={() => irPara('/planta-como-utilizar', { id: planta.idPlanta })}>
      <span class="tituloAccordion">Como utilizar?</span>
      <span class="arrow">&rarr;</span>
    </div>
    {#if $usuarioStore && $usuarioStore?.usuarioAdmin}
      <div class="edit-btn" on:click={() => abrirModal('comoUtilizar')}><LucideEdit3 color="black" size={24.5} /></div>
    {/if}
  </div>

  <div class="edit-section">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="link-pagina" on:click={() => irPara('/planta-estudos-cientificos', { id: planta.idPlanta })}>
      <span class="tituloAccordion">Estudos Científicos</span>
      <span class="arrow">&rarr;</span>
    </div>
    {#if $usuarioStore?.usuarioAdmin}
      <div class="edit-btn" on:click={() => abrirModal('estudos')}><LucideEdit3 color="black" size={24.5} /></div>
    {/if}
  </div>
</div>

{#if modalAberto}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal" on:click={onCancelar}>
    <div
      style={modalAberto == 'indicacao' && 'overflow: visible'}
      class="modal-content"
      on:click={(e) => e.stopPropagation()}
    >
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

          <div class="checkbox-container">
            <div class="checkbox-container">
              <label for="rename"
                ><input
                  type="checkbox"
                  name="rename"
                  id="rename"
                  checked={planta.constaRename == 'SIM'}
                  on:change={(e) => {
                    const { checked } = e.target as HTMLInputElement
                    if (checked) planta.constaRename = 'SIM'
                    else planta.constaRename = 'NÃO'
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
                    if (checked) planta.constaRenisus = 'SIM'
                    else planta.constaRenisus = 'NÃO'
                  }}
                />ReniSUS</label
              >
            </div>
          </div>
        </div>
      {/if}

      {#if modalAberto === 'indicacao'}
        <div class="modal-body">
          <label for="indicacaoTxt">Indicação:</label>
          <Input
            keyboardType="default"
            placeholder="Resumo de Indicações"
            bind:value={planta.indicacao}
            style="margin-bottom: 10px;"
          />
          <MultiSelectDropdown
            options={indicacoes.map((indicacao) => ({
              id: indicacao.idIndicacaoUso,
              value: indicacao.nomeIndicacao,
            }))}
            bind:selected={indicacoesSelecionadasDropdown}
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
        <div class="modal-body">
          <label for="efeitosAdversos">Efeitos Adversos:</label>
          <Input keyboardType="default" bind:value={planta.efeitosAdversos} />
          <label for="efeitosadversosreferencias">Referências:</label>
          {#each refsEmEdicao as referencia, index}
            <Input keyboardType="default" bind:value={refsEmEdicao[index]} />
            {#if refsEmEdicao.length > 1}
              <div>
                <button class="btn-remover-ref" on:click={() => removerReferencia(index)} title="Remover Referência"
                  ><LucideTrash /></button
                >
              </div>
            {/if}
          {/each}
          <button class="btn-adicionar-ref" on:click={adicionarReferencia}>+ Adicionar Referência</button>
        </div>
      {/if}

      {#if modalAberto === 'comoUtilizar'}
        <div class="modal-body">
          {#each planta.formaPreparo as forma, i}
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 8px;">
              <h4>{forma.metodoPreparo?.descricaoMetodo || forma.tipo}</h4>
              <p><strong>Tipo:</strong> {forma.tipo}</p>
              {#if forma.tipo === 'CASEIRA'}
                <p><strong>Parte da Planta:</strong> {forma.partePlantaCaseiro || 'Não informado'}</p>
                <p><strong>Posologia:</strong> {forma.posologiaCaseiro || 'Não informado'}</p>
              {:else}
                <p><strong>Composição:</strong> {forma.composicaoConcentracao || 'Não informado'}</p>
                <p><strong>RENAME:</strong> {forma.constaRename || 'Não informado'}</p>
              {/if}
              <div style="display: flex; justify-content: end;">
                <button class="btn-editar-item" on:click={() => editarFormaPreparo(forma, i)}>Editar</button>
                <button class="btn-remover-item" on:click={() => removerFormaPreparo(i)}>Remover</button>
              </div>
            </div>
          {:else}
            <p>Nenhuma forma de preparo cadastrada.</p>
          {/each}
          <button class="btn-adicionar-ref" on:click={adicionarFormaPreparo}>+ Nova Forma de Preparo</button>
        </div>
      {/if}

      {#if modalAberto === 'estudos'}
        <div class="modal-body">
          <label for="estudosResumo">Resumo Geral dos Trabalhos:</label>
          <textarea
            id="estudosResumo"
            bind:value={planta.resumoTrabalhos}
            style="width: 100%; min-height: 80px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit;"
          ></textarea>

          {#each planta.estudosPorPlanta as estudo, i}
            <div
              style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; margin-top: 10px; border-radius: 8px;"
            >
              <h4>{estudo.estudoCientifico.tituloResumo || 'Estudo sem título'}</h4>
              <p>{estudo.estudoCientifico.resumo}</p>
              <p><strong>Referência:</strong> {estudo.estudoCientifico.referencia}</p>
              {#if estudo.estudoCientifico.linkReferencia}
                <p>
                  <strong>Link:</strong>
                  <a
                    href={estudo.estudoCientifico.linkReferencia.startsWith('http')
                      ? estudo.estudoCientifico.linkReferencia
                      : `https://${estudo.estudoCientifico.linkReferencia}`}
                    target="_blank">{estudo.estudoCientifico.linkReferencia}</a
                  >
                </p>
              {/if}
              <div style="display: flex; justify-content: end;">
                <button class="btn-editar-item" on:click={() => editarEstudo(estudo, i)}>Editar</button>
                <button class="btn-remover-item" on:click={() => removerEstudo(i)}>Remover</button>
              </div>
            </div>
          {:else}
            <p>Nenhum estudo cadastrado.</p>
          {/each}
          <button class="btn-adicionar-ref" on:click={adicionarEstudo}>+ Novo Estudo</button>
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

{#if modalComoUtilizarAdicionar && itemEmEdicao}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal" on:click={() => cancelarItemEdicao()}>
    <div class="modal-content" on:click={(e) => e.stopPropagation()}>
      <h3>{indexEmEdicao === -1 ? 'Nova Forma de Preparo' : 'Editar Forma de Preparo'}</h3>

      <label for="tipoComoUtilizar">Tipo:</label>
      <select name="tipoComoUtilizar" id="tipoComoUtilizar" bind:value={itemEmEdicao.tipo}>
        <option value="CASEIRA">CASEIRA</option>
        <option value="FARMACEUTICA">FARMACÊUTICA</option>
      </select>

      <label for="metodoPreparo">Método de Preparo:</label>
      <select name="metodoPreparo" id="metodoPreparo" bind:value={itemEmEdicao.metodoPreparo} style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ccc; font-size: 16px; background-color: white;">
        <option value={null} disabled selected>Selecione o método de preparo</option>
        {#each modosPreparo.filter((m) => {
          const t = m.tipo ? m.tipo.trim().toUpperCase() : ''
          if (itemEmEdicao.tipo === 'CASEIRA') {
            return t === 'CASEIRA' || t === 'CASEIRO' || t === ''
          } else {
            return t.includes('FARMAC') || t === ''
          }
        }) as metodo}
          <option value={metodo}>{metodo.descricaoMetodo}</option>
        {/each}
      </select>

      {#if itemEmEdicao.tipo === 'CASEIRA'}
        <div>
          <label for="parteDaPlanta">Parte da Planta:</label>
          <Input keyboardType="default" bind:value={itemEmEdicao.partePlantaCaseiro} />
        </div>
      {:else}
        <div>
          <label for="composicaoEConcentracao">Composição/Concentração:</label>
          <Input keyboardType="default" bind:value={itemEmEdicao.composicaoConcentracao} />

          <label for="temNaRename">Tem na Rename?</label>
          <select name="temNaRename" id="temNaRename" bind:value={itemEmEdicao.tem_rename}>
            <option value="SIM">SIM</option>
            <option value="NAO">NÃO</option>
          </select>
        </div>
      {/if}

      <label for="posologia">Posologia:</label>
      <Input keyboardType="default" bind:value={itemEmEdicao.posologiaCaseiro} />

      <label for="referenciasFormaPreparo">Referências:</label>
      <div class="referenciaContainer">
        {#each itemEmEdicao.referencias as referencia, index}
          <Input keyboardType="default" bind:value={itemEmEdicao.referencias[index]} />
          {#if itemEmEdicao.referencias.length > 1}
            <div>
              <button
                class="btn-remover-ref-modal"
                on:click={() => (itemEmEdicao.referencias = itemEmEdicao.referencias.filter((_, i) => i !== index))}
              >
                Remover referência
              </button>
            </div>
          {/if}
        {/each}
      </div>

      <div class="referenciaBotoes">
        <div>
          <button
            class="referenciaBotao"
            on:click={() => (itemEmEdicao.referencias = [...itemEmEdicao.referencias, ''])}
          >
            <LucidePlus />
          </button>
          <button class="referenciaBotao" on:click={salvarItemFormaPreparo}>
            <LucideCheck />
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if modalEstudosCientificoAdicionar && itemEmEdicao}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal" on:click={() => cancelarItemEdicao()}>
    <div class="modal-content" on:click={(e) => e.stopPropagation()}>
      <h3>{indexEmEdicao === -1 ? 'Novo Estudo' : 'Editar Estudo'}</h3>

      <label for="tituloResumo">Título/Resumo:</label>
      <Input keyboardType="default" bind:value={itemEmEdicao.estudoCientifico.tituloResumo} />

      <label for="detalhesEstudo">Resumo Completo:</label>
      <textarea
        id="detalhesEstudo"
        bind:value={itemEmEdicao.estudoCientifico.resumo}
        style="width: 100%; min-height: 100px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit;"
      ></textarea>

      <label for="referenciaEstudo">Referência (Texto):</label>
      <Input keyboardType="default" bind:value={itemEmEdicao.estudoCientifico.referencia} />

      <label for="linkReferencia">Link da Referência:</label>
      <Input keyboardType="default" bind:value={itemEmEdicao.estudoCientifico.linkReferencia} />

      <div class="referenciaBotoes">
        <div>
          <button class="referenciaBotao" on:click={salvarItemEstudo}>
            <LucideCheck />
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if $usuarioStore && $usuarioStore?.usuarioAdmin}
  <div style="display:  flex; justify-content: end;">
    <button style="margin-right: 20px;" on:click={salvarTudo}>Salvar Alterações</button>
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
    width: 88%;
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

  /* NOVO CSS PARA O GRUPO DE AÇÕES (LIXEIRA E ESTRELA) */
  .top-actions {
    position: absolute;
    right: 10px;
    top: 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 10;
  }

  .action-btn {
    background: rgba(255, 255, 255, 0.85); /* Fundo sutil para melhor leitura sobre imagens */
    border-radius: 50%;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.2s,
      background-color 0.2s;
  }

  .action-btn:hover {
    transform: scale(1.1);
    background: white;
  }

  /* Removemos o estilo antigo .topContainer .trash e substituímos pela classe acima */

  .imagem {
    display: block;
    margin: 7px 0;
    width: 88%;
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
    padding-bottom: 7.5px;
  }
  .edit-section {
    position: relative;
  }
  .edit-btn {
    position: absolute;
    top: 6.5px;
    right: 50px;
    border-style: none;
    border-radius: 50%;
    cursor: pointer;
  }
  .edit-btn:hover {
    background: #e0e0e0;
  }

  /* --- Estilos do Modal Principal --- */

  .modal-body textarea,
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
    padding: 8px 16px;
  }

  .modal-footer .btn-cancel {
    background-color: #f1f1f1;
    margin-right: 10px;
  }

  .modal-footer .btn-save {
    background: #a3b18a;
    color: white;
  }

  .link-pagina {
    background: rgba(255, 255, 255, 0.6);
    border-radius: 15px;
    margin-top: 12.5px;
    margin-right: 6.5px;
    padding: 8.5px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    flex: 1;
    gap: 1rem;
    transition: all 0.3s ease;
  }

  .link-pagina:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateY(-1px);
  }

  .link-pagina .tituloAccordion {
    font-size: 2vh;
    color: #354128;
    font-weight: 700;
  }

  .link-pagina .arrow {
    min-width: 24px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5vh;
    color: #354128;
    font-weight: bold;
  }

  /* --- Estilos do Sub-Modal (NOVO) --- */
  .modal {
    position: fixed;
    top: 10px;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    padding-top: 20px;
    /* Centralização Universal */
    display: flex;
    justify-content: center;
    align-items: flex-start;
    z-index: 9999; /* Garante que fique acima de tudo */
  }

  .modal-content {
    /* Remova position: fixed, top, left e transform daqui */
    background: white;
    padding: 16px;
    border-radius: 10px;

    /* Largura responsiva */
    width: 90%;
    max-width: 500px; /* Ajuste conforme seu design original (55.7%) */

    /* Altura e Scroll */
    max-height: 100vh;
    overflow-y: auto; /* Só mostra scroll se o conteúdo for maior que a tela */
    -webkit-overflow-scrolling: touch; /* Suavidade no iOS */

    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  .referenciaContainer {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .referenciaBotoes {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin-top: 15px;
  }

  .referenciaBotoes div {
    display: flex;
    gap: 10px;
  }

  .referenciaBotao {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #7a8863;
    color: white;
    padding: 8px 15px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
  }

  .referenciaBotao:hover {
    background-color: #6a7553;
  }

  /* --- Botões de Ação nos Itens --- */
  .btn-editar-item,
  .btn-remover-item {
    padding: 6px 12px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    margin-right: 8px;
  }

  .btn-editar-item {
    background-color: #2196f3;
    color: white;
  }

  .btn-editar-item:hover {
    background-color: #1976d2;
  }

  .btn-remover-item {
    background-color: #f44336;
    color: white;
  }

  .btn-remover-item:hover {
    background-color: #d32f2f;
  }

  .btn-remover-ref {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    padding: 6px 12px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .btn-remover-ref:hover {
    background-color: #d32f2f;
  }

  .btn-remover-ref-modal {
    background-color: #f44336;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 5px;
  }

  .btn-remover-ref-modal:hover {
    background-color: #d32f2f;
  }

  .btn-adicionar-ref {
    background-color: rgb(53, 65, 40);
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    width: 100%;
    font-weight: bold;
    padding: 10px;
    margin-top: 10px;
  }

  .btn-adicionar-ref:hover {
    background-color: rgb(43, 55, 30);
  }

  .checkbox-container {
    display: flex;
    gap: 10px;
    flex-direction: row;
    align-items: center;
  }

  .checkbox-container label {
    font-size: 14px;
  }

  .checkbox-container label input {
    margin-right: 5px;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
