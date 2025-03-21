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
    d="M12 12H19M19 12L16 15M19 12L16 9"
    stroke="currentColor"
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
  ></path><path
    d="M19 6V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V18"
    stroke="currentColor"
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
  ></path></svg
>
