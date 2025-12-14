<script lang="ts">
  import { IndicacaoUso } from '@/models/IndicacaoUso'
  import { usuarioStore } from '@/store'
  import { getPrefix } from '@/util/obterPrefixoTipoImagem'
  import { LucideEdit3, LucideTrash } from '@lucide/svelte'
  import { url } from '@roxi/routify'

  export let indicacao: IndicacaoUso

  // Props para o modal
  export let abrirModalFn: (indicacao?: IndicacaoUso) => void
  export let excluirIndicacaoFn: (indicacao: IndicacaoUso) => void
</script>

<div class="linhaItem">
  <!-- Conteúdo clicável como link -->
  <a href={$url('/plantasIndicacao', { idIndicacaoUso: indicacao.idIndicacaoUso.toString() })} class="conteudoLinha">
    <img
      class="imagem"
      src={getPrefix(indicacao.imagemIndicacao) + indicacao.imagemIndicacao}
      alt={indicacao.nomeIndicacao}
    />
    <div class="tituloItem">{indicacao.nomeIndicacao}</div>
  </a>

  <!-- Ícones de ações -->
  <div class="tamanhoLinhaItem">
    {#if $usuarioStore?.usuarioAdmin}
      <div class="iconeEditar" title="Editar" on:click={() => abrirModalFn(indicacao)}><LucideEdit3 /></div>
      <div class="iconeExcluir" title="Excluir" on:click={() => excluirIndicacaoFn(indicacao)}><LucideTrash /></div>
    {/if}
  </div>
</div>

<style>
  .linhaItem {
    display: flex;
    align-items: center;
    height: 8.5vh;
    min-height: 70px;
    margin: 12px 8px 0 8px;
    padding: 0 7px;
    background-color: #929e77;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: #fff;
    position: relative;
    overflow: hidden;
    animation: slideInRight 0.5s ease-out backwards;
  }

  /* Parte clicável da linha */
  .conteudoLinha {
    display: flex;
    align-items: center;
    flex: 1;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    padding-right: 12px; /* Para não encostar nos ícones */
  }

  .conteudoLinha:hover {
    background-color: rgba(255, 255, 255, 0.1); /* Efeito hover */
  }

  .tamanhoLinhaItem {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-width: 40px;
  }

  .iconeEditar,
  .iconeExcluir {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.2vh;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .iconeEditar:hover,
  .iconeExcluir:hover {
    transform: scale(1.2);
  }

  .tituloItem {
    flex: 0.93;
    font-size: 2.2vh;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 500;
    line-height: 1.2;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  }

  .imagem {
    width: 11vh;
    height: 8vh;
    margin-right: 12px;
    margin-left: 4px;
    margin-top: 3px;
    object-fit: contain;
  }
</style>
