import { IProduct } from "../../types";

export interface IOrder {
    setPayment(value: string): void;
    setEmail(value: string): void;
    setPhone(value: string): void;
    setAddress(value: string): void;
    setOrder(value: Set<IProduct>): void;
}

export interface IConfirmedOrder {
    id: string;
    total: number;
}

export class Order implements IOrder {
    private payment: string;
    private email: string;
    private phone: string;
    private address: string;
    private total: number;
    private items: string[];

    constructor() {}

    setPayment(value: string): void {
        if(value) this.payment = value;
    }
    
    setEmail(value: string): void {
        if(value) this.email = value;
    }

    setPhone(value: string): void {
        if(value) this.phone = value;
    }

    setAddress(value: string): void {
        if(value) this.address = value;
    }

    protected setTotal(value: number): void {
        if(value) this.total = value;
    }

    setOrder(order: Set<IProduct>): void {
        this.items = Array.from(order).map(product => product.id);
        this.total = Array.from(order).reduce((total, item) => total + item.price, 0);
    }
}

export class ConfirmedOrder implements IConfirmedOrder {
    id: string;
    total: number;
}