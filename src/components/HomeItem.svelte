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
    border-radius: 35px;
    display: flex;
    color: #fff;
    font-family: Verdana, Geneva, sans-serif;
    font-size: 14px;
    text-align: center;
    flex-direction: column;
    align-items: center;
    height: 140px;
    padding: 12px 0;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      background 0.3s ease;
    text-decoration: none;
  }

  .menu-item:hover {
    transform: translateY(-4px) scale(1.06);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.35);
  }

  .menu-item img {
    width: 68px;
    height: 68px;
    object-fit: contain;
    margin-top: 6px;
    transition: transform 0.2s ease;
  }

  .menu-item:hover img {
    transform: scale(1.15) rotate(5deg);
  }

  .label {
    line-height: 1.3;
    margin-top: 8px;
    font-weight: 600;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  }
</style>
