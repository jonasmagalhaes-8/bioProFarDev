<script lang="ts">
  export let destino: string
</script>

<!-- Link de navegação -->
<div class="navegacao">
  <a href={destino} class="botao">
    <!-- Ícone -->
    <span class="material-icons">west</span>
  </a>
</div>

<style>
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  .navegacao {
    flex-basis: 100%;
    margin-left: 6px;
    margin-bottom: 2.5px;
    font-size: 0; /* remove espaço invisível causado por inline */
  }

  .botao {
    font-size: 3.3vh;
    color: #fff;
    font-family: 'Roboto', Verdana, Geneva, sans-serif;
    font-weight: 700;
    line-height: 0; /* evita espaçamento vertical extra */
    text-decoration: none;
  }

  .material-icons {
    font-size: 1.15em; /* ajusta conforme necessário */
  }
</style>
