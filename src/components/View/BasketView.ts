import { IProduct, IProductShort } from "../../types";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { CardViewShort } from "./CardView";
import { ListView } from "./View";

export class BasketView extends EventEmitter {
    
    basketElement: HTMLElement;
    checkoutButton: HTMLButtonElement;
    productListView: HTMLElement;
    basketTotal: HTMLElement;

    constructor(basketTemplate: HTMLTemplateElement, protected productListTemplate: HTMLTemplateElement) {
        super();
        this.basketElement = basketTemplate.content.querySelector('.basket').cloneNode(true) as HTMLElement;
        this.productListView = ensureElement<HTMLElement>('.basket__list', this.basketElement);
        this.basketTotal = ensureElement<HTMLElement>('.basket__price', this.basketElement);
        this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', this.basketElement);

    }

    protected _renderProductList(data: IProduct[], deleteProductEvent: Function) {
       new ListView<IProductShort>(CardViewShort, this.productListTemplate, this.productListView, deleteProductEvent)
                .render(data.map(item => item.toProductShort()));

        this.productListView.querySelectorAll('.card').forEach((item, i = 0) => {
            item.querySelector('.basket__item-index').textContent = `${++i}`;
            item.querySelector('.basket__item-delete').addEventListener('click', () => this.emit('delete', {id: item.id}));
        });                                                                         
    }

    protected _setBasketTotal(products: IProduct[]) {
        this.basketTotal.textContent = products.reduce((summ, item) => summ + item.price, 0).toString() + ' синапсов'
    }

    render(products: IProduct[], deleteProductEvent: Function): HTMLElement {
        this._renderProductList(products, deleteProductEvent);
        this._setBasketTotal(products);
        this.checkoutButton.addEventListener('click', () => this.emit('checkout'));
        return this.basketElement;
    }
}