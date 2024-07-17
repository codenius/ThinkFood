<script lang="ts">
	import { APIBase, type APIItem } from '$lib/base';
	import { onMount } from 'svelte';
	import { dndzone, overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';
	overrideItemIdKeyNameBeforeInitialisingDndZones('code');
	let api: APIBase;

	async function load_api() {
		api = await new APIBase().init();
		new_items = [api.get_random_item()];
		return new_items;
	}

	onMount(() => {
		load_api().then((item) => console.log(item));
	});

	let product_array: APIItem[] = [];
	let lives: number = 3;
	let new_items: APIItem[];

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		// Check Game Mechanics
		while (new_items.every((item) => product_array.includes(item))) {
			new_items = [api.get_random_item()];
		}
	}

	function handleSortProductArray(e: any) {
		// didn't found the right type
		product_array = e.detail.items;
	}

	function handleSortNewItemsArray(e: any) {
		new_items = e.detail.items;
	}
</script>

{#if api}
	{#await new_items}
		loading
	{:then _}
		<form on:submit={onSubmit}>
			<section
				use:dndzone={{ items: new_items }}
				on:consider={handleSortNewItemsArray}
				on:finalize={handleSortNewItemsArray}
			>
				{#each new_items as items (items.code)}
					<div>
						{items.product_name}
					</div>
				{/each}
			</section>
			<section
				use:dndzone={{ items: product_array }}
				on:consider={handleSortProductArray}
				on:finalize={handleSortProductArray}
			>
				{#each product_array as product (product.code)}
					<div>
						{product.product_name}
					</div>
				{/each}
			</section>
			<button type="submit">Submit</button>
		</form>
	{/await}
{/if}

<style>
	section {
		min-height: 10vh;
	}
</style>
