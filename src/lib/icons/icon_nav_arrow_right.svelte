<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  let {
    size = 20,
    strokeWidth = 1.5,
    className = '',
    ...props
  }: SVGAttributes<SVGElement> & {
    size?: number;
    strokeWidth?: number;
    className?: string;
  } = $props();
</script>

<svg
  width={size}
  height={size}
  stroke-width={strokeWidth}
  viewBox="0 0 24 24"
  fill="none"
  color="currentColor"
  class={className}
  {...props}
  ><path
    d="M9 6L15 12L9 18"
    stroke="currentColor"
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
  ></path></svg
>
