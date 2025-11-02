<script lang="ts">
  // importa o próprio componente para permitir recursão
  import Accordion from './Accordion.svelte'

  export let titulo: string | null = null
  export let texto: string | null = null
  export let link: string | null = null
  export let filhos = [] // lista de sub-accordions
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
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

    {#if link}
      <a class="linkItem" href={link} target="_blank" rel="noopener noreferrer"> Link </a>
    {/if}

    {#if filhos.length > 0}
      {#each filhos as filho}
        <Accordion {...filho} />
      {/each}
    {/if}
  </div>
</details>

<style>
  .espacamento {
    margin-left: 3.5px;
    margin-top: 6px;
  }

  .expansaoAccordion {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    transition: background 0.3s ease;
  }

  .botaoExpandirAccordion {
    min-width: 24px;
    width: 24px;
    height: 24px;
    transition: transform 0.2s ease-in-out;
  }

  .tituloAccordion {
    font-size: 2.54vh;
    color: #354128;
    font-weight: 700;
  }

  .textoAccordion {
    --font-size: 2.44vh;
    font-size: 1.97vh;
    color: #354128;
    font-weight: 400;
    align-self: center;
    padding: 0px 2.5px;
    border-top: 1.5px solid #d0d4c0;
  }

  .linkItem {
    font-size: 1.97vh;
  }
</style>
