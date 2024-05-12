import { IProductDefault, IProductFull, IProductShort } from "../../types";
import { ensureElement } from "../../utils/utils";
import { CardView, CardViewFull, CardViewShort } from "./CardView";
import { ProductList } from "./Product";
import { MarketAPI } from "./api";
import { ListView } from "./ui";
import { templates } from "../../utils/constants";

import { Popup, IPopup } from "./Popup";
import { Cart, ICart } from "./Cart";
import { EventEmitter } from "./events";
import { InputAddressForm } from "./Form";

export class Presenter extends EventEmitter {
    private galleryElement: HTMLElement
    private popup: IPopup;
    
    protected products: ProductList;
    protected cart: ICart;

    private openCartButton: HTMLButtonElement;
    private modalCart: HTMLElement;

    constructor(protected page: HTMLElement,
                protected marketAPI: MarketAPI) {
            super();
            this.galleryElement = ensureElement<HTMLElement>('.gallery');
            this.popup = new Popup(ensureElement<HTMLElement>('#modal-container'));
            this.openCartButton = ensureElement<HTMLButtonElement>('.header__basket');
            this.modalCart = ensureElement<HTMLElement>('.basket__list'); 

            this.cart = new Cart();
            this.openCartButton.addEventListener('click', () => this.emit('clicToCart'));
    }

    protected handlerPickUpProduct(itemID: {id: string}) {
        const openedProduct = new CardViewFull(templates.cardPreviewTemplate, this.handlerAddInCart.bind(this))
                .render(this.products.getProductById(itemID.id).toProductFull());
        this.popup.container.querySelector('.modal__content')
                .replaceChildren(openedProduct);
        this.popup.open();
    }

    protected handlerAddInCart(itemID: {id: string, element: CardViewFull<IProductFull>, data: IProductFull}) {
        if(itemID.id) {
            this.cart.add(this.products.getProductById(itemID.id));
        }
    }

    protected handlerRemoveFromCart(itemID: {id: string}) {
        console.log('delete');
        
    }

    protected handlerCheckout(cartTotal: {total: string}) {
        const inputAddressForm = new InputAddressForm(templates.orderTemplate);
        this.popup.setContent(inputAddressForm.render());
        this.popup.open();
    }

    protected handlerUpdateCart() {
        this.openCartButton.querySelector('.header__basket-counter').textContent = this.cart.length();
        const test =new ListView<IProductShort>(CardViewShort, templates.cardBasketTemplate, this.modalCart, this.handlerRemoveFromCart.bind(this))
            .render(
                Array.from(this.cart.getCart())
                        .map(item => item.toProductShort())
            );
    }

    protected handlerOpenCart() {
        this.popup.setContent(this.page.querySelector('.basket').cloneNode(true) as HTMLElement);
        this.popup.container.querySelector('.button').addEventListener('click', () => this.emit('checkout'));
        this.on('checkout', this.handlerCheckout.bind(this));
        this.on('delete', this.handlerRemoveFromCart);                   
        this.popup.open();
    }

    setEvents() {
        
        this.on('clicToCart', () => this.handlerOpenCart());
        this.cart.on('cartUpdate', () => this.handlerUpdateCart());
    }

    init() {
        this.setEvents();
        this.products = new ProductList(this.marketAPI);
        const catalogUI = new ListView<IProductDefault>(CardView, templates.cardCatalogTemplate, this.galleryElement, this.handlerPickUpProduct.bind(this));
        this.products.load().then(() => {
            catalogUI.render(this.products.items.map(card => card.toProductDefault()));
        });
    }            
}