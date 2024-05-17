import { IConfirmedOrder, IView } from "../../types";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../Base/Events";

export class SuccessView extends EventEmitter implements IView<IConfirmedOrder> {
    protected container: HTMLElement;
    protected total: HTMLElement;
    
    constructor(template: HTMLTemplateElement) {
        super();
        this.container = template.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
        this.total = ensureElement<HTMLElement>('.order-success__description', this.container);
        ensureElement<HTMLButtonElement>('.order-success__close', this.container)
            .addEventListener('click', () => this.emit('order_complete'));
    }

    protected _setTotal(data: IConfirmedOrder) {
        this.total.textContent = `Списано ${data.total} синапсов`;
        return this;
    }

    render(data: IConfirmedOrder): HTMLElement {
        this._setTotal(data);
        return this.container;
    }
}