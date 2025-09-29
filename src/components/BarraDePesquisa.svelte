<script lang="ts">
  export let backgroundColor: string
  export let texto: string

  // 1. Variável reativa para o termo de pesquisa
  // Ela será vinculada pelo componente pai usando `bind:termoPesquisa`
  export let termoPesquisa: string = ''
</script>

<div class="top-bar" style="background-color: {backgroundColor}">
  <input type="text" placeholder={'🔍 ' + texto} bind:value={termoPesquisa} />
</div>

<style>
  /* ... (Seu CSS existente) ... */
  .top-bar {
    display: flex;
    align-items: center;
    height: 8.5vh;
    justify-content: center;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .top-bar input {
    margin-top: 12px;
    width: 100%;
    max-width: 500px;
    height: 5vh;
    border-radius: 5px;
    border: 0.1px solid black;
    font-size: 16.5px;
    padding: 0 5px;
    box-sizing: border-box;
    background-color: white;
  }

  .top-bar input::placeholder {
    color: #888;
    opacity: 1;
  }
</style>
