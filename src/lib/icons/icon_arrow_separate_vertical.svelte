<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  let {
    size = 20,
    ...props
  }: SVGAttributes<SVGElement> & {
    size?: number;
  } = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  stroke-width="1.5"
  fill="none"
  color="currentColor"
  {...props}
>
  <path
    d="M17 8L12 3L7 8"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  ></path>
  <path
    d="M17 16L12 21L7 16"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  ></path>
</svg>
