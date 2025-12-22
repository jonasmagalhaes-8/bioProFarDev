<script context="module">
  import { Router, createRouter } from '@roxi/routify'
  import routes from '../.routify/routes.default.js'
  import './global.css'

  const router = createRouter({ routes })
</script>

<script lang="ts">
  import { SvelteToast } from '@zerodevx/svelte-toast'
</script>

<SvelteToast />

<Router {router} />
