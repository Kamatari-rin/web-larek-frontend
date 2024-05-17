import { IOrder, IPopup, IProductDefault, IProductFull } from "../../types";
import { ensureElement } from "../../utils/utils";
import { ProductList } from "../Model/Product";
import { ListView } from "../View/View";
import { templates } from "../../utils/constants";

import { EventEmitter } from "../base/Events";
import { AddressForm, Form } from "../View/FormView";
import { BasketView } from "../View/BasketView";
import { CardViewFull, CardView } from "../View/CardView";
import { SuccessView } from "../View/SuccessView";
import { MarketAPI } from "./MarketAPI";
import { UserAPI } from "./UserAPI";
import { Order } from "../Model/Order";
import { Popup } from "./Popup";

export class Presenter extends EventEmitter {
    private galleryElement: HTMLElement;
    private productFullModal: HTMLElement;
    private popup: IPopup;
    private userOrder: IOrder;
    
    protected products: ProductList;

    protected basketView: BasketView;
    protected addressForm: AddressForm;
    protected tellAndEmailForm: Form;
    private openCartButton: HTMLButtonElement;
    private successModal: SuccessView;

    constructor(protected page: HTMLElement,
                protected marketAPI: MarketAPI,
                protected userAPI: UserAPI) {
            super();
            this.galleryElement = ensureElement<HTMLElement>('.gallery');
            this.popup = new Popup(ensureElement<HTMLElement>('#modal-container'));
            this.openCartButton = ensureElement<HTMLButtonElement>('.header__basket');
            
            
            this.basketView = new BasketView(templates.basketTemplate, templates.cardBasketTemplate);        
            this.openCartButton.addEventListener('click', () => this.emit('clicToCart'));

            this.addressForm = new AddressForm(templates.orderTemplate);
            this.tellAndEmailForm = new Form(templates.contactsTemplate);
            this.successModal = new SuccessView(templates.successTemplate);               

            this.userOrder = new Order;
    }

    protected handlerLockPage(value: boolean) {
        if (value) this.page.querySelector('.page__wrapper').classList.add('class', 'page__wrapper_locked');
        else this.page.querySelector('.page__wrapper').classList.remove('class', 'page__wrapper_locked');
    }

    protected createUserOrder(data: {inputs: HTMLInputElement[]}) {
        data.inputs.forEach(input => {
            switch(input.name) {
                case 'address': {
                    this.userOrder.setAddress(input.value);
                    break;
                }
                case 'email': {
                    this.userOrder.setEmail(input.value);
                    break;
                }
                case 'phone': {
                    this.userOrder.setPhone(input.value);
                }
            }
        });
        this.userOrder.setOrder(this.products.getProductsInBasket());
    }

    protected placeUserOrder() {
        this.userAPI.placeOrder(this.userOrder).then(result => {
            this.popup.setContent(this.successModal.render(result));
            this.popup.open();
        });
    }

    protected renderCardViewFull(product: {data: IProductFull}) {
        this.productFullModal = new CardViewFull(templates.cardPreviewTemplate, this.handlerAddInCart.bind(this))
                .render(this.products.getProductById(product.data.id).toProductFull());
    }

    protected handlerOrderIsComplete() {
        this.products.clearUserCart();
        this.popup.close();
    }

    protected handlerPickUpProduct(itemID: {id: string}) {
        this.renderCardViewFull({data: this.products.getProductById(itemID.id).toProductFull()})
        this.popup.setContent(this.productFullModal);
        this.popup.open();
    }

//////////////////////////////////////////////////////// Form Handlers //////////////////////////////////////////////////////

    protected handlerCheckout() {
        this.addressForm.clearValue();
        this.popup.setContent(this.addressForm.render()); 
        this.popup.open();
    }

    protected handlerFormAddress(data: {inputs: HTMLInputElement[]}) {
        this.createUserOrder(data);
        this.tellAndEmailForm.clearValue();
        this.popup.setContent(this.tellAndEmailForm.render());
        this.popup.open();
    }

    protected handlerFormTellAndEmail(data: {inputs: HTMLInputElement[]}) {
        this.createUserOrder(data);
        this.placeUserOrder();
    }

    protected handlerChangePayMethod(data: {method: string}) {
        this.userOrder.setPayment(data.method);
    }

////////////////////////////////////////////////////// Basket Handlers //////////////////////////////////////////////////////    

    protected handlerOpenCart() {
        this.popup.setContent(this.basketView.render(this.products.getProductsInBasket(), this.handlerRemoveFromCart));              
        this.popup.open();
    }

    protected handlerAddInCart(product: {data: IProductFull}) {
        this.products.setProductIsBasket(product.data.id, true);
        this.renderCardViewFull(product)
        this.popup.setContent(this.productFullModal)
        this.popup.open()
    }

    protected handlerRemoveFromCart(itemID: {id: string}) {
        this.products.setProductIsBasket(itemID.id, false);
    }

    protected handlerUpdateCart() {
        this.basketView.render(this.products.getProductsInBasket(), this.handlerRemoveFromCart);
        this.openCartButton.querySelector('.header__basket-counter').textContent = this.products.getBasketSize();
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    setEvents() {
        this.on('clicToCart', () => this.handlerOpenCart());
        this.products.on('basketUpdate', () => this.handlerUpdateCart());
        this.basketView.on('delete', (data: {id: string}) => this.handlerRemoveFromCart(data));
        this.basketView.on('checkout', () => this.handlerCheckout());


        this.addressForm.on('pay', (data: {inputs: HTMLInputElement[]}) => this.handlerFormAddress(data));
        this.addressForm.on('changePayMethod', (data: {method: string}) => this.handlerChangePayMethod(data));
        this.tellAndEmailForm.on('pay', (data: {inputs: HTMLInputElement[]}) => this.handlerFormTellAndEmail(data));
        this.successModal.on('order_complete', () => this.handlerOrderIsComplete());


        this.popup.on('popupOpened', () => this.handlerLockPage(true));
        this.popup.on('popupClosed', () => this.handlerLockPage(false));
    }

    init() {
        
        this.products = new ProductList(this.marketAPI);
        const catalogUI = new ListView<IProductDefault>
            (CardView, templates.cardCatalogTemplate, this.galleryElement, this.handlerPickUpProduct.bind(this));
        this.products.load().then(() => {
            catalogUI.render(this.products.items.map(card => card.toProductDefault()));
        });
        this.setEvents();
    }            
}