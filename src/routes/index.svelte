<script>
  import MenuItem from '@/components/HomeItem.svelte'
  import Splash from '@/components/Splash.svelte'
  import { usuarioStore } from '@/store'
  import { onMount } from 'svelte'

  let menuItems = $state([
    { img: '/assets/planta.png', label: 'Lista<br>RENAME', to: '/listagemplantas?rename=true' },
    { img: '/assets/planta.png', label: 'Lista<br>ReniSUS', to: '/listagemplantas?rename=false' },
    { img: '/assets/indicacoes.png', label: 'Pesquisar por<br>indicação', to: '/indicacoes' },
    { img: '/assets/modos_de_preparo.png', label: 'Modos de<br>preparo', to: '/listagem-modos-preparo' },
    { img: '/assets/favoritos.png', label: 'Lista de<br>favoritados', to: '/favoritos' },
    { img: '/assets/como_utilizar.png', label: 'Aprenda a usar o aplicativo', to: '/aprender' },
    { img: '/assets/mais_informacoes.png', label: 'Informações<br>Adicionais', to: '/informacoes' },
    { img: '/assets/user.svg', label: 'Seu Perfil', to: '/configuracao' }, // Direciona para o onMount de lá
  ])

  let splashVisivel = $state(sessionStorage.getItem('splashVisivel') == null)

  onMount(() => {
    const memoria = localStorage.getItem('usuario')
    if (memoria) {
      const usuario = JSON.parse(memoria)
      usuarioStore.set(usuario)

      if (usuario.usuarioAdmin) {
        menuItems = [
          ...menuItems,
          {
            img: '/assets/users.svg',
            label: 'Gestão de<br />Usuários',
            to: '/gestao',
          },
        ]
      }
    }

    if (splashVisivel) {
      setTimeout(() => {
        splashVisivel = false
        sessionStorage.setItem('splashVisivel', 'false')
      }, 2000)
    }
  })
</script>

<Splash imgSrc="/assets/splash.png" visibilidade={splashVisivel} />
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
