<script lang="ts">
  // importa o próprio componente para permitir recursão
  import Accordion from './Accordion.svelte'

  export let titulo: string | null = null
  export let texto: string | null = null
  export let link: string | null = null
  export let filhos = [] // lista de sub-accordions
</script>

<details class="espacamento">
  <summary class="expansaoAccordion">
    <div class="tituloAccordion">{titulo}</div>
    <div class="botaoExpandirAccordion">
      <svg>
        <path d="m7.4 8.6 4.6 4.6 4.6-4.6L18 10l-6 6-6-6 1.4-1.4Z"></path>
      </svg>
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
    margin-top: 15px;
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

  .tituloAccordion {
    font-size: 2.54vh;
    color: #354128;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 700;
  }

  .textoAccordion {
    --font-size: 2.44vh;
    font-size: 1.97vh;
    color: #354128;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 400;
  }

  .linkItem {
    color: #2461ae;
    font-family: Verdana, Geneva, sans-serif;
    font-size: 2.44vh;
  }
</style>
