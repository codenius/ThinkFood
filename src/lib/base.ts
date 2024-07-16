// SCHEME: https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#get-/api/v2/search
export interface APIItem {
	code: string;
	product_name: string;
	nutriments: any;
	image_front_url: string;
}

export interface Nutriments {
	alcohol: number;
	carbohydrates: number;
	energy: number;
	fat: number;
	'nova-group': number;
	sugar: number;
}

export class APIBase {
	items: APIItem[] = [];

	constructor() {}

	async init() {
		await this.loadItems();
		return this;
	}

	async loadItems(this: APIBase) {
		let search_tags = [
			'states_tags=nutrition-facts-completed', // search tag for complete nutrition tags
			'sugar_gt_1', // sugar grater than 1g per 100g (just to be sure!)
			'sort_by=popularity_key', // less work for the api server
			'categories_tags=chocolate,snacks', // https://world.openfoodfacts.org/categories
			'fields=nutriments,code,product_name,image_front_url'
		];
		let request = await fetch(
			'https://world.openfoodfacts.org/api/v2/search?' + search_tags.join('&')
		);
		let data = await request.json();
		this.items = data.products;
	}

	get_random_item(this: APIBase): APIItem {
		return this.items[Math.round(Math.random() * this.items.length)];
	}
}
