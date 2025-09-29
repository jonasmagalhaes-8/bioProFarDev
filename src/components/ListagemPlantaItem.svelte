<script lang="ts">
  import { Planta } from '@/models/Planta'
  import { url } from '@roxi/routify'

  export let planta: Planta
</script>

<a href={$url('/paginaPlanta', { id: planta.idPlanta.toString() })} class="itemPlanta">
  <div class="textoPlanta">{planta.nome}</div>
  <div class="containerNavegacao">
    <div class="botao">→</div>
  </div>
</a>

<style>
  .textoPlanta {
    font-size: 4vh;
    color: rgba(255, 255, 255, 1);
    margin-left: 10px;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 400;
  }

  .botao {
    color: rgba(255, 255, 255, 1);
    font-family:
      Lucida Sans Unicode,
      Lucida Grande,
      sans-serif;
    font-size: 2.6vh;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-weight: 600;
    align-items: center;
  }

  .containerNavegacao {
    flex-direction: row-reverse;
    justify-content: space-evenly;
    align-items: stretch;
    align-self: center;
    margin-right: 15px;
  }

  .itemPlanta {
    display: flex;
    justify-content: space-between;
    height: 50px;
    align-items: center;
    background-color: #929e77;
    margin-bottom: 5.5px;
  }
</style>
