<script>
  import BarraDePesquisa from '@/components/BarraDePesquisa.svelte'
  import BotaoVoltarHome from '@/components/BotaoVoltar.svelte'
  import MenuIndicacoes from '@/components/IndicacoesItem.svelte'

  const indicacoes = [
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/4652c668-7f84-4f5b-ab2f-de2525e49cfe__cardiovasculares.png',
      label: 'Cardiovasculares',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/ac5a5222-4c92-4a23-b734-422d1e2542be__reumatolgicas.png',
      label: 'Reumatológicas',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/88c5323e-3c8a-4f8c-8cf0-092340af060b__endcrinas.png',
      label: 'Endócrinas',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/11c30c1c-4bbe-4c70-a5ff-90d5cce780bb__neurolgicas.png',
      label: 'Neurológicas',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/c05bcadc-e152-4c9a-9f9c-381dcdc2cc75__dermatolgicas.png',
      label: 'Dermatológicas',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/5fa11ff9-80a0-4789-947e-0d365baf0500__sistema-respiratrio.png',
      label: 'Sistema Respiratório',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/4d9af4d3-f1a7-49f0-8a46-7916180680df__doenas-gastrointestinais.png',
      label: 'Gastrointestinais',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/4ba3f17c-afbb-44b4-86e7-4f9da6092af5__parasitoses.png',
      label: 'Parasitoses',
    },
  ]
</script>

<BarraDePesquisa texto={'Buscar Indicações'} backgroundColor={'#929e77'} />
<BotaoVoltarHome destino={'/'} />
{#each indicacoes as item}
  <MenuIndicacoes img={item.img} label={item.label} />
{/each}

<style>
</style>
