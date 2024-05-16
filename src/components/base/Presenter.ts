import { IProductDefault } from "../../types";
import { ensureElement } from "../../utils/utils";
import { ProductList } from "../Model/Product";
import { MarketAPI, UserAPI } from "./api";
import { ListView } from "../View/View";
import { templates } from "../../utils/constants";

import { Popup, IPopup } from "./Popup";
import { EventEmitter } from "./events";
import { AddressForm, Form } from "../View/FormView";
import { BasketView } from "../View/BasketView";
import { IOrder, Order } from "../Model/Order";
import { CardViewFull, CardView } from "../View/CardView";
import { SuccessView } from "../View/SuccessView";
import { Basket, IBasket } from "../Model/Basket";

export class Presenter extends EventEmitter {
    private galleryElement: HTMLElement
    private popup: IPopup;
    private userOrder: IOrder;
    
    protected products: ProductList;
    protected cart: IBasket;
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
            
            
            this.cart = new Basket();
            this.basketView = new BasketView(templates.basketTemplate, templates.cardBasketTemplate);        
            this.openCartButton.addEventListener('click', () => this.emit('clicToCart'));

            this.addressForm = new AddressForm(templates.orderTemplate);
            this.tellAndEmailForm = new Form(templates.contactsTemplate);
            this.successModal = new SuccessView(templates.successTemplate);                

            this.userOrder = new Order;
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
        this.userOrder.setOrder(this.cart.getCart());
    }

    protected placeUserOrder() {
        this.userAPI.placeOrder(this.userOrder).then(result => {
            this.popup.setContent(this.successModal.render(result));
            this.popup.open();
        });
    }

    protected handlerOrderIsComplete() {
        this.cart.clearCart();
        this.popup.close();
        console.log(this.cart);
    }

    protected handlerPickUpProduct(itemID: {id: string}) {
        const openedProduct = new CardViewFull(templates.cardPreviewTemplate, this.handlerAddInCart.bind(this))
                .render(this.products.getProductById(itemID.id).toProductFull());
        this.popup.container.querySelector('.modal__content')
                .replaceChildren(openedProduct);
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
        this.popup.setContent(this.basketView.render(this.cart.getCart(), this.handlerRemoveFromCart));              
        this.popup.open();
    }

    protected handlerAddInCart(itemID: {id: string}) {
        this.cart.add(this.products.getProductById(itemID.id));
    }

    protected handlerRemoveFromCart(itemID: {id: string}) {
        this.cart.remove(itemID.id);
    }

    protected handlerUpdateCart() {
        this.basketView.render(this.cart.getCart(), this.handlerRemoveFromCart);
        this.openCartButton.querySelector('.header__basket-counter').textContent = this.cart.length();
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    setEvents() {
        this.on('clicToCart', () => this.handlerOpenCart());
        this.cart.on('cartUpdate', () => this.handlerUpdateCart());
        this.basketView.on('delete', (data: {id: string}) => this.handlerRemoveFromCart(data));
        this.basketView.on('checkout', () => this.handlerCheckout());


        this.addressForm.on('pay', (data: {inputs: HTMLInputElement[]}) => this.handlerFormAddress(data));
        this.addressForm.on('changePayMethod', (data: {method: string}) => this.handlerChangePayMethod(data));
        this.tellAndEmailForm.on('pay', (data: {inputs: HTMLInputElement[]}) => this.handlerFormTellAndEmail(data));
        this.successModal.on('order_complete', () => this.handlerOrderIsComplete());
    }

    init() {
        this.setEvents();
        this.products = new ProductList(this.marketAPI);
        const catalogUI = new ListView<IProductDefault>
            (CardView, templates.cardCatalogTemplate, this.galleryElement, this.handlerPickUpProduct.bind(this));
        this.products.load().then(() => {
            catalogUI.render(this.products.items.map(card => card.toProductDefault()));
        });
    }            
}