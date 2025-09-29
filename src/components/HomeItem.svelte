<script lang="ts">
  export let img: string
  export let label: string
  export let to: string | { path: string; query?: Record<string, string> }
</script>

<a
  class="menu-item"
  href={typeof to === 'string' ? to : `${to.path}${to.query ? '?' + new URLSearchParams(to.query).toString() : ''}`}
>
  <img src={img} alt={label} />
  <div class="label">{@html label}</div>
</a>

<style>
  .menu-item {
    flex-basis: 20%;
    width: 155px;
    background-color: rgba(52, 64, 40, 1);
    border-top-left-radius: 35px;
    border-top-right-radius: 35px;
    border-bottom-left-radius: 35px;
    border-bottom-right-radius: 35px;
    display: flex;
    color: rgba(255, 255, 255, 1);
    font-family: Verdana, Geneva, sans-serif;
    font-size: 16.31px;
    text-align: center;
    flex-direction: column;
    align-items: center;
    height: 135px;
  }

  .menu-item:hover {
    transform: scale(1.05);
  }

  img {
    width: 67.9px;
    align-items: flex-end;
    margin-top: 9px;
  }

  .label {
    line-height: 1.2;
  }
</style>
