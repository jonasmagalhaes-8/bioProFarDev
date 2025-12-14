<script lang="ts" generics="T">
  export let options: { id: T; value: string }[] = []
  export let selected: T[] = []
  export let placeholder: string = 'Selecione opções...'

  let isOpen = false
  let dropdownRef: HTMLDivElement

  $: selectedText = selected.length ? `${selected.length} opção(ões) selecionada(s)` : placeholder

  function toggleDropdown() {
    isOpen = !isOpen
  }

  function toggleOption(id: T) {
    if (selected.includes(id)) {
      selected = selected.filter((selectedId) => selectedId !== id)
    } else {
      selected = [...selected, id]
    }
  }

  function removeOption(id: number) {
    selected = selected.filter((selectedId) => selectedId !== id)
  }

  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      isOpen = false
    }
  }

  function getSelectedLabels(): string[] {
    return selected
      .map((id) => {
        const option = options.find((opt) => opt.id === id)
        return option ? option.value : ''
      })
      .filter(Boolean)
  }

  $: selectedLabels = getSelectedLabels()
</script>

<svelte:window on:click={handleClickOutside} />

<div class="multiselect-container" bind:this={dropdownRef}>
  <div class="multiselect-input" on:click={toggleDropdown}>
    <div class="selected-items">
      <span class="placeholder">{selectedText}</span>
    </div>
    <span class="arrow" class:open={isOpen}>▼</span>
  </div>

  {#if isOpen}
    <div class="dropdown-list">
      {#each options as option}
        <div
          class="dropdown-item"
          class:selected={selected.includes(option.id)}
          on:click={() => toggleOption(option.id)}
        >
          <input
            type="checkbox"
            checked={selected.includes(option.id)}
            on:click|stopPropagation
            on:change={() => toggleOption(option.id)}
          />
          <span>{option.value}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .multiselect-container {
    position: relative;
    width: 100%;
    max-width: 400px;
    font-family: Arial, sans-serif;
  }

  .multiselect-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    min-height: 40px;
  }

  .multiselect-input:hover {
    border-color: #888;
  }

  .selected-items {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    flex: 1;
  }

  .placeholder {
    color: #999;
  }

  .arrow {
    transition: transform 0.2s;
    font-size: 12px;
    color: #666;
  }

  .arrow.open {
    transform: rotate(180deg);
  }

  .dropdown-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .dropdown-item {
    display: flex;
    align-items: start;
    gap: 8px;
    padding: 8px 12px;
    cursor: pointer;
  }

  .dropdown-item:hover {
    background: #f0f0f0;
  }

  .dropdown-item.selected {
    background: #e3f2fd;
  }

  .dropdown-item input[type='checkbox'] {
    cursor: pointer;
    margin: 0px;
    margin-top: 5px;
  }
</style>
