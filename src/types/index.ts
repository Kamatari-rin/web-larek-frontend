import { IConfirmedOrder, IOrder } from "../components/Model/Order";

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;

    toProductDefault(): IProductDefault;
    toProductFull(): IProductFull;
    toProductShort(): IProductShort;
}

export interface IMarketAPI {
    loadProductList(): Promise<IProduct[]>;
    loadProduct(id: string): Promise<IProduct>;
}

export interface IUserAPI {
    placeOrder(order: IOrder): Promise<IConfirmedOrder>;
}

export interface IProductShort {
    id: string;
    title: string;
    price: string;
}

export interface IProductDefault extends IProductShort {
    id: string;
    image: string;
    title: string;
    category: string;
    price: string;
}

export interface IProductFull extends IProductDefault {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: string;
}

