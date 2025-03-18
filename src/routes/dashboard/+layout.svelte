<script lang="ts">
  import { onMount } from 'svelte'
  import { isUserBeingFetched, user } from '$lib/stores/store_user'
  import { ServiceAuth } from '$lib/services/service_auth'

  let { children } = $props()

  onMount(async () => {
    if ($user != null) return
    $isUserBeingFetched = true
    const { data } = await ServiceAuth.getUser()
    $user = data
    $isUserBeingFetched = false
  })

  // onMount(() => {
  //   const { data: authData } = supabase.auth.onAuthStateChange(
  //     async (_, newSession) => {
  //       if (newSession?.expires_at !== session?.expires_at) {
  //         invalidate('supabase:auth')
  //         const { data } = await supabase.auth.getUser()
  //         $user = data.user
  //       }
  //     }
  //   )
  //   return () => authData.subscription.unsubscribe()
  // })
</script>

{@render children()}
