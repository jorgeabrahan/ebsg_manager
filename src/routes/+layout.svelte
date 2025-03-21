<script lang="ts">
  import { Toaster } from 'svelte-sonner';
  import '../app.css';
  import { onMount } from 'svelte';
  import { ServiceAuth } from '$lib/services/service_auth';
  import { goto } from '$app/navigation';
  import { isUserBeingFetched, user } from '$lib/stores/store_user';
  let { children } = $props();

  onMount(() => {
    $isUserBeingFetched = true;
    (async () => {
      const { data } = await ServiceAuth.getUser();
      $user = data;
      $isUserBeingFetched = false;
      const isAuthenticated = data != null && data?.role === 'authenticated';
      const isDashboardPath =
        window.location.pathname === '/dashboard' ||
        window.location.pathname.startsWith('/dashboard/students');
      const isAuthPath =
        window.location.pathname === '/sign-in' ||
        window.location.pathname === '/sign-up';
      if (!isAuthenticated && isDashboardPath) {
        goto('/sign-in');
        return;
      }
      if (isAuthenticated && isAuthPath) {
        goto('/dashboard');
        return;
      }
      if (!isDashboardPath && !isAuthPath) {
        if (isAuthenticated) {
          goto('/dashboard');
          return;
        } else {
          goto('/sign-in');
        }
      }
      if (window.location.pathname === '/sign-up') {
        if (isAuthenticated) {
          goto('/dashboard');
          return;
        }
        goto('/sign-in');
      }
    })();
  });
</script>

<Toaster richColors />
{@render children()}
