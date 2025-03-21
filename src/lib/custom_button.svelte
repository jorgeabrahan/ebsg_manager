<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  let {
    className = '',
    type = 'button',
    children,
    disabled = false,
    ...props
  }: HTMLButtonAttributes & {
    className?: string;
    type?: 'button' | 'submit';
    disabled?: boolean;
    children: Snippet<[]>;
  } = $props();
</script>

<button
  class={`text-xs ${disabled && 'opacity-50'} ${
    /\bp(-|x-|y-)/.test(className) ? '' : 'px-5 py-2'
  } ${!className.includes('rounded-') && 'rounded-lg'} ${className}`}
  {type}
  {disabled}
  onmousedown={(e) => {
    props?.onmousedown?.(e);
    if (
      !e.target ||
      !(e.target instanceof HTMLElement) ||
      e.target.tagName !== 'BUTTON'
    )
      return;
    e.target.classList.add('scale-95');
  }}
  onmouseup={(e) => {
    props?.onmouseup?.(e);
    if (
      !e.target ||
      !(e.target instanceof HTMLElement) ||
      e.target.tagName !== 'BUTTON'
    )
      return;
    e.target.classList.remove('scale-95');
  }}
  {...props}
>
  {@render children()}
</button>
