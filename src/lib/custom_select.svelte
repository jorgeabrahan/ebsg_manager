<script lang="ts">
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import IconArrowSeparateVertical from './icons/icon_arrow_separate_vertical.svelte';

  let {
    label,
    id,
    disabled = false,
    options = [],
    defaultOptionLabel = 'Selecciona una opción',
    includeDefaultOption = false,
    isCompact = false,
    className = '',
    ...props
  }: HTMLSelectAttributes & {
    label: string;
    id: string;
    disabled?: boolean;
    options?: { value: string; label: string }[];
    defaultOptionLabel?: string;
    includeDefaultOption?: boolean;
    isCompact?: boolean;
    className?: string;
  } = $props();
</script>

<div class={`relative ${disabled && 'opacity-50'} ${className}`}>
  <label
    for={id}
    class={`absolute left-3 ${
      isCompact ? 'text-[10px] top-[6px]' : 'text-xs top-3'
    } text-white/40`}
  >
    {label}
  </label>
  <select
    class={isCompact ? 'compact-field' : 'field'}
    style="padding-inline:10px"
    name={id}
    {id}
    {disabled}
    value={typeof props.value === 'string' && props.value.trim().length > 0
      ? props.value
      : 'default'}
    {...props}
  >
    {#if includeDefaultOption}
      <option value="default">[{defaultOptionLabel}]</option>
    {/if}
    {#each options as option}
      <option value={option.value}>
        {option.label}
      </option>
    {/each}
  </select>
  <IconArrowSeparateVertical
    class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
    size={isCompact ? 14 : 20}
  />
</div>
