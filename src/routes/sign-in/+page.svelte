<script lang="ts">
  import { goto } from '$app/navigation';
  import CustomButton from '$lib/custom_button.svelte';
  import CustomInput from '$lib/custom_input.svelte';
  import { ServiceAuth } from '$lib/services/service_auth';
  import { isUserBeingFetched, user } from '$lib/stores/store_user';
  import { UtilToast } from '$lib/utils/util_toast';
  import { UtilValidation } from '$lib/utils/util_validation';
  import WrapperDelimiter from '$lib/wrappers/wrapper_delimiter.svelte';

  async function onSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const entries = Object.fromEntries(new FormData(e.currentTarget)) as {
      email: string;
      password: string;
    };
    const emailValidation = UtilValidation.email(entries.email);
    if (!emailValidation.isValid) {
      UtilToast.error(emailValidation.message);
      return;
    }
    const passwordValidation = UtilValidation.password(entries.password);
    if (!passwordValidation.isValid) {
      UtilToast.error(passwordValidation.message);
      return;
    }
    $isUserBeingFetched = true;
    const { data, isSuccess } = await ServiceAuth.signIn({
      email: entries.email.trim(),
      password: entries.password
    });
    $isUserBeingFetched = false;
    $user = data;
    if (isSuccess && data != null) {
      goto('/dashboard');
    }
  }
</script>

<WrapperDelimiter
  className="min-h-screen max-w-[500px] flex flex-col justify-center"
>
  <form class="space-y-4 mb-4" onsubmit={onSubmit}>
    <CustomInput
      label="Correo"
      id="email"
      type="email"
      disabled={$isUserBeingFetched}
      required
    />
    <CustomInput
      label="Contraseña"
      id="password"
      type="password"
      disabled={$isUserBeingFetched}
      required
    />
    <CustomButton
      className="block w-full bg-steel-blue"
      disabled={$isUserBeingFetched}
      type="submit"
    >
      Iniciar sesión
    </CustomButton>
  </form>
  <!-- <p class="text-center text-sm text-white/40">
    ¿No tienes una cuenta?{' '}
    <a
      href="/sign-up"
      class={`text-steel-blue-500/80 ${$isUserBeingFetched ? 'pointer-events-none opacity-50' : ''}`}
      >Registrate</a
    >
  </p> -->
</WrapperDelimiter>
