import { IProduct } from "../../types";
import { EventEmitter } from "../base/events";

export interface IBasket extends EventEmitter {
    add(product: IProduct): void;
    remove(productID: string): void;
    length(): string;
    getCart(): Set<IProduct>;
    clearCart(): void;
}

export class Basket extends EventEmitter implements IBasket {
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
        this.cart.forEach(item => {
                if (item.id === productID) this.cart.delete(item)
        }); 
        this.emit('cartUpdate');
    }

    length(): string {
       return this.cart.size.toString();     
    }

    getCart (): Set<IProduct>{
        return this.cart;
    }
    clearCart(): void {
        this.cart.clear();
        this.emit('cartUpdate');
    }
}