<script lang="ts">
  export let aberto: boolean
  export let titulo: string
  export let mensagem: string
  export let onFechar: () => void
  export let onConfirmar: () => void
</script>

{#if aberto}
  <div class="modal">
    <div class="modal-content">
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
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 95%;
    max-width: 500px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.25);
    position: relative;
    max-height: 95%;
    overflow: scroll;
  }

  .botoesContainer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  #botaoFechar,
  #botaoConfirmar {
    width: 120px;
    padding: 0;
  }

  #botaoFechar {
    background: #ccc;
    color: black;
  }

  #botaoConfirmar {
    background: #ff5555;
    color: white;
  }
</style>
