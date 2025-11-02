<script lang="ts">
  import { Planta } from '@/models/Planta'
  import { url } from '@roxi/routify'

  export let planta: Planta
  export let origemListagemRename: boolean
  export let idIndicacaoUso: Number
</script>

<a
  href={$url('/paginaPlanta', {
    id: planta.idPlanta.toString(),
    rename: origemListagemRename != null ? origemListagemRename.toString() : null,
    idIndicacaoUso: idIndicacaoUso != null ? idIndicacaoUso.toString() : null,
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
    height: 60px;
    padding: 0 12px;
    margin-bottom: 8px;
    background: linear-gradient(120deg, #7a8863, #a1b07d);
    border-radius: 4.5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      background 0.3s ease;
    text-decoration: none;
    color: #fff;
  }

  .itemPlanta:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
    background: linear-gradient(120deg, #a1b07d, #7a8863);
  }

  .textoPlanta {
    font-size: 4vh;
    color: #fff;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 500;
    line-height: 1.2;
  }

  .containerNavegacao {
    display: flex;
    align-items: center;
  }

  .botao {
    font-size: 2.8vh;
    font-weight: 700;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
  }

  .itemPlanta:hover .botao {
    transform: translateX(5px);
  }
</style>
