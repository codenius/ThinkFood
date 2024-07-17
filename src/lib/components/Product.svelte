<script lang="ts">
	import type { APIItem } from "$lib/base";

    export let product: APIItem;
    export let product_list: APIItem[] = [];
    export let show_index: boolean = false;
    export let show_sugar: boolean = false;
</script>

<div class="card card-hover aspect-square w-modal-slim overflow-hidden">
    <div class="absolute aspect-square w-modal-slim z-10">
        {#if show_index}
            <div class="absolute top-[5%] left-[5%] variant-filled-primary h-[2em] aspect-square">
                <p class="flex justify-center items-center text-2xl h-full w-full">
                    {product_list.findIndex(p => p.code == product.code) + 1}
                </p>
            </div>
        {/if}
        {#if show_sugar}
            <div class="absolute bottom-[5%] right-[5%] variant-filled-primary ">
                <p class="flex justify-center items-center text-2xl h-full w-full p-1">
                    {product.nutriments.sugars_100g}g&nbsp;/&nbsp;100g
                </p>
            </div>
        {/if}
    </div>
    <img class="w-full h-full object-contain bg-[url('{product.image_front_url}')] backdrop-blur-sm" src={product.image_front_url} alt="">
</div>