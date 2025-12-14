<script lang="ts">
  import { onMount, createEventDispatcher, onDestroy } from 'svelte'
  import IMask from 'imask' // Você precisará instalar: npm install imask

  // --- Props ---
  export let value: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let multiline: boolean = false
  export let secureTextEntry: boolean = false
  /**
   * Definição da máscara para IMask.
   * Ex: '(00) 0000-0000' ou { mask: Date, pattern: 'Y-m-d' }
   * Nota: O formato é diferente de react-native-mask-input.
   */
  export let mask: any | undefined = undefined
  export let keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'password' = 'default'
  export let autoCapitalize: 'none' | 'sentences' | 'words' | 'characters' = 'none'
  export let disabled: boolean = false
  export let numberOfLines: number | undefined = undefined // Usado como 'rows' no textarea
  export let style: string = '' // CSS inline para o wrapper
  export let textStyle: string = '' // CSS inline para o input/textarea

  // --- Eventos ---
  const dispatch = createEventDispatcher()

  // --- Lógica Interna ---
  let inputElement: HTMLInputElement | HTMLTextAreaElement
  let maskInstance: IMask.InputMask<any> | null = null

  // Mapeia props do React Native para atributos HTML
  $: inputType = (() => {
    if (secureTextEntry) return 'password'
    switch (keyboardType) {
      // 'numeric' pode ser 'number' ou 'tel'. 'tel' costuma ser melhor para máscaras.
      case 'numeric':
        return 'number'
      case 'email-address':
        return 'email'
      case 'phone-pad':
        return 'tel'
      case 'password':
        return 'password'
      default:
        return 'text'
    }
  })()

  // Função para limpar caracteres inválidos (da versão web do seu componente RN)
  const caracteresValidos = (text: string): string => {
    // Adicionei \n para permitir quebras de linha no multiline, como no seu RN (embora o seu regex web não tivesse)
    const regex = /[^\nA-Za-zÀ-ÿ0-9@._+?!,°\/%:=*()&$'"<>;\- ⁰¹²³⁴⁵⁶⁷⁸⁹]/g
    return text.replace(regex, '')
  }

  onMount(() => {
    if (mask && inputElement) {
      // Inicializa o IMask
      maskInstance = IMask(inputElement, {
        mask: mask, // Passa a definição da máscara
      })

      // Ouve o evento 'accept' para obter valores mascarados/não mascarados
      maskInstance.on('accept', () => {
        if (!maskInstance) return
        const unmasked = maskInstance.unmaskedValue
        const masked = maskInstance.value

        value = masked // Atualiza o valor vinculado
        // Emulando onChangeTextMasked
        dispatch('changeTextMasked', { masked, unmasked })
      })

      // Define o valor inicial se houver
      if (value !== undefined) {
        maskInstance.value = value
      }
    }
  })

  onDestroy(() => {
    // Limpa a instância do IMask para evitar vazamentos de memória
    if (maskInstance) {
      maskInstance.destroy()
    }
  })

  // Atualiza o valor do IMask se a prop 'value' mudar externamente
  $: if (maskInstance && value !== maskInstance.value) {
    maskInstance.value = value || ''
  }

  // Handler para input normal (sem máscara)
  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement

    // Se houver máscara, o IMask cuida de tudo no 'accept'
    if (mask) return

    // Se não houver máscara, aplica a limpeza de caracteres
    let cleaned = caracteresValidos(target.value)

    // Se o valor limpo for diferente, atualiza o DOM e o estado
    if (cleaned !== target.value) {
      target.value = cleaned
    }
    value = cleaned
    dispatch('changeText', cleaned)
  }

  function handleBlur() {
    dispatch('blur')
  }

  function handleKeyPress(e: KeyboardEvent) {
    dispatch('keyPress', e.key)
  }
</script>

<!-- 
  O wrapper <div> emula o <View style={styles.input}>
  Usamos classes CSS para estilização base e 'style' prop para overrides.
-->
<div class="input-wrapper" {style}>
  {#if multiline}
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <textarea
      bind:this={inputElement}
      value={value || ''}
      {placeholder}
      {disabled}
      rows={numberOfLines || 3}
      autocapitalize={autoCapitalize}
      style={textStyle}
      class="input-field"
      on:input={handleInput}
      on:blur={handleBlur}
      on:keypress={handleKeyPress}
    />
  {:else}
    <input
      bind:this={inputElement}
      value={value || ''}
      {placeholder}
      {disabled}
      type={inputType}
      autocapitalize={autoCapitalize}
      style={textStyle}
      class="input-field"
      on:input={handleInput}
      on:blur={handleBlur}
      on:keypress={handleKeyPress}
    />
  {/if}

  <!-- 
    <slot /> emula o {children} do React, 
    permitindo que você passe ícones ou botões
    para dentro do wrapper.
  -->
  <slot />
</div>

<style>
  .input-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid #ccc; /* Estilo base, similar ao styles.input */
    border-radius: 8px;
    padding: 8px 12px;
    background-color: #fff;
    width: 100%;
    box-sizing: border-box; /* Garante que padding não afete a largura total */
  }

  .input-field {
    flex: 1; /* Ocupa o espaço disponível */
    border: none;
    outline: none;
    font-size: 16px;
    background-color: transparent;
    width: 100%; /* Garante que preencha o flex-item */
    padding: 0;
    margin: 0;
    color: #000;
    /* Para textarea */
    resize: vertical;
  }

  .input-field::placeholder {
    color: #000; /* Cor do placeholder do seu código RN */
  }

  .input-field:disabled {
    background-color: #eee; /* Feedback visual para desabilitado */
  }
</style>
