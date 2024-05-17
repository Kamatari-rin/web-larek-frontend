import { IConfirmedOrder, IOrder, IUserAPI } from "../../types";
import { Api } from "../base/API";

export class UserAPI extends Api implements IUserAPI {
    
    placeOrder(order: IOrder): Promise<IConfirmedOrder> {
        return this.post('/order', order);
    }
}