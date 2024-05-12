import { ensureAllElements, ensureElement } from "../../utils/utils";

export interface IForm {
    buttonText: string;
    setHandler(handletFormSubmit: Function): void;
    render(): HTMLFormElement;
    clearValue(): void;
}

export interface IFormConstructor {
    new (formTemplate: HTMLTemplateElement): IForm;
}

export abstract class Form implements IForm {
    protected formElement: HTMLFormElement;
    // protected inputField: HTMLInputElement[];
    protected handleFormSubmit: Function;
    protected submitButton: HTMLButtonElement;

    constructor(formTemplate: HTMLTemplateElement) {
        this.formElement = formTemplate.content.querySelector('form')
            .cloneNode(true) as HTMLFormElement;
        // this.inputField = ensureAllElements<HTMLInputElement>('form__input', this.formElement); 
        // this.submitButton = ensureElement<HTMLButtonElement>('submit', this.formElement);
        
        // this.formElement.addEventListener('submit', (evt) => {
        //     evt.preventDefault();
        //     this.handleFormSubmit(this.inputField);
        // });
    }

    setHandler(handletFormSubmit: Function): void {
        this.handleFormSubmit = handletFormSubmit;
    }

    render(): HTMLFormElement {
        return this.formElement;
    }

    clearValue(): void {
        this.formElement.reset();
    }

    set buttonText(data: string) {
        this.submitButton.textContent = data;
    }
}

export class InputAddressForm extends Form {
    
}