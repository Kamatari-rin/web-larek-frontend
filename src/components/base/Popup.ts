import { ensureElement } from "../../utils/utils";

export interface IPopup {

    container: HTMLElement;
    open(): void;
    close(): void;
    setContent(value: HTMLElement): void; 
}

export class Popup implements IPopup {
    protected closeButton: HTMLButtonElement;
    protected content: HTMLElement;

    constructor(public container: HTMLElement) {

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
    }
    close(): void {
        this.container.classList.remove('modal_active');
        this.content = null;
    }
}