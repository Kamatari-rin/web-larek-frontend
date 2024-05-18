import { IPopup } from "../../types";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../Base/Events";


export class Popup extends EventEmitter implements IPopup {
    protected closeButton: HTMLButtonElement;
    protected content: HTMLElement;

    constructor(public container: HTMLElement) {
        super();
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.content = ensureElement<HTMLElement>('.modal__content', container);

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this.content.addEventListener('click', (evt) => evt.stopPropagation());
    }

    setContent(value: HTMLElement) {
        this.content = value;
        this.container.querySelector('.modal__content').replaceChildren(this.content);
    }
    
    open(): void {
        this.container.classList.add('modal_active');
        this.emit('popupOpened');
    }
    close(): void {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.emit('popupClosed');
    }
}