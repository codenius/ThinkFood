<script lang="ts">
	import type { APIItem } from '$lib/base';

	export let product: APIItem;
	export let product_list: APIItem[] = [];
	export let show_index: boolean = false;
	export let show_sugar: boolean = false;
</script>

<div class="card card-hover w-modal-slim aspect-square overflow-hidden">
	<div class="w-modal-slim absolute z-10 aspect-square">
		{#if show_index}
			<div class="variant-filled-primary absolute left-[5%] top-[5%] aspect-square h-[2em]">
				<p class="flex h-full w-full items-center justify-center text-2xl">
					{product_list.findIndex((p) => p.code == product.code) + 1}
				</p>
			</div>
		{/if}
		{#if show_sugar}
			<div class="variant-filled-primary absolute bottom-[5%] right-[5%]">
				<p class="flex h-full w-full items-center justify-center p-1 text-2xl">
					{product.nutriments.sugars_100g}g&nbsp;/&nbsp;100g
				</p>
			</div>
		{/if}
	</div>
	<img
		class="h-full w-full object-contain bg-[url('{product.image_front_url}')] backdrop-blur-sm"
		src={product.image_front_url}
		alt=""
	/>
</div>
