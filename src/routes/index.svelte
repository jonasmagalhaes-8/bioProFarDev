<script>
  import MenuItem from '@/components/HomeItem.svelte'
  import Splash from '@/components/Splash.svelte'
  import { usuarioStore } from '@/store'
  import { goto } from '@roxi/routify'
  import { onMount } from 'svelte'

  const menuItems = [
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/c2edb7fa-b6ea-48d8-95c3-aa4e2b56a3d3__planta.png',
      label: 'Lista<br>RENAME',
      to: '/listagemplantas?rename=true',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/c2edb7fa-b6ea-48d8-95c3-aa4e2b56a3d3__planta.png',
      label: 'Lista<br>ReniSUS',
      to: '/listagemplantas?rename=false',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/eda4ba82-8e82-4379-8f86-299a65b42f46__indicaes.png',
      label: 'Pesquisar por<br>indicação',
      to: '/indicacoes',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/61661f38-3b09-4ab1-8221-00b723a435d9__modo-de-preparo.png',
      label: 'Modos de<br>preparo',
      to: '/listagem-modos-preparo',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/44145c9c-40eb-454c-b55c-9f2022a94174__favoritos.png',
      label: 'Lista de<br>favoritados',
      to: '/favoritos',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/9f3ab1af-0c69-4334-a51c-dc94ef58d612__como-utilizar.png',
      label: 'Aprenda a usar o aplicativo',
      to: '/aprender',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/bda252b9-ab62-4061-b57d-7263572a10ad__mais-informaes.png',
      label: 'Informações<br>Adicionais',
      to: '/informacoes',
    },
    {
      img: 'https://cdn.grapesjs.com/workspaces/cmbrza1zt1qs08tm31bcj18yg/assets/bda252b9-ab62-4061-b57d-7263572a10ad__mais-informaes.png',
      label: 'Configuração',
      to: '/configuracao',
    },
  ]

  let splashVisivel = $state(sessionStorage.getItem('splashVisivel') == null ? true : false)

  onMount(() => {
    const usuarioStorage = localStorage.getItem('usuario')

    if (usuarioStorage == null || usuarioStorage == '') {
      $goto('/login')
    }

    usuarioStore.set(JSON.parse(usuarioStorage))

    setTimeout(() => {
      splashVisivel = false
      sessionStorage.setItem('splashVisivel', 'false')
    }, 2000)
  })
</script>

<Splash imgSrc="path/to/image.jpg" visibilidade={splashVisivel} />

<div class="divider"></div>

<main class="grid-container">
  <div class="grid">
    {#each menuItems as item}
      <MenuItem img={item.img} label={item.label} to={item.to} />
    {/each}
  </div>
</main>

<style>
  .divider {
    height: 1.5px;
    width: 100%;
    background-color: #fff;
  }

  .grid-container {
    display: flex;
    justify-content: center;
    padding: 10px 0;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 3vw;
    justify-items: center;
    width: 96%;
    max-width: 480px;
  }
</style>
