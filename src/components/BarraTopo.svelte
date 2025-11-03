<script lang="ts">
  export let titulo: string | null = null
  export let tamanhoFonte: string = '3.7vh'
</script>

<div class="barraTopoTitulo" style="font-size: {tamanhoFonte}">
  <div class="conteudo">
    <!-- Aqui vão os componentes injetados, como o botão voltar -->
    <slot />

    {#if titulo}
      <div class="titulo">{@html titulo}</div>
    {/if}
  </div>
</div>

<style>
  .barraTopoTitulo {
    background: linear-gradient(135deg, #2e3b1f 0%, #556b2f 100%);
    display: flex;
    align-items: center;
    min-height: 9.5vh;
    padding: 4px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    animation: slideDown 0.6s ease-out;
  }

  .titulo {
    margin-left: 10px;
    font-family: Verdana, Geneva, sans-serif;
    color: rgba(255, 255, 255, 1);
  }

  .conteudo {
    display: flex;
    flex-direction: column; /* 👈 muda para coluna */
    width: 100%;
  }
</style>
