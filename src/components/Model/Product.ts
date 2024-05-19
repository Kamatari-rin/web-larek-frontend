import { IMarketAPI, IProduct, IProductDefault, IProductFull, IProductShort } from "../../types";
import { settings } from "../../utils/constants";
import { EventEmitter } from "../Base/Events";

export class Product implements IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    productIsBasket: boolean;
    
    constructor (data: IProduct){
        this.id = data.id;
        this.description = data.description;
        this.image = data.image;
        this.title = data.title;
        this.category = data.category;
        this.price = data.price;
        this.productIsBasket = false;
    }

    get url() {
        return `product/${this.id}`;
    }

    toProductDefault(): IProductDefault {
        return {
            id: `${this.id}`,
            image: settings.CDN_URL + this.image,
            title: `${this.title}`,
            category: `${this.category}`,
            price: this.price == null ? "Бесценно" : this.price.toString() + ' синапсов',
            productIsBasket: this.productIsBasket
        };
    }

    toProductFull(): IProductFull {
        return {
            id: `${this.id}`,
            description: `${this.description}`,
            image: settings.CDN_URL + this.image,
            title: `${this.title}`,
            category: `${this.category}`,
            price: this.price == null ? "Бесценно" : this.price.toString(),
            productIsBasket: this.productIsBasket
        };
    }

    toProductShort(): IProductShort {
        return {
            id: `${this.id}`,
            title: `${this.title}`,
            price: this.price == null ? "Бесценно" : this.price.toString(),
            productIsBasket: this.productIsBasket
        };
    }
}

export class ProductList extends EventEmitter {
    items: IProduct[];

    constructor(protected api: IMarketAPI) {
        super();
    }

    async load() {
        this.items = (await this.api.loadProductList())
            .map(item => new Product(item));
    }

    getProductById(id: string): IProduct {
        return this.items.find(item => item.id === id);
    }
    
    getProductsInBasket(): IProduct[] {
        return this.items.filter(item => item.productIsBasket === true);
    }

    getBasketSize(): string {
        return this.items.filter(item => item.productIsBasket).length.toString();
    }

    setProductIsBasket(productID: string, productIsBasket: boolean) {
        this.items.find(item => item.id === productID).productIsBasket = productIsBasket;
        this.emit('basketUpdate');
    }

    clearUserCart() {
        this.items.forEach(item => {
            if (item.productIsBasket) item.productIsBasket = false;
        })
        this.items = this.items.filter(item => item.productIsBasket == false);
        this.emit('basketUpdate');
    }
}