# Проектная работа "Веб-ларек"


Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```npm
npm run build
```

или

```
yarn build

```
----------------------------------------------------------------------------------------------------------------------------------------

## Документация

----------------------------------------------------------------------------------------------------------------------------------------

## Типы данных

----------------------------------------------------------------------------------------------------------------------------------------

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    productIsBasket: boolean;

    toProductDefault(): IProductDefault;
    toProductFull(): IProductFull;
    toProductShort(): IProductShort;
}

export interface IMarketAPI {
    loadProductList(): Promise<IProduct[]>;
    loadProduct(id: string): Promise<IProduct>;
}

export interface IUserAPI {
    placeOrder(order: IOrder): Promise<IConfirmedOrder>;
}

export interface IProductShort {
    id: string;
    title: string;
    price: string;
    productIsBasket: boolean;
}

export interface IProductDefault extends IProductShort {
    id: string;
    image: string;
    title: string;
    category: string;
    price: string;
    productIsBasket: boolean;
}

export interface IProductFull extends IProductDefault {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: string;
    productIsBasket: boolean;
}

export interface IOrder {
    setPayment(value: string): void;
    setEmail(value: string): void;
    setPhone(value: string): void;
    setAddress(value: string): void;
    setOrder(value: IProduct[]): void;
}

export interface IConfirmedOrder {
    id: string;
    total: number;
}

export interface IForm {
    clearValue(): void;
    setButtonText(data: string): void;
    render(): HTMLFormElement;
}

export interface IFormConstructor {
    new (formTemplate: HTMLTemplateElement): IForm;
}

export interface IPopup extends EventEmitter {
    container: HTMLElement;
    open(): void;
    close(): void;
    setContent(value: HTMLElement): void; 
}

----------------------------------------------------------------------------------------------------------------------------------------

## View

----------------------------------------------------------------------------------------------------------------------------------------

interface IView<T> 
    render(data: T): HTMLElement; 

interface IViewConstructor<T> 
    new(template: HTMLElement, event: Function): IView<T>;

class ListView<T> implements IView<T[]>
constructor(protected ItemView: IViewConstructor<T>, 
                protected template: HTMLTemplateElement,
                public parentElement: HTMLElement, public event: Function) {}

render(data: T[]) - Получает массив данных рендерит и рендерит каждый элемент по шаблону заданному в конструкторе, 
после этого заменяет данные в родительскиом элементе списком полученных. 

----------------------------------------------------------------------------------------------------------------------------------------

CardViewShort<T extends IProductShort> extends EventEmitter implements IView<T> - Класс для рендера карточки для показа в корзине
constructor(template: HTMLTemplateElement)

_setCardTitle<T extends IProductShort>(data: T) - Устанавливает заголовок в карточке.
_setPrice<T extends IProductShort>(data: T) - Устанавливает цену в карточке.
render(data: T): HTMLElement - Получает данные о продукте и заполняет ими элемент карточки полученный из шаблона.

----------------------------------------------------------------------------------------------------------------------------------------

class CardView<T extends IProductDefault> extends CardViewShort<T> implements IView<T> - Класс для рендера карточки для главной страницы
constructor(template: HTMLTemplateElement, protected event: Function)

_setCategory<T extends IProductDefault>(data: T) - Устанавливает категорию карточки
_setImage<T extends IProductDefault>(data: T) - Устанавливает картинку карточки

----------------------------------------------------------------------------------------------------------------------------------------

class CardViewFull<T extends IProductFull> extends CardView<T> implements IView<T> - Класс для рендера карточки для превью
constructor(template: HTMLTemplateElement, protected event: Function)

_setDescription<T extends IProductFull>(data: T) - Устанавливает полное описание карточки
_setEvent<T extends IProductFull>(data: T) - Устанавливает событие при нажатии на кнопку "Купить"

----------------------------------------------------------------------------------------------------------------------------------------

class SuccessView extends EventEmitter implements IView<IConfirmedOrder> - Класс для рендера окна сообщающего о удачном размещении заказа
constructor(template: HTMLTemplateElement)

_setTotal(data: IConfirmedOrder) - Устанавливает сумму заказа
render(data: IConfirmedOrder): HTMLElement - Получает информацию о успешном размещенном заказе и рендерит элемент в соотвествии с шаблоном.

----------------------------------------------------------------------------------------------------------------------------------------

