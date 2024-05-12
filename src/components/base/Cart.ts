import { IProduct } from "../../types";
import { EventEmitter } from "./events";

export interface ICart extends EventEmitter {
    add(product: IProduct): void;
    remove(productID: string): void;
    length(): string;
    getCart(): Set<IProduct>;
}

export class Cart extends EventEmitter implements ICart {
    private cart: Set<IProduct>;

    constructor(){
        super()
        this.cart = new Set<IProduct>;
    }

    add(product: IProduct): void {
        if(product) {
            this.cart.add(product);
            this.emit('cartUpdate');

        }
    }
    remove(productID: string): void {
        if(productID) {
            this.cart.forEach(item => item.id === productID && this.cart.delete(item));
            this.emit('cartUpdate');
        }
    }

    length(): string {
       return this.cart.size.toString();     
    }

    getCart (): Set<IProduct>{
        return this.cart;
    }
}