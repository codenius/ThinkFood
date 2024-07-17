<script lang="ts">
	import { APIBase, type APIItem } from '$lib/base';
	import { onMount } from 'svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	let api: APIBase;

	async function load() {
		return await new APIBase().init();
	}

	let product: APIItem;

	onMount(() => {
		load().then((data) => {
			api = data;
			api.items = api.shuffleArray(api.items)
			next()
		});
	});

	let guess = 50;
	let productNumber = 0
	let showSolution = false;

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		showSolution = true;
	}

	function next() {
		showSolution = false;
		productNumber++
		product = api.items[productNumber]
	}
</script>

<div class="flex w-full flex-col items-center pb-4">
	<main class="flex min-w-96 flex-col items-center justify-center gap-4 lg:flex-row lg:items-start">
		{#if !api}
			<div class="p-4">
				<ProgressRadial></ProgressRadial>
			</div>
		{:else}
			<div class="card w-full overflow-hidden">
				<img
					class="max-h-96 w-full rounded-t object-contain"
					src={product.image_front_url}
					alt=""
				/>
				<h2 class="p-4 text-2xl font-bold">{product.product_name}</h2>
			</div>
			<div class="flex w-full flex-col gap-4">
				<form class="card flex w-full flex-col items-center p-2" on:submit={onSubmit}>
					<label class="p-2 text-2xl font-bold text-surface-900" for=""
						>{guess}&nbsp;g&nbsp;/&nbsp;100&nbsp;g</label
					>
					<div class="w-full px-4">
						<input disabled={showSolution} bind:value={guess} type="range" name="" id="" />
					</div>
					<button disabled={showSolution} class="variant-filled btn" type="submit">Guess!</button>
				</form>
				{#if showSolution}
					<div
						class="card variant-filled flex w-full flex-col items-center p-2 text-xl font-semibold"
					>
						<div>
							Sugar per 100 g: {product.nutriments.sugars_100g} g
						</div>
						<div>
							You are off by {guess - product.nutriments.sugars_100g} g
						</div>
					</div>
					<button on:click={next} class="variant-filled btn">Next →</button>
				{/if}
			</div>
		{/if}
	</main>
</div>
