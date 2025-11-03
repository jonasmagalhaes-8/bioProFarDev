<script lang="ts">
  export let texto: string

  // 1. Variável reativa para o termo de pesquisa
  // Ela será vinculada pelo componente pai usando `bind:termoPesquisa`
  export let termoPesquisa: string = ''
</script>

<div class="top-bar">
  <input type="text" placeholder={'🔍 ' + texto} bind:value={termoPesquisa} />
</div>

<style>
  /* ... (Seu CSS existente) ... */
  .top-bar {
    display: flex;
    align-items: center;
    height: 6.3vh;
    margin-top: 4.5px;
    justify-content: center;
    padding: 0 6px;
    box-sizing: border-box;
  }

  .top-bar input {
    width: 100%;
    max-width: 500px;
    height: 5vh;
    border-radius: 15px;
    border: none;
    font-size: 16.5px;
    padding: 0 15px;
    background-color: white;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    font-family: 'Roboto', sans-serif;
  }
  .top-bar input:focus {
    box-shadow:
      inset 0 2px 8px rgba(0, 0, 0, 0.2),
      0 0 6px rgba(60, 120, 220, 0.4);
    transform: scale(1.02);
  }
  .top-bar input::placeholder {
    color: #999;
    opacity: 1;
  }
</style>
