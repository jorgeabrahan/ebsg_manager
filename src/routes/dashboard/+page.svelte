<script lang="ts">
  import Root from '$lib/dashboard/root.svelte'
  import { isUserBeingFetched, user } from '$lib/stores/store_user'
</script>

{#if $user == null || $isUserBeingFetched}
  <p>Cargando...</p>
{:else}
  <Root />
{/if}
