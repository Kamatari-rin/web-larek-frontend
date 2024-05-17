import { IForm } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";

export class Form extends EventEmitter implements IForm {
    protected formElement: HTMLFormElement;
    public inputFields: HTMLInputElement[];
    protected submitButton: HTMLButtonElement;
    protected isFormValid: boolean;
    protected inputFieldCount: number;

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

        this.inputFieldCount = 0;

        this.inputFields.forEach(input => {
            input.addEventListener('input', () => {
                this.isFormValid = input.value.length > 3;
                this.inputFieldCount++;
                this.setSubmitButtonState(); 
            });
        })
    }
    
    getInputs(): HTMLInputElement[] {
        return this.inputFields;
    }
    
    setSubmitButtonState(): void {
        this.isFormValid && this.inputFieldCount == this.inputFields.length ? 
            this.submitButton.removeAttribute('disabled') : this.submitButton.setAttribute('disabled', 'true');
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
    private isPayMethodSelect: boolean;

    constructor(template: HTMLTemplateElement) {
        super(template);
        this.formElement.querySelectorAll('button').forEach(button => {
            if(button.name === 'card') this.payOnlainButton = button;
            if(button.name === 'cash') this.payCashButton = button;
        });
        this.isPayMethodSelect = false;

        this.payOnlainButton.addEventListener('click', () => {
            this.tougleClassPayMethodButton('onlain');
            this.isPayMethodSelect = true;
            this.emit('changePayMethod', {method: 'onlain'});
            this.setSubmitButtonState();
        });
        this.payCashButton.addEventListener('click', () => {
            this.tougleClassPayMethodButton('cash');
            this.isPayMethodSelect = true;
            this.emit('changePayMethod', {method: 'cash'});
            this.setSubmitButtonState();
        });
    }

    setSubmitButtonState(): void {
        this.isFormValid && this.inputFieldCount == this.inputFields.length && this.isPayMethodSelect ? 
            this.submitButton.removeAttribute('disabled') : this.submitButton.setAttribute('disabled', 'true');
    }

    tougleClassPayMethodButton(button: string) {
        if(button === 'onlain') {
            this.payOnlainButton.classList.add('button_alt-active');
            this.payCashButton.classList.remove('button_alt-active');
        }

        if (button === 'cash') {
            this.payOnlainButton.classList.remove('button_alt-active');
            this.payCashButton.classList.add('button_alt-active');
        }
        
    }
}
