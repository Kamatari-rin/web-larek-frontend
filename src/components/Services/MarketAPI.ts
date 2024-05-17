import { IMarketAPI, IProduct } from "../../types";
import { Api, ApiListResponse } from "../Base/API";

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