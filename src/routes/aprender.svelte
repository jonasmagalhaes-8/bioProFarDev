<script>
  import BarraTopo from '@/components/BarraTopo.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'

  // Nenhum script adicional necessário, tudo é estático
</script>

<BarraTopo titulo={'Aprenda a usar o aplicativo'}></BarraTopo>
<div>
  <BotaoVoltar destino={'/'} />
  <div id="container">
    <div class="fonteTituloTopico">Objetivo do APP</div>
    <div class="fonteDescricaoTopico">Texto informando objetivo do APP</div>
    <div class="fonteTituloTopico">Informações inclusas no APP</div>
    <div class="fonteDescricaoTopico">
      Texto informando as funcionalidades como as listas de plantas, pesquisa por indicação e modos de preparo
    </div>
    <div class="fonteTituloTopico">Pesquisa de plantas por indicação terapêutica</div>
    <div class="fonteDescricaoTopico">Texto instruindo a utilizar a página “indicação”</div>
    <div class="fonteTituloTopico">Pesquisa dos modos de preparo de plantas</div>
    <div class="fonteDescricaoTopico">
      Texto orientando a utilizar a página modo de preparo, e apresentando seus objetivos
    </div>
  </div>
</div>

<style>
  * {
    box-sizing: border-box;
  }

  .fonteDescricaoTopico {
    font-size: 2.44vh;
    color: #354128;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 400;
    margin-bottom: 45px;
  }

  #container {
    flex-basis: 100%;
    margin-left: 20px;
    margin-right: 20px;
    padding-top: 0px;
    padding-right: 0px;
    padding-bottom: 0px;
    padding-left: 0px;
  }

  .fonteTituloTopico {
    font-size: 2.54vh;
    color: #354128;
    font-family: Verdana, Geneva, sans-serif;
    font-weight: 700;
  }
</style>
