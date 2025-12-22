<script lang="ts">
  import { fade } from 'svelte/transition'

  export let visibilidade = true
  export let imgSrc = ''
</script>

{#if visibilidade}
  <div class="splash">
    <img src={imgSrc} alt="Splash Image" transition:fade />
  </div>
{/if}

<style>
  .splash {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    z-index: 9999;
  }

  img {
    width: 100vw;
  }
</style>
