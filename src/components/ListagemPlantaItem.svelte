<script lang="ts">
  import { Planta } from '@/models/Planta'
  import { url } from '@roxi/routify'

  export let planta: Planta
  export let origemListagemRename: boolean | null
  export let origemListagemFavoritos: boolean | null
  export let idIndicacaoUso: Number | null
  export let idModoPreparo: Number | null
</script>

<a
  href={$url('/paginaPlanta', {
    id: planta.idPlanta.toString(),
    origemListagemFavoritos: origemListagemFavoritos != null ? origemListagemFavoritos.toString() : null,
    rename: origemListagemRename != null ? origemListagemRename.toString() : null,
    idIndicacaoUso: idIndicacaoUso != null ? idIndicacaoUso.toString() : null,
    idModoPreparo: idModoPreparo != null ? idModoPreparo.toString() : null,
  })}
  class="itemPlanta"
>
  <div class="textoPlanta">{planta.nome}</div>
  <div class="containerNavegacao">
    <div class="botao">→</div>
  </div>
</a>

<style>
  .itemPlanta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    padding: 0 20px;
    margin: 10px 10px 12px 10px;
    background: linear-gradient(120deg, #7a8863, #a1b07d);
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    text-decoration: none;
    color: #fff;
    overflow: hidden;
  }

  .textoPlanta {
    font-size: 2.2vh;
    color: #fff;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 500;
    line-height: 1.2;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  }

  .containerNavegacao {
    display: flex;
    align-items: center;
  }

  .botao {
    color: rgba(255, 255, 255, 1);
    font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
    font-size: 3.5vh;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
