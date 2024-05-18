import { EventEmitter } from "../components/Base/Events";


export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    productIsBasket: boolean;

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
    productIsBasket: boolean;
}

export interface IProductDefault extends IProductShort {
    id: string;
    image: string;
    title: string;
    category: string;
    price: string;
    productIsBasket: boolean;
}

export interface IProductFull extends IProductDefault {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: string;
    productIsBasket: boolean;
}

export interface IOrder {
    setPayment(value: string): void;
    setEmail(value: string): void;
    setPhone(value: string): void;
    setAddress(value: string): void;
    setOrder(value: IProduct[]): void;
}

export interface IConfirmedOrder {
    id: string;
    total: number;
}

export interface IForm {
    clearValue(): void;
    setButtonText(data: string): void;
    render(): HTMLFormElement;
}

export interface IFormConstructor {
    new (formTemplate: HTMLTemplateElement): IForm;
}

export interface IPopup extends EventEmitter {
    container: HTMLElement;
    open(): void;
    close(): void;
    setContent(value: HTMLElement): void; 
}

export interface IView<T> {
    render(data: T): HTMLElement;
}

export interface IViewConstructor<T> {
    new(template: HTMLElement, event: Function): IView<T>;
}