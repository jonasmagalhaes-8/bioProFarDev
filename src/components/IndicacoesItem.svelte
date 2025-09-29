<script lang="ts">
  import { url } from '@roxi/routify'
  export let img: string
  export let label: string
  export let to: string = '/'
</script>

<a href={$url(to)} class="linhaItem">
  <img class="imagem" src={img} alt={label} />
  <div class="tituloItem">{label}</div>
  <div class="tamanhoLinhaItem">
    <div class="botaoOpcoes">&gt;</div>
  </div>
</a>

<style>
  .botaoOpcoes {
    color: rgba(255, 255, 255, 1);
    font-family:
      Lucida Sans Unicode,
      Lucida Grande,
      sans-serif;
    font-size: 3.1vh;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-weight: 600;
  }

  .tamanhoLinhaItem {
    width: 23vw;
  }

  .tituloItem {
    width: 24vh;
    font-size: 2.261vh;
    color: rgba(255, 255, 255, 1);
    margin-left: 10px;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 400;
  }

  .imagem {
    color: black;
    width: 11vh;
    height: 8vh;
    justify-content: center;
    align-items: flex-end;
    margin-top: 3px;
    margin-left: 4px;
  }

  .linhaItem {
    background-color: #929e77;
    margin-top: 10px;
    display: flex;
    height: 8.5vh;
    align-items: center;
  }
</style>
