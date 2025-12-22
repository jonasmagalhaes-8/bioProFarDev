<script lang="ts">
  export let aberto: boolean
  export let titulo: string
  export let mensagem: string
  export let onFechar: () => void
  export let onConfirmar: () => void
</script>

{#if aberto}
  <div class="modal" on:click={onFechar}>
    <div class="modal-content" on:click|stopPropagation>
      <h2>{titulo}</h2>
      <p>{mensagem}</p>
      <div class="botoesContainer">
        <button id="botaoFechar" on:click={onFechar}>Fechar</button>
        <button id="botaoConfirmar" on:click={onConfirmar}>Confirmar</button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Garante que o padding não aumente o tamanho real dos elementos */
  * {
    box-sizing: border-box;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6); /* Escureci um pouco mais para dar destaque */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    padding: 20px; /* Margem de segurança para o modal não encostar na borda da tela */
  }

  .modal-content {
    background: white;
    padding: 24px;
    border-radius: 16px;
    width: 100%;
    max-width: 400px; /* Reduzi um pouco para modais de confirmação, que costumam ser menores */
    box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.2);

    /* CORREÇÃO DA ROLAGEM */
    max-height: 90vh;
    overflow-y: auto; /* Só rola se o texto for gigante */
    overflow-x: hidden; /* Proíbe rolar para o lado */
  }

  h2 {
    margin-top: 0;
    color: #333;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    line-height: 1.5;
    margin-bottom: 24px;
  }

  .botoesContainer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  #botaoFechar,
  #botaoConfirmar {
    flex: 1; /* Faz os botões dividirem o espaço no mobile */
    max-width: 120px;
    height: 44px; /* Altura ideal para toque */
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #botaoFechar {
    background: #f3f4f6;
    color: #4b5563;
  }

  #botaoConfirmar {
    background: #ff5555;
    color: white;
  }

  /* Ajuste para telas muito pequenas */
  @media (max-width: 350px) {
    .botoesContainer {
      flex-direction: column; /* Empilha botões se a tela for minúscula */
    }
    #botaoFechar,
    #botaoConfirmar {
      max-width: 100%;
    }
  }
</style>
