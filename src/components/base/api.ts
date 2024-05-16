import { IMarketAPI, IUserAPI, IProduct } from "../../types";
import { IConfirmedOrder, IOrder, Order } from "../Model/Order";

export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse(response: Response) {
        if (response.ok) {
            // console.log(response)
            return response.json();
        }
            
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    get<T>(uri: string): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse);
    }

    post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                        
export class MarketAPI extends Api implements IMarketAPI {
    async loadProductList(): Promise<IProduct[]> { 
        const result = await this.get<ApiListResponse<IProduct>>('/product');
        return result.items;
    }

    async loadProduct(id: string): Promise<IProduct> {
        const result = await this.get<ApiListResponse<IProduct>>(`/product/${id}`);
        return result.items[0];
    }
}

export class UserAPI extends Api implements IUserAPI {
    
    placeOrder(order: IOrder): Promise<IConfirmedOrder> {
        return this.post('/order', order);
    }
}