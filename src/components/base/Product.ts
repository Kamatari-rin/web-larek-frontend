import { IMarketAPI, IProduct, IProductDefault, IProductFull, IProductShort } from "../../types";

export class Product implements IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    
    constructor (data: IProduct){
        this.id = data.id;
        this.description = data.description;
        this.image = data.image;
        this.title = data.title;
        this.category = data.category;
        this.price = data.price;
    }

    get url() {
        return `product/${this.id}`;
    }

    toProductDefault(): IProductDefault {
        return {
            id: `${this.id}`,
            image: `https://larek-api.nomoreparties.co/content/weblarek${this.image}`,
            title: `${this.title}`,
            category: `${this.category}`,
            price: this.price == null ? "Бесценно" : this.price.toString()
        };
    }

    toProductFull(): IProductFull {
        return {
            id: `${this.id}`,
            description: `${this.description}`,
            image: `https://larek-api.nomoreparties.co/content/weblarek${this.image}`,
            title: `${this.title}`,
            category: `${this.category}`,
            price: this.price == null ? "Бесценно" : this.price.toString()
        };
    }

    toProductShort(): IProductShort {
        return {
            id: `${this.id}`,
            title: `${this.title}`,
            price: this.price == null ? "Бесценно" : this.price.toString()
        };
    }
}

export class ProductList {
    items: IProduct[];

    constructor(protected api: IMarketAPI) {}

    async load() {
        this.items = (await this.api.loadProductList())
            .map(item => new Product(item));
    }

    getProductById(id: string): IProduct {
        return this.items.find(item => item.id === id);
    }
}