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
  ><path
    d="M9 6L15 12L9 18"
    stroke="currentColor"
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
  ></path></svg
>
