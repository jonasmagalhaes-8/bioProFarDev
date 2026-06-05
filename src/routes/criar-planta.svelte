<script lang="ts">
  import BarraTopo from '@/components/BarraTopo.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import Input from '@/components/Input.svelte'
  import { controllerListagemIndicacoesUso } from '@/controllers/indicacoesUsoController'
  import { Planta } from '@/models/Planta'
  import { LucideCheck, LucidePlus, LucideUpload } from '@lucide/svelte'
  import { goto, params } from '@roxi/routify'
  import { onMount } from 'svelte'
  import { IndicacaoUso } from '@/models/IndicacaoUso'
  import { MetodoPreparo } from '@/models/MetodoPreparo'
  import { controllerListagemModosPreparo } from '@/controllers/modoPreparoController'
  import MultiSelectDropdown from '@/components/MultiSelectDropdown.svelte'
  import { FormaPreparo } from '@/models/FormaPreparo'
  import { EstudoCientifico } from '@/models/EstudoCientifico'
  import { controllerCriarPlanta } from '@/controllers/plantaController'
  import { usuarioStore } from '@/store'
  import { IndicacaoPlantaModel } from '@/models/IndicacaoPlantaModel'
  import { toast } from '@zerodevx/svelte-toast'

  let irPara: any
  $: irPara = $goto

  const rename: boolean = $params.rename === 'true'

  let indicacoes: IndicacaoUso[] = []
  let modosPreparo: MetodoPreparo[] = []

  let indicacoesSelecionadasDropdown: IndicacaoUso[] = []

  let planta: Planta = new Planta()

  let previewUrl: string
  let imagem: File

  const onImagemChange = (event: Event) => {
    const input = event.target as HTMLInputElement

    if (!input.files || input.files.length === 0) return

    imagem = input.files[0]

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    previewUrl = URL.createObjectURL(imagem)
  }

  let modalReferenciasContraIndicacoes = false
  let referenciasContraIndicacoes: string[] = ['']

  let modalReferenciasEfeitosAdversos = false
  let referenciasEfeitosAdversos: string[] = ['']

  let modalComoUtilizar = false
  let modalComoUtilizarAdicionar = false
  let formasPreparo: (FormaPreparo & { referencias: string[] })[] = []
  let formaPreparoTemp: FormaPreparo & { referencias: string[] }

  let modalEstudosCientifico = false

  let modalEstudosCientificoAdicionar = false
  let estudosCientifico: EstudoCientifico

  onMount(async () => {
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

  const onCriarPlanta = async () => {
    try {
      planta.indicacoesPlanta = indicacoesSelecionadasDropdown.map((indUso) => {
        const novaRelacao = new IndicacaoPlantaModel()
        novaRelacao.indicacaoUso = indUso
        return novaRelacao
      })

      await controllerCriarPlanta(
        imagem,
        planta,
        referenciasContraIndicacoes,
        referenciasEfeitosAdversos,
        formasPreparo,
        $usuarioStore,
      )

      const valorRename = rename ? rename.toString() : 'true'

      irPara('/listagemplantas', { rename: valorRename })

      toast.push('Planta criada')
    } catch (error) {
      alert(error.message)
    }
  }
</script>

<BarraTopo titulo="Criar Planta">
  <BotaoVoltar destino={`/listagemplantas?rename=${rename}`} />
</BarraTopo>

<main class="main-container">
  <div class="form-content">
    <div class="upload-section">
      <label for="file-upload" class="custom-file-upload">
        <LucideUpload size="20" style="margin-right: 8px;" />
        {imagem ? 'Trocar Imagem' : 'Selecionar Imagem da Planta'}
      </label>

      <input
        id="file-upload"
        type="file"
        accept="image/jpeg,image/png,image/bmp,image/gif,.jpg,.jpeg,.png,.bmp,.gif"
        on:change={onImagemChange}
      />

      <span class="file-name">
        {imagem ? imagem.name : 'Nenhum arquivo selecionado'}
      </span>

      {#if previewUrl}
        <img src={previewUrl} alt="Pré-visualização da imagem" class="preview-img" />
      {/if}
    </div>

    <fieldset>
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
    </fieldset>

    <fieldset>
      <legend>Consta aonde?</legend>

      <div class="checkbox-container">
        <label for="rename"
          ><input
            type="checkbox"
            name="rename"
            id="rename"
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
        <label for="renisus"
          ><input
            type="checkbox"
            name="renisus"
            id="renisus"
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
    </fieldset>

    <fieldset>
      <legend>Indicações</legend>

      <Input
        keyboardType="default"
        placeholder="Resumo de Indicações"
        bind:value={planta.indicacao}
        style="margin-bottom: 10px;"
      />

      <MultiSelectDropdown
        options={indicacoes.map((indicacao) => ({
          id: indicacao,
          value: indicacao.nomeIndicacao,
        }))}
        bind:selected={indicacoesSelecionadasDropdown}
        placeholder="Selecione indicações..."
      />
    </fieldset>

    <fieldset>
      <legend>Contraindicações</legend>

      <Input keyboardType="default" bind:value={planta.contraIndicacao} />

      <label for="contraindicacaoreferencias">Referências:</label>
      <button on:click={() => (modalReferenciasContraIndicacoes = true)}>Abrir Referências</button>
      {#if modalReferenciasContraIndicacoes}
        <div class="modal" on:click={() => (modalReferenciasContraIndicacoes = false)}>
          <div class="modalContent" on:click={(e) => e.stopPropagation()}>
            <div class="referenciaContainer">
              <h4>Referências de Contraindicações</h4>
              {#each referenciasContraIndicacoes as _, index}
                <Input keyboardType="default" bind:value={referenciasContraIndicacoes[index]} />
                {#if referenciasContraIndicacoes.length > 1}
                  <div>
                    <button
                      on:click={() =>
                        (referenciasContraIndicacoes = referenciasContraIndicacoes.filter((_, i) => i !== index))}
                    >
                      Remover referência
                    </button>
                  </div>
                {/if}
              {/each}
            </div>
            <div class="referenciaBotoes">
              <div style="display: flex; gap: 10px;">
                <button
                  class="referenciaBotao"
                  on:click={() => (referenciasContraIndicacoes = [...referenciasContraIndicacoes, ''])}
                >
                  <LucidePlus />
                </button>
                <button class="referenciaBotao" on:click={() => (modalReferenciasContraIndicacoes = false)}>
                  <LucideCheck />
                </button>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </fieldset>

    <fieldset>
      <legend>Efeitos Adversos</legend>

      <Input keyboardType="default" bind:value={planta.efeitosAdversos} />

      <label for="efeitosAdversosReferencias">Referências</label>
      <button on:click={() => (modalReferenciasEfeitosAdversos = true)}>Abrir Referências</button>
      {#if modalReferenciasEfeitosAdversos}
        <div class="modal" on:click={() => (modalReferenciasEfeitosAdversos = false)}>
          <div class="modalContent" on:click={(e) => e.stopPropagation()}>
            <div class="referenciaContainer">
              <h4>Referências de Efeitos Adversos</h4>
              {#each referenciasEfeitosAdversos as _, index}
                <Input keyboardType="default" bind:value={referenciasEfeitosAdversos[index]} />
                {#if referenciasEfeitosAdversos.length > 1}
                  <div>
                    <button
                      on:click={() =>
                        (referenciasEfeitosAdversos = referenciasEfeitosAdversos.filter((_, i) => i !== index))}
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
                  on:click={() => (referenciasEfeitosAdversos = [...referenciasEfeitosAdversos, ''])}
                >
                  <LucidePlus />
                </button>
                <button class="referenciaBotao" on:click={() => (modalReferenciasEfeitosAdversos = false)}>
                  <LucideCheck />
                </button>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </fieldset>

    <fieldset>
      <button on:click={() => (modalComoUtilizar = true)}>Definir Como Utilizar</button>

      {#if modalComoUtilizar}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="modal" on:click={() => (modalComoUtilizar = false)}>
          <div class="modalContent" on:click={(e) => e.stopPropagation()}>
            {#each formasPreparo as forma, index}
              <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                <h4>{forma.tipo}</h4>
                {#if forma.tipo === 'CASEIRA'}
                  <p><strong>Parte da Planta:</strong> {forma.partePlantaCaseiro || 'Não informado'}</p>
                  <p><strong>Posologia:</strong> {forma.posologiaCaseiro || 'Não informado'}</p>
                {:else}
                  <p><strong>Composição:</strong> {forma.composicaoConcentracao || 'Não informado'}</p>
                  <p><strong>RENAME:</strong> {forma.constaRename || 'Não informado'}</p>
                {/if}
                <div>
                  <button on:click={() => (formasPreparo = formasPreparo.filter((f, i) => i !== index))}>
                    Remover
                  </button>
                </div>
              </div>
            {/each}
            <button
              on:click={() => {
                formaPreparoTemp = { ...new FormaPreparo(), referencias: [''] }
                formaPreparoTemp.tipo = 'CASEIRA'
                formaPreparoTemp.metodoPreparo = new MetodoPreparo()
                formaPreparoTemp.metodoPreparo.idMetodoPreparo = null
                modalComoUtilizarAdicionar = true
              }}>+ Nova forma de preparo</button
            >
            <button on:click={() => (modalComoUtilizar = false)}>Sair</button>
          </div>
        </div>
      {/if}

      {#if modalComoUtilizarAdicionar}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="modal" on:click={() => (modalComoUtilizarAdicionar = false)}>
          <div class="modalContent" on:click={(e) => e.stopPropagation()}>
            <label for="tipoComoUtilizar">Tipo:</label>
            <select name="tipoComoUtilizar" id="tipoComoUtilizar" bind:value={formaPreparoTemp.tipo}>
              <option value="CASEIRA">CASEIRA</option>
              <option value="FARMACEUTICA">FARMACÊUTICA</option>
            </select>

            {#if formaPreparoTemp.tipo === 'CASEIRA'}
              <div>
                <label for="parteDaPlanta">Parte da Planta:</label>
                <Input keyboardType="default" bind:value={formaPreparoTemp.partePlantaCaseiro} />
              </div>

              <label for="metodoPreparo">Método de Preparo:</label>
              <select name="metodoPreparo" id="metodoPreparo" bind:value={formaPreparoTemp.metodoPreparo}>
                <option value="" disabled selected>Selecione o método de preparo</option>
                {#each modosPreparo as metodo}
                  <option value={metodo}>{metodo.descricaoMetodo}</option>
                {/each}
              </select>
            {:else}
              <div>
                <label for="composicaoEConcentracao">Composição/Concentração:</label>
                <Input keyboardType="default" bind:value={formaPreparoTemp.composicaoConcentracao} />

                <label for="temNaRename">Tem na Rename?</label>
                <select name="temNaRename" id="temNaRename" bind:value={formaPreparoTemp.constaRename}>
                  <option value="SIM">SIM</option>
                  <option value="NÃO">NÃO</option>
                </select>
              </div>
            {/if}
            <label for="posologia">Posologia:</label>
            <Input keyboardType="default" bind:value={formaPreparoTemp.posologiaCaseiro} />
            <label for="referenciasFormaPreparo">Referências:</label>
            {#each formaPreparoTemp.referencias as _, index}
              <Input keyboardType="default" bind:value={formaPreparoTemp.referencias[index]} />
              {#if formaPreparoTemp.referencias.length > 1}
                <div>
                  <button
                    on:click={() =>
                      (formaPreparoTemp.referencias = formaPreparoTemp.referencias.filter((_, i) => i !== index))}
                  >
                    Remover referência
                  </button>
                </div>
              {/if}
            {/each}
            <div class="referenciaBotoes">
              <div>
                <button
                  class="referenciaBotao"
                  on:click={() => (formaPreparoTemp.referencias = [...formaPreparoTemp.referencias, ''])}
                >
                  <LucidePlus />
                </button>
                <button
                  class="referenciaBotao"
                  on:click={() => {
                    formasPreparo = [...formasPreparo, formaPreparoTemp]
                    formaPreparoTemp = null
                    modalComoUtilizarAdicionar = false
                  }}
                >
                  <LucideCheck />
                </button>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </fieldset>

    <fieldset>
      <button on:click={() => (modalEstudosCientifico = true)}>Definir Estudos Científicos</button>

      {#if modalEstudosCientifico}
        <div class="modal" on:click={() => (modalEstudosCientifico = false)}>
          <div class="modalContent" on:click={(e) => e.stopPropagation()}>
            <label for="resumoTrabalhos">Resumo Geral dos Trabalhos:</label>
            <textarea name="resumoTrabalhos" id="resumoTrabalhos" bind:value={planta.resumoTrabalhos}></textarea>
            {#each planta.estudosPorPlanta as estudo, index}
              <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                <h4>{estudo.estudoCientifico.tituloResumo}</h4>
                <p>{estudo.estudoCientifico.resumo}</p>
                <p><strong>Referência:</strong> {estudo.estudoCientifico.referencia}</p>
                <p>
                  <strong>Link:</strong>
                  <a href={estudo.estudoCientifico.linkReferencia.startsWith('http') ? estudo.estudoCientifico.linkReferencia : `https://${estudo.estudoCientifico.linkReferencia}`} target="_blank"
                    >{estudo.estudoCientifico.linkReferencia}</a
                  >
                </p>
                <button
                  on:click={() => (planta.estudosPorPlanta = planta.estudosPorPlanta.filter((_, i) => i !== index))}
                >
                  Remover Estudo
                </button>
              </div>
            {/each}
            <div class="referenciaBotoes">
              <div>
                <button
                  class="referenciaBotao"
                  on:click={() => {
                    modalEstudosCientificoAdicionar = true
                    estudosCientifico = new EstudoCientifico()
                  }}>+ Adicionar estudo</button
                >
                <button class="referenciaBotao" on:click={() => (modalEstudosCientifico = false)}>
                  <LucideCheck />
                </button>
              </div>
            </div>
          </div>
        </div>

        {#if modalEstudosCientificoAdicionar}
          <div class="modal" on:click={() => (modalEstudosCientificoAdicionar = false)}>
            <div class="modalContent" on:click={(e) => e.stopPropagation()}>
              <label for="tituloResumo">Título/Resumo:</label>
              <Input keyboardType="default" bind:value={estudosCientifico.tituloResumo} />

              <label for="detalhesEstudo">Resumo Completo:</label>
              <Input keyboardType="default" bind:value={estudosCientifico.resumo} />

              <label for="referenciaEstudo">Referência (Texto):</label>
              <Input keyboardType="default" bind:value={estudosCientifico.referencia} />

              <label for="linkReferencia">Link da Referência:</label>
              <Input keyboardType="default" bind:value={estudosCientifico.linkReferencia} />

              <div class="referenciaBotoes">
                <div>
                  <button
                    class="referenciaBotao"
                    on:click={() => {
                      if (!planta?.estudosPorPlanta || planta?.estudosPorPlanta.length === 0) {
                        planta.estudosPorPlanta = [
                          {
                            idEstudosPorPlanta: undefined,
                            estudoCientifico: estudosCientifico,
                            planta: undefined,
                            usuario: undefined,
                          },
                        ]
                      } else {
                        planta.estudosPorPlanta = [
                          ...planta.estudosPorPlanta,
                          {
                            idEstudosPorPlanta: undefined,
                            estudoCientifico: estudosCientifico,
                            planta: undefined,
                            usuario: undefined,
                          },
                        ]
                      }
                      estudosCientifico = null
                      modalEstudosCientificoAdicionar = false
                    }}
                  >
                    <LucideCheck />
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/if}
      {/if}
    </fieldset>

    <button id="submitButton" on:click={onCriarPlanta}>Criar planta</button>
  </div>
</main>

<style>
  /* Correção para o teclado não cobrir os campos */
  .main-container {
    height: 100vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
  }

  .form-content {
    padding-bottom: 250px; /* Garante scroll suficiente acima do teclado */
  }

  main h2 {
    font-size: 4vh;
    color: #2e3b1f;
    font-weight: 700;
    margin: 20px;
    text-align: center;
  }

  /* Estilização customizada para o Upload de Imagem */
  .upload-section {
    width: 80%;
    margin: 15px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  input[type='file'] {
    display: none; /* Esconde o nativo "Choose File" */
  }

  .custom-file-upload {
    display: flex;
    align-items: center;
    background-color: #7a8863;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
  }

  .file-name {
    font-size: 14px;
    color: #666;
    text-align: center;
    margin-bottom: 5px;
  }

  .preview-img {
    max-width: 100%;
    margin-top: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    margin-top: 10px;
    padding: 5px 15px;
    border-radius: 12px;
    border: none;
  }

  #submitButton {
    text-align: center;
    font-size: 16px;
    margin-left: 20px;
    margin-right: 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: calc(100% - 40px);
    background-color: #2e3b1f;
    color: white;
    font-weight: bold;
  }

  fieldset {
    border: 2px solid #d3d3d3;
    border-radius: 8px;
    padding: 20px;
    margin: 20px;
  }

  fieldset button {
    margin-top: 10px;
    width: 100%;
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

  .modal {
    position: fixed;
    top: 13.7vh;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 5px;
  }

  .modalContent {
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 95%;
    max-width: 420px;
    max-height: 80%;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
</style>
