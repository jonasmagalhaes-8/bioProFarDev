<script>
  import Accordion from '@/components/Accordion.svelte'
  import BarraTopo from '@/components/BarraTopo.svelte'
  import BotaoVoltar from '@/components/BotaoVoltar.svelte'

  const itens = [
    {
      titulo: 'Como pesquisar lista de medicamentos disponibilizados pelo SUS',
      texto: 'Texto informado',
      link: 'www.google.com',
    },
    {
      titulo: 'Como notificar uma reação adversa à ANVISA',
      texto: 'Texto informado',
      link: 'www.google.com',
    },
    {
      titulo: 'Encontre Núcleos Regionais de Saúde próximos',
      texto: 'Texto informado',
      link: 'www.google.com',
    },
    {
      titulo: 'Acesse a Política Nacional de Plantas e Fitoterápicos',
      texto: 'Texto informado',
      link: 'www.google.com',
    },
  ]
</script>

<BarraTopo titulo={'Informações Adicionais'} />
<BotaoVoltar destino={'/'} />

<div id="container">
  {#each itens as item}
    <Accordion titulo={item.titulo} texto={item.texto} link={item.link} />
  {/each}
</div>

<style>
  #container {
    flex-basis: 100%;
    margin-left: 20px;
    margin-right: 20px;
  }
</style>
