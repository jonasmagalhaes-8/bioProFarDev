<script lang="ts">
  import Accordion from './Accordion.svelte'
  import { url } from '@roxi/routify'

  export let titulo: string | null = null
  export let texto: string | null = null
  export let link: string | null = null
  export let rota: string | null = null // exemplo: '/modo-preparo'
  export let params: Record<string, any> | null = null // exemplo: { id: 3 }
  export let filhos: string | any[] | null | undefined = []
  export let mostrarAcoes: boolean = false

  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

  function destino() {
    if (rota) return $url(rota, params ?? {})
    if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
      return 'https://' + link
    }
    return link // fallback para link externo
  }

  // Define o texto do link dinamicamente
  function textoLink() {
    if (rota) return 'Toque aqui para saber mais sobre esse método de preparo'
    return 'Link'
  }
</script>

<details class="espacamento">
  <summary class="expansaoAccordion">
    <div class="tituloAccordion">{titulo}</div>
    <div class="botaoExpandirAccordion">
      {#if !isIOS}
        <svg>
          <path d="m7.4 8.6 4.6 4.6 4.6-4.6L18 10l-6 6-6-6 1.4-1.4Z"></path>
        </svg>
      {/if}
    </div>
  </summary>

  <div class="textoAccordion">
    {#if texto}
      <div>{@html texto}</div>
    {/if}

    {#if link || rota}
      <a class="linkItem" href={destino()} target={link ? '_blank' : '_self'} rel="noopener noreferrer">
        {textoLink()}
      </a>
    {/if}

    {#if filhos.length > 0}
      {#each filhos as filho}
        <Accordion {...filho} />
      {/each}
    {/if}

    {#if mostrarAcoes}
      <div class="acoesAccordion">
        <button class="btn-editar" on:click|preventDefault|stopPropagation={() => dispatch('editar')}>Editar</button>
        <button class="btn-excluir" on:click|preventDefault|stopPropagation={() => dispatch('excluir')}>Excluir</button>
      </div>
    {/if}
  </div>
</details>

<style>
  .espacamento {
    margin-top: 12.5px;
  }

  .linkItem {
    color: #354128;
    font-size: 1.97vh;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-block;
    margin-top: 2px;
  }

  .linkItem:hover {
    text-decoration: underline;
    transform: translateX(3px);
  }

  .expansaoAccordion {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .botaoExpandirAccordion {
    min-width: 24px;
    width: 24px;
    height: 24px;
    transition: transform 0.2s ease-in-out;
  }

  details,
  summary {
    -webkit-tap-highlight-color: transparent; /* Android/Chrome */
    -moz-tap-highlight-color: transparent; /* Firefox Mobile (não sempre necessário) */
  }

  .botaoExpandirAccordion svg {
    pointer-events: none;
  }

  .tituloAccordion {
    font-size: 2vh;
    color: #354128;
    font-weight: 700;
  }

  details[open] .botaoExpandirAccordion {
    transform: rotate(180deg);
  }

  details {
    background: rgba(255, 255, 255, 0.6);
    border-radius: 15px;
    margin-right: 6.5px;
    padding: 8.5px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .textoAccordion {
    font-size: 1.85vh;
    color: #354128;
    font-weight: 400;
    padding: 0px 2.5px;
    border-top: 1.5px solid #d0d4c0;
  }

  .acoesAccordion {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed #d0d4c0;
  }

  .acoesAccordion button {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    font-size: 1.7vh;
    cursor: pointer;
    font-weight: 600;
    color: white;
  }

  .btn-editar {
    background-color: #6b7280;
  }

  .btn-excluir {
    background-color: #ef4444;
  }

  .btn-editar:active,
  .btn-excluir:active {
    opacity: 0.8;
  }
</style>
