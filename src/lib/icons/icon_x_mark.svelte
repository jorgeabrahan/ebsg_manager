<script lang="ts">
  let { size = 20, strokeWidth = 1.5 } = $props();
</script>

<svg
  width={size}
  height={size}
  stroke-width={strokeWidth}
  viewBox="0 0 24 24"
  fill="none"
  color="currentColor"
>
  <path
    d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
    stroke="currentColor"
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
  ></path>
</svg>