class BasketView extends EventEmitter - Класс отвечает за рендер корзины и товаров в ней
constructor(basketTemplate: HTMLTemplateElement, protected productListTemplate: HTMLTemplateElement)

_renderProductList(data: IProduct[], deleteProductEvent: Function) - Рендерит лист товаров находящихся в корзине
_setBasketTotal(products: IProduct[]) - Считает и заполняет сумму всех товаров в корзине

----------------------------------------------------------------------------------------------------------------------------------------

class Form extends EventEmitter implements IForm
constructor(formTemplate: HTMLTemplateElement) 

getInputs(): HTMLInputElement[] - Получает массив инпутов формы
setSubmitButtonState(): void - Простая валидация которая блокирут кнопку отправки пока не заполненны все поля
clearValue(): void - Отчищает форму
setButtonText(data: string): void - Устанавливает текст на кнопке отправки формы
render(): HTMLFormElement - Возвращает элемент формы

----------------------------------------------------------------------------------------------------------------------------------------

class AddressForm extends Form - расширяет класс Form добавляя функционал в виде двух кнопок для методов оплаты
constructor(template: HTMLTemplateElement) 

tougleClassPayMethodButton(button: string) - Переключает стили при выборе метода оплаты

----------------------------------------------------------------------------------------------------------------------------------------

## Модель

----------------------------------------------------------------------------------------------------------------------------------------

### Product

class Product implements IProduct 
    constructor (data: IProduct){
        this.id = data.id;
        this.description = data.description;
        this.image = data.image;
        this.title = data.title;
        this.category = data.category;
        this.price = data.price;
        this.productIsBasket = false;
    }

    toProductDefault(): IProductDefault - Мапит IProduct в IProductDefault
    toProductFull(): IProductFull - Мапит IProduct в IProductFull
    toProductShort(): IProductShort - Мапит IProduct в IProductShort
    
class ProductList extends EventEmitter 
    items: IProduct[];

    constructor(protected api: IMarketAPI) {
        super();
    }

    load() - Получает данные с сервера и сохраняет их в items: IProduct[].
    getProductById(id: string): IProduct - Ищет товар в items по id, если находит возвращает этот товар.
    getProductsInBasket(): IProduct[] - Ищет товары которые в данный момент находятся в корзине пользователя и возвращает массив найденных товаров.    
    getBasketSize(): string - возвращает количество товаров которые находятся в корзине пользователя на данный момент.
    setProductIsBasket(productID: string, productIsBasket: boolean) - устанавливает продукту состояние нахождения в корзине
    clearUserCart() - отчищает корзину пользователя

----------------------------------------------------------------------------------------------------------------------------------------

### Order

class Order implements IOrder 
    private payment: string;
    private email: string;
    private phone: string;
    private address: string;
    private total: number;
    private items: string[];

    constructor() {}

    setPayment(value: string): void - Устанавливает тип оплаты в заказ пользователя.
    setEmail(value: string): void - Устанавливает емэйл в заказ пользователя.
    setPhone(value: string): void -Устанавливает телефон в заказ пользователя.
    setAddress(value: string): void -Устанавливает аддресс в заказ пользователя.
    protected setTotal(value: number): void - Устанавливает сумму заказа.
    setOrder(order: IProduct[]): void - Устанавливает товары из корзины в заказ пользователя.

class ConfirmedOrder implements IConfirmedOrder - Класс для хранения ответа сервера в случае успешного завершения заказа.
    id: string;
    total: number;

----------------------------------------------------------------------------------------------------------------------------------------    

## API
Класс API - базовы класс апи который выполняет post и get запросы на сервер и принимает ответ.

---------------------------------------------------------------------------------------------------------------------------------------- 

class UserAPI extends Api implements IUserAPI
placeOrder(order: IOrder): Promise<IConfirmedOrder>  - отправляет заказ пользователя на сервер.

---------------------------------------------------------------------------------------------------------------------------------------- 

class MarketAPI extends Api implements IMarketAPI
loadProductList(): Promise<IProduct[]> - делает запрос на загрузку списка продуктов
loadProduct(id: string): Promise<IProduct> - делает запрос на загрузку одного продукта по его id

---------------------------------------------------------------------------------------------------------------------------------------- 
## EventEmitter
Класс EventEmitter implements IEvents - брокер событий
