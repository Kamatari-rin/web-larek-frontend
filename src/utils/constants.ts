export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
import { ensureElement } from "../utils/utils";

export const settings = {
    CardCategory: new Map<string, string>([
        ["софт-скил", "card__category_soft"],
        ["хард-скил", "card__category_hard"],  
        ["другое", "card__category_other"], 
        ["дополнительное", "card__category_additional"],
        ["кнопка", "card__category_button"],
    ]),
    API_URL: 'https://larek-api.nomoreparties.co/api/weblarek',
    CDN_URL: `https://larek-api.nomoreparties.co/content/weblarek`

};

export const templates = {
    cardCatalogTemplate: ensureElement<HTMLTemplateElement>('#card-catalog'),
    successTemplate: ensureElement<HTMLTemplateElement>('#success'),
    cardPreviewTemplate: ensureElement<HTMLTemplateElement>('#card-preview'),
    cardBasketTemplate: ensureElement<HTMLTemplateElement>('#card-basket'),
    basketTemplate: ensureElement<HTMLTemplateElement>('#basket'),
    orderTemplate: ensureElement<HTMLTemplateElement>('#order'),
    contactsTemplate: ensureElement<HTMLTemplateElement>('#contacts')
}

export const validateErrors = {
    payMethodNotSelectedError: 'Не выбран способ оплаты!',
    fildNotFillError: 'Заполните все поля',
    addressIsShortError: 'Поле Адрес должно содержать минимум 10 символов!',
    phoneIsWrongError: 'Не верный номер телефона',
    emailIsWrongError: 'Не верный формат email',
}

export const regexValidate = {
    EMAIL_REGEXP: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
    PHONE_REGEXP: /\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}/
}
