<script lang="ts">
  import CustomButton from '$lib/custom_button.svelte';
  import IconXMark from '$lib/icons/icon_x_mark.svelte';
  import type { Snippet } from 'svelte';
  import WrapperDelimiter from './wrapper_delimiter.svelte';

  let {
    title = '',
    isOpen = false,
    isClosingAllowed = true,
    onClose = () => {},
    onToggle = () => {},
    children
  }: {
    title?: string;
    isOpen?: boolean;
    isClosingAllowed?: boolean;
    onClose?: () => void;
    onToggle?: (isOpen: boolean) => void;
    children: Snippet<[]>;
  } = $props();

  let dialog = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.show();
      onToggle?.(true);
    } else if (!isOpen && dialog.open) {
      dialog.close();
      onToggle?.(false);
    }
  });
</script>

<dialog bind:this={dialog}>
  <WrapperDelimiter className="max-w-md">
    <div class="bg-night p-4 rounded-lg border border-white/30">
      <header class="flex items-center justify-between gap-4">
        <h3 class="font-semibold text-lg">{title}</h3>
        <CustomButton
          className="bg-night-600 p-1 [&>*]:pointer-events-none"
          onclick={() => {
            if (!isClosingAllowed) return;
            onClose();
          }}
        >
          <IconXMark strokeWidth={2.5} size={20} />
        </CustomButton>
      </header>
      {@render children()}
    </div>
  </WrapperDelimiter>
</dialog>
