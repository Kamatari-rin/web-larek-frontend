import { ensureAllElements, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";

export interface IForm {
    clearValue(): void;
    setButtonText(data: string): void;
    render(): HTMLFormElement;
}

export interface IFormConstructor {
    new (formTemplate: HTMLTemplateElement): IForm;
}

export class Form extends EventEmitter implements IForm {
    protected formElement: HTMLFormElement;
    public inputFields: HTMLInputElement[];
    protected submitButton: HTMLButtonElement;

    constructor(formTemplate: HTMLTemplateElement) {
        super();
        this.formElement = formTemplate.content.querySelector('form')
            .cloneNode(true) as HTMLFormElement;
        this.inputFields = ensureAllElements<HTMLInputElement>('.form__input', this.formElement); 
        this.submitButton = ensureElement<HTMLButtonElement>('.button', this.formElement);
        
        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.emit('pay', {inputs: this.getInputs()});
        });

        this.inputFields.forEach(input => {
            input.addEventListener('input', () => {
                const isValid = input.value.length > 3;
                this.setSubmitButtonState(isValid) 
            });
        })
    }
    
    getInputs(): HTMLInputElement[] {
        return this.inputFields;
    }
    
    setSubmitButtonState(isFormValid: boolean): void {
        isFormValid ? this.submitButton.removeAttribute('disabled') : this.submitButton.setAttribute('disabled', 'true');
    }

    clearValue(): void {
        this.formElement.reset();
    }

    setButtonText(data: string): void {
        this.submitButton.textContent = data;
    }

    render(): HTMLFormElement {
        return this.formElement;
    }
}

export class AddressForm extends Form {
    protected payOnlainButton: HTMLButtonElement;
    protected payCashButton: HTMLButtonElement;

    constructor(template: HTMLTemplateElement) {
        super(template);
        this.formElement.querySelectorAll('button').forEach(button => {
            if(button.name === 'card') this.payOnlainButton = button;
            if(button.name === 'cash') this.payCashButton = button;
        });

        this.payOnlainButton.addEventListener('click', () => this.emit('changePayMethod', {method: 'onlain'}));
        this.payCashButton.addEventListener('click', () => this.emit('changePayMethod', {method: 'cash'}));
    }
}
