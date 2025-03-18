<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		tag = 'section',
		className = '',
		children
	}: {
		tag?: keyof HTMLElementTagNameMap;
		className?: string;
		children: Snippet<[]>;
	} = $props();
</script>

<svelte:element
	this={tag}
	class={`delimiter-horizontal-padding w-full mx-auto ${
		!className.includes('max-w') && 'max-w-5xl'
	} ${className}`}
>
	{@render children()}
</svelte:element>
