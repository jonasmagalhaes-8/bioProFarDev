<script lang="ts">
  export let titulo: string
  export let tamanhoFonte: string = '4.13vh'
</script>

<div class="barraTopoTitulo" style="font-size: {tamanhoFonte}">
  <div class="titulo">{@html titulo}</div>
</div>

<style>
  .barraTopoTitulo {
    background-color: #354128;
    display: flex;
    align-items: center;
    height: 14.5vh;
  }

  .titulo {
    margin-left: 10px;
    font-family: Verdana, Geneva, sans-serif;
    color: rgba(255, 255, 255, 1);
  }
</style>
