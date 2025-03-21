<script lang="ts">
  import { goto } from '$app/navigation';
  import IconLogout from '$lib/icons/icon_logout.svelte';
  import { user } from '$lib/stores/store_user';
  import { supabase } from '$lib/supabaseClient';
  import WrapperDelimiter from '$lib/wrappers/wrapper_delimiter.svelte';

  let { children } = $props();

  const onLogout = async () => {
    await supabase.auth.signOut();
    $user = null;
    goto('/sign-in');
  };
</script>

<WrapperDelimiter>
  <nav class="flex items-center justify-between gap-2 my-3">
    <h2 class="font-bold text-xl">Elen Billingual School Garden</h2>
    <button
      class="flex items-center justify-center w-max rounded-lg p-3 bg-night-700 border border-white/40"
      onclick={onLogout}
    >
      <IconLogout />
    </button>
  </nav>
</WrapperDelimiter>
{@render children()}
