<script lang="ts">
  import { IndicacaoUso } from '@/models/IndicacaoUso'
  import { url } from '@roxi/routify'

  export let indicacao: IndicacaoUso

  // Detecta o tipo de imagem a partir do prefixo Base64
  function getPrefix(imgBase64: string) {
    if (imgBase64.startsWith('iVBORw0K')) return 'data:image/png;base64,'
    if (imgBase64.startsWith('/9j/')) return 'data:image/jpeg;base64,'
    if (imgBase64.startsWith('R0lGOD')) return 'data:image/gif;base64,'
    if (imgBase64.startsWith('UklGR')) return 'data:image/webp;base64,'
    return 'data:image/*;base64,' // fallback genérico
  }
</script>

<a href={$url('/plantasIndicacao', { idIndicacaoUso: indicacao.idIndicacaoUso.toString() })} class="linhaItem">
  <img
    class="imagem"
    src={getPrefix(indicacao.imagemIndicacao) + indicacao.imagemIndicacao}
    alt={indicacao.nomeIndicacao}
  />
  <div class="tituloItem">{indicacao.nomeIndicacao}</div>
  <div class="tamanhoLinhaItem">
    <div class="botaoOpcoes">&gt;</div>
  </div>
</a>

<style>
  .botaoOpcoes {
    color: rgba(255, 255, 255, 1);
    font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
    font-size: 3.5vh;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .tamanhoLinhaItem {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 40px;
  }

  .tituloItem {
    flex: 0.93;
    font-size: 2.2vh;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 500;
    color: #fff;
    line-height: 1.2;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  }
  .imagem {
    color: black;
    width: 11vh;
    height: 8vh;
    margin-right: 12px;
    justify-content: center;
    align-items: flex-end;
    margin-top: 3px;
    margin-left: 4px;
  }

  .linhaItem:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .linhaItem:hover .botaoOpcoes {
    transform: translateX(4px);
  }
  .linhaItem {
    display: flex;
    align-items: center;
    height: 8.5vh;
    min-height: 70px;
    margin-top: 12px;
    margin-left: 8px;
    margin-right: 8px;
    padding: 0 7px;
    background-color: #929e77;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    color: #fff;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    animation: slideInRight 0.5s ease-out backwards;
  }
</style>
