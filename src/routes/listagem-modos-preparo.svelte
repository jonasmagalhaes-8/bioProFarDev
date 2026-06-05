<script lang="ts">
  import { onMount } from 'svelte'
  import BarraDePesquisa from '@/components/BarraDePesquisa.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'
  import { controllerCriarModoPreparo, controllerListagemModosPreparo } from '@/controllers/modoPreparoController'
  import { MetodoPreparo } from '@/models/MetodoPreparo'
  import ListagemModosPreparo from '@/components/ListagemModosPreparo.svelte'
  import BarraTopo from '@/components/BarraTopo.svelte'
  import Input from '@/components/Input.svelte'
  import { usuarioStore } from '@/store'

  let descricaoListagemModosPreparo: string = 'Carregando Modos de Preparo...'

  let modosPreparo: MetodoPreparo[] = [] // Inicializa como array vazio para evitar erros

  // 1. Variável para receber o termo de pesquisa do componente filho
  let termoPesquisa: string = ''

  let modalCriarModoPreparoAberto: boolean = false
  let modoPreparo: MetodoPreparo = new MetodoPreparo()

  onMount(async () => {
    await getModoPreparo()

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

  const getModoPreparo = async () => {
    try {
      modosPreparo = await controllerListagemModosPreparo()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const onCriarModoPreparo = async (e: Event) => {
    e.preventDefault()

    if (!modoPreparo.descricaoMetodo || modoPreparo.descricaoMetodo.trim().length < 1) {
      alert('Insira uma descrição')
      return
    }

    try {
      const response = await controllerCriarModoPreparo(modoPreparo)
      termoPesquisa = ''
      await getModoPreparo()
      modoPreparo = new MetodoPreparo()
      modalCriarModoPreparoAberto = false
    } catch (error: any) {
      alert(error.message)
    }
  }
</script>

<BarraTopo>
  <BotaoVoltar destino={'/'} />
  <BarraDePesquisa texto={descricaoListagemModosPreparo} bind:termoPesquisa />
</BarraTopo>

{#if $usuarioStore.usuarioAdmin}
  <div role="button" class="criar-modo-preparo" on:click={() => (modalCriarModoPreparoAberto = true)}>
    <span>Criar modo de preparo</span>
  </div>
{/if}

{#each modosPreparoFiltradas as modoPreparo}
  <ListagemModosPreparo {modoPreparo} />
{/each}

{#if modalCriarModoPreparoAberto}
  <div class="modal">
    <div class="modal-content">
      <div on:submit={(e) => onCriarModoPreparo(e)}>
        <label for="Descrição">Descrição</label>
        <Input autoCapitalize="sentences" bind:value={modoPreparo.descricaoMetodo} />

        <label for="Tipo">Tipo de Preparo</label>
        <select style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ccc; font-size: 16px;" bind:value={modoPreparo.tipo}>
          <option value="CASEIRA">CASEIRA</option>
          <option value="FARMACÊUTICA">FARMACÊUTICA</option>
        </select>

        <label for="Detalhamento">Detalhamento</label>
        <textarea bind:value={modoPreparo.detalhamento}></textarea>

        <label for="referencia1">Referência 1</label>
        <Input autoCapitalize="sentences" bind:value={modoPreparo.referencia1} />

        <label for="referencia2">Referência 2</label>
        <Input autoCapitalize="sentences" bind:value={modoPreparo.referencia2} />

        <label for="referencia3">Referência 3</label>
        <Input autoCapitalize="sentences" bind:value={modoPreparo.referencia3} />

        <label for="referencia4">Referência 4</label>
        <Input autoCapitalize="sentences" bind:value={modoPreparo.referencia4} />

        <label for="referencia5">Referência 5</label>
        <Input autoCapitalize="sentences" bind:value={modoPreparo.referencia5} />

        <button on:click={onCriarModoPreparo}>Salvar Modo de Preparo</button>
        <button
          on:click={() => {
            modalCriarModoPreparoAberto = false
          }}>Fechar</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  .criar-modo-preparo {
    background: linear-gradient(120deg, #7a8863, #a1b07d);
    border-radius: 15px;
    margin: 10px 10px 12px 10px;
    cursor: pointer;
  }

  .criar-modo-preparo span {
    display: block;
    text-align: center;
    padding: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    font-size: 2.2vh;
    color: #fff;
  }

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
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 95%;
    max-width: 500px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.25);
    position: relative;
    max-height: 95%;
    overflow: scroll;
  }

  .modal-content h2 {
    text-align: center;
  }

  .modal-content div button:nth-of-type(1) {
    margin-top: 15px;
  }

  .modal-content div button {
    width: 100%;
  }
</style>
