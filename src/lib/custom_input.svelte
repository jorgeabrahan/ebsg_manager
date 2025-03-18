<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import IconEye from './icons/icon_eye.svelte';
  import IconEyeClosed from './icons/icon_eye_closed.svelte';

  let {
    label,
    id,
    type = 'text',
    disabled = false,
    containerClassName,
    labelClassName,
    children,
    isCompact = false,
    ...props
  }: HTMLInputAttributes & {
    label: string;
    id: string;
    type?: 'text' | 'number' | 'password' | 'email' | 'color' | 'date';
    disabled?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    isCompact?: boolean;
  } = $props();

  let isShowingPassword = $state(false);
</script>

<div class={`relative ${disabled && 'opacity-50'} ${containerClassName}`}>
  <label
    for={id}
    class={`absolute top-3 ${isCompact ? 'text-[10px]' : 'text-xs'} text-white/40 ${
      !labelClassName?.includes('left-') && 'left-3'
    } ${labelClassName}`}
  >
    {label}
  </label>
  <input
    {id}
    name={id}
    class={isCompact ? 'compact-field' : 'field'}
    autoComplete="off"
    type={isShowingPassword ? 'text' : type}
    {disabled}
    {...props}
  />
  {#if type === 'password'}
    <button
      class="absolute right-3 top-1/2 -translate-y-1/2 [&>*]:pointer-events-none"
      onclick={() => (isShowingPassword = !isShowingPassword)}
      tabIndex={-1}
      type="button"
    >
      {#if isShowingPassword}
        <IconEyeClosed size={isCompact ? 14 : 20} />
      {:else}
        <IconEye size={isCompact ? 14 : 20} />
      {/if}
    </button>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</div>
