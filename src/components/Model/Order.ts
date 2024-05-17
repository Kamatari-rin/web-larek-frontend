import { IConfirmedOrder, IOrder, IProduct } from "../../types";

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

    setOrder(order: IProduct[]): void {
        this.items = order.map(product => product.id);
        this.total = order.reduce((total, item) => total + item.price, 0);
    }
}

export class ConfirmedOrder implements IConfirmedOrder {
    id: string;
    total: number;
}