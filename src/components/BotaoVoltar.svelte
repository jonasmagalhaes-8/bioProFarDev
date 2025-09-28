<script>
  export let destino
</script>

<div id="navegacao">
  <a href={destino} class="botao">←</a>
</div>

<style>
  #navegacao {
    flex-basis: 100%;
    margin-left: 10px;
  }

  .botao {
    font-size: 3.3vh;
    color: #354128;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 700;
  }
</style>
