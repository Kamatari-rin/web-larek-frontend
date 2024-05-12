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

