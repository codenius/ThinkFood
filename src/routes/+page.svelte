<script lang="ts">
	import { APIBase, type APIItem } from '$lib/base';
	import Product from '$lib/components/Product.svelte';
	import { onMount } from 'svelte';

	async function load() {
		const api = await new APIBase().init();

		return api.get_random_item();
	}

	let data: Promise<APIItem>;

	onMount(() => {
		data = load();
		data.then((product) => {
			console.log(product);
		});
	});

	let guess = 50;
	let showSolution = false;

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		showSolution = true;
	}
</script>

{#if data}
	{#await data}
		loading
	{:then product}
		<Product product={product}></Product>
		<form on:submit={onSubmit}>
			<label for="">{guess}</label>
			<input bind:value={guess} type="range" name="" id="" />
			<button type="submit">guess!</button>
		</form>
		{#if showSolution}
			<div>
				sugar per 100 g: {product.nutriments.sugars_100g} g
			</div>
			<div>
				you are off by {guess - product.nutriments.sugars_100g} g
			</div>
		{/if}
	{/await}
{/if}
