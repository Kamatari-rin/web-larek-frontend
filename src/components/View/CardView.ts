import { IProductDefault, IProductFull, IProductShort } from "../../types";
import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { IView } from "./View";

export class CardViewShort<T extends IProductShort> extends EventEmitter implements IView<T> {
    protected container: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(template: HTMLTemplateElement) {
        super();
        this.container = template.content.querySelector('.card').cloneNode(true) as HTMLElement;
        this._title = ensureElement<HTMLElement>('.card__title', this.container);
        this._price = ensureElement<HTMLElement>('.card__price', this.container);
    }

    protected _setCardTitle<T extends IProductShort>(data: T) {
        if(this._title) this._title.textContent = data.title;
        return this;
    }

    protected _setPrice<T extends IProductShort>(data: T) {
        if(this._price) this._price.textContent = data.price;
        return this;
    }

    render(data: T): HTMLElement {
        if(this.container) {
            this.container.setAttribute('id', data.id);
            this._setCardTitle(data)
                ._setPrice(data)
        }
        return this.container;
    }
}

export class CardView<T extends IProductDefault> extends CardViewShort<T> implements IView<T> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    private CardCategory: Map<string, string> = settings.CardCategory;

    constructor(template: HTMLTemplateElement, protected event: Function) {
        super(template);
        this._category = ensureElement<HTMLElement>('.card__category', this.container);
        this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
    }

    protected _setCategory<T extends IProductDefault>(data: T) {
        if(this._category) this._category.textContent = data.category;
        this._category.classList.add(
            this.CardCategory.has(data.category) ? this.CardCategory.get(data.category) : "card__category_other");
        return this;
    }

    protected _setImage<T extends IProductDefault>(data: T) {
        if(this._image) {
            this._image.src = data.image;
            this._image.alt = data.title;
        }    
        return this;
    }

    render(data: T): HTMLElement {
        this._setCardTitle(data)
            ._setPrice(data)
            ._setCategory(data)
            ._setImage(data)

        this.container.addEventListener('click', () => this.emit('openModal', {id: data.id}));    
        this.on('openModal', this.event.bind(this));

        return this.container;
    }
}

export class CardViewFull<T extends IProductFull> extends CardView<T> implements IView<T> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    
    constructor(template: HTMLTemplateElement, protected event: Function) {
        super(template, event);
        this._description = ensureElement<HTMLElement>('.card__text', this.container);
        this._button = this.container.querySelector<HTMLButtonElement>('.card__button');
    }
    
    protected _setDescription<T extends IProductFull>(data: T) {
        if(this._description) this._description.textContent = data.description;
        return this;
    }

    protected _setEventt<T extends IProductFull>(data: T) {
        this._button.addEventListener('click', () => this.emit('add', {id: data.id}));
        this.on('add', this.event.bind(this));
    }

    render(data: T): HTMLElement {
        this._setCardTitle(data)
            ._setCategory(data)
            ._setDescription(data)
            ._setImage(data)
            ._setPrice(data)
            ._setEventt(data);
        return this.container;
    }
}