<script lang="ts">
  import { MetodoPreparo } from '@/models/MetodoPreparo'
  import { url } from '@roxi/routify'

  export let modoPreparo: MetodoPreparo
</script>

<a
  href={$url('/modo-preparo', {
    id: modoPreparo.idMetodoPreparo.toString(),
  })}
  class="itemModoPreparo"
>
  <div class="textoModoPreparo">{modoPreparo.descricaoMetodo}</div>
  <div class="containerNavegacao">
    <div class="botao">→</div>
  </div>
</a>

<style>
  .itemModoPreparo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    padding: 0 20px;
    margin: 10px 10px 12px 10px;
    background: linear-gradient(120deg, #7a8863, #a1b07d);
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    color: #fff;
    position: relative;
    overflow: hidden;
    animation: slideIn 0.5s ease-out backwards;
  }

  .textoModoPreparo {
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

  .itemModoPreparo:hover .botao {
    transform: translateX(5px);
  }
</style>
