<script lang="ts">
	import { APIBase, type APIItem } from '$lib/base';
	import Product from '$lib/components/Product.svelte';
	import { onMount } from 'svelte';
	import { dndzone, overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';
	import { persisted } from 'svelte-persisted-store';

	overrideItemIdKeyNameBeforeInitialisingDndZones('code');
	const flipDurationMs = 200;

	let api: APIBase;

	async function load_api() {
		api = await new APIBase().init();
		new_items = [api.get_random_item()];
		new_items_copy = new_items;
		return new_items;
	}

	onMount(() => {
		load_api().then((item) => console.log(item));
	});

	let product_array: APIItem[] = [];
	let new_items: APIItem[];
	let new_items_copy: APIItem[];
	let error = 'Press the SUBMIT button, when you sorted the products by sugar content.';
	let lose = false;
	let storage = persisted('foodster', {
		highscore: 0
	});

	let highscore_overshoot = false;

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		// Made turn?
		if (new_items.length != 0) {
			error = 'Sort the supreme product into the list (by sugar content).';
			return;
		}
		// Check
		let sorted = product_array.map((item) => item.nutriments.sugars_100g);
		if (sorted.toSorted((a, b) => a - b).toString() != sorted.toString()) {
			lose = true;
			if ($storage.highscore >= product_array.length) {
				return;
			}

			$storage.highscore = product_array.length;
			highscore_overshoot = true;
			return;
		}
		// generate new item
		while (new_items.every((item) => product_array.includes(item))) {
			new_items = [api.get_random_item()];
			new_items_copy = new_items;
		}
	}

	function handleSortProductArray(e: any) {
		// didn't found the right type
		product_array = e.detail.items;
	}

	function handleSortNewItemsArray(e: any) {
		new_items = e.detail.items;
	}

	function reset(e: MouseEvent) {
		e.preventDefault();
		lose = false;
		highscore_overshoot = false;
		product_array = [];
		new_items = [api.get_random_item()];
		new_items_copy = new_items;
		error = 'Press the SUBMIT button, when you sorted the products by sugar content.';
	}
</script>

{#if api}
	{#await new_items}
		loading
	{:then _}
		<form hidden={lose} on:submit={onSubmit} class="m-auto max-w-[80%]">
			<section
				class="m-auto flex min-h-[400px] justify-center gap-3"
				use:dndzone={{ items: new_items }}
				on:consider={handleSortNewItemsArray}
				on:finalize={handleSortNewItemsArray}
			>
				{#if new_items.length == 0}
					<p class="mt-16">Click the submit button to get a new product.</p>
				{/if}
				{#each new_items as items (items.code)}
					<Product product={items}></Product>
				{/each}
			</section>
			<section
				class="m-auto flex min-h-[400px] flex-wrap justify-center gap-3"
				use:dndzone={{ items: product_array, flipDurationMs }}
				on:consider={handleSortProductArray}
				on:finalize={handleSortProductArray}
			>
				{#if product_array.length == 0}
					<p class="mt-16">
						Drag the supreme item into this field. Another item will be given to you after
						submitting.<br />
						The goal of the game is simple: <b>Sort the items by their sugar content!</b>
					</p>
				{/if}
				{#each product_array as product (product.code)}
					<Product
						{product}
						product_list={product_array}
						show_index
						show_sugar={!new_items_copy.includes(product)}
					></Product>
				{/each}
			</section>
			<button class="card variant-filled-surface button-base-styles mt-10 w-full p-4" type="submit"
				>Submit</button
			>
			<p class="m-auto mt-2 flex justify-center opacity-80">{error}</p>
		</form>
		<div hidden={!lose}>
			<div class="flex items-center justify-center">
				<div class="m-auto max-w-[80%] *:mt-4">
					<h1 class="h1 text-center">You lost, after {product_array.length} turns!</h1>
					<br />
					{#if highscore_overshoot}
						<h2 class="h2 text-center">
							HOWEVER YOU GOT A NEW HIGHSCORE: {$storage.highscore}, TIME TO IMPROVE IT TO THE SKY
						</h2>
						<br />
					{:else}
						<h2 class="h2 text-center">
							No new highscore (you didn't beat {$storage.highscore}). Time to improve it!
						</h2>
						<br />
					{/if}
					<h2 class="h2 text-center">Your final result:</h2>
					<section class="m-auto flex min-h-[400px] flex-wrap justify-center gap-3">
						{#each product_array as product (product.code)}
							<Product {product} product_list={product_array} show_index show_sugar></Product>
						{/each}
					</section>
					<button
						type="button"
						class="card variant-filled-surface button-base-styles my-10 w-full p-4"
						on:click={reset}>Sweet people can't resist another round, I heard...</button
					>
				</div>
			</div>
		</div>
	{/await}
{/if}
