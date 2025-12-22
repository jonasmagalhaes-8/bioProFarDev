<script lang="ts">
  import { goto } from '@roxi/routify'
  import { onMount } from 'svelte'

  let irPara: any
  $: irPara = $goto

  onMount(() => {
    localStorage.clear()
    irPara('/login')
  })
</script>
