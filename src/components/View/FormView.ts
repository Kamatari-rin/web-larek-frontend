import { IForm } from "../../types";
import { regexValidate, validateErrors } from "../../utils/constants";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../Base/Events";


export abstract class Form extends EventEmitter implements IForm {
    protected formElement: HTMLFormElement;
    public inputFields: HTMLInputElement[];
    protected submitButton: HTMLButtonElement;
    protected isFormValid: boolean;
    protected formErrors: HTMLElement;

    constructor(formTemplate: HTMLTemplateElement) {
        super();
        this.formElement = formTemplate.content.querySelector('form')
            .cloneNode(true) as HTMLFormElement;
        this.inputFields = ensureAllElements<HTMLInputElement>('.form__input', this.formElement); 
        this.submitButton = ensureElement<HTMLButtonElement>('.button', this.formElement);
        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.formElement);
        this.isFormValid = false

        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.emit('pay', {inputs: this.getInputs()});
            this.isFormValid = false
        });

        this.inputFields.forEach(input => {
            input.addEventListener('input', () => this.validateForm(input));
        });
    }

    protected abstract validateInput(input: HTMLInputElement): void;

    protected abstract validateForm(input?: HTMLInputElement): void;

    
    protected setSubmitButtonState(error: string): void {
        if (this.isFormValid) {
            this.submitButton.removeAttribute('disabled');
            this.formErrors.textContent = '';
        } else {
            this.submitButton.setAttribute('disabled', 'true');
            this.formErrors.textContent = error;
        }
    }

    getInputs(): HTMLInputElement[] {
        return this.inputFields;
    }

    clearValue(): void {
        this.formElement.reset();
        this.setSubmitButtonState('Заполните все поля');
    }

    setButtonText(data: string): void {
        this.submitButton.textContent = data;
    }

    render(): HTMLFormElement {
        return this.formElement;
    }
}

export class TellAndEmailForm extends Form {
    private isPhoneValid: boolean;
    private isEmailValid: boolean;

    constructor(template: HTMLTemplateElement) {
        super(template);
        this.isPhoneValid = false;
        this.isEmailValid = false;
    }

    protected validateForm(input?: HTMLInputElement): void {
        this.validateInput(input);

        let error: string;
        
        if (!this.isEmailValid && !this.isPhoneValid) error = validateErrors.fildNotFillError;
        if (!this.isEmailValid && this.isPhoneValid) error = validateErrors.emailIsWrongError;
        if (this.isEmailValid && ! this.isPhoneValid) error = validateErrors.phoneIsWrongError;
        
        this.isFormValid = this.isEmailValid && this.isPhoneValid;

        this.setSubmitButtonState(error);
    }

    protected validateInput(input: HTMLInputElement): void {
        switch(input.name) {
            case 'phone': {
                this.isPhoneValid = regexValidate.PHONE_REGEXP.test(input.value);
                break
            }
            case 'email': {
                this.isEmailValid = regexValidate.EMAIL_REGEXP.test(input.value);
            }
        }
    }

    clearValue(): void {
        this.formElement.reset();
        this.isEmailValid = false;
        this.isPhoneValid = false;
        this.isFormValid = false;
        this.setSubmitButtonState('Заполните все поля');
    }
}

export class AddressForm extends Form {
    private payOnlainButton: HTMLButtonElement;
    private payCashButton: HTMLButtonElement;
    private isPayMethodSelect: boolean;
    private isInputValid: boolean;

    constructor(template: HTMLTemplateElement) {
        super(template);

        this.formElement.querySelectorAll('button').forEach(button => {
            if (button.name === 'card') this.payOnlainButton = button;
            if (button.name === 'cash') this.payCashButton = button;
        }); 

        this.formElement.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                this.tougleClassPayMethodButton(button.name);
                this.isPayMethodSelect = true;
                this.emit('changePayMethod', {method: button.name})
                this.validateForm()
            });
        });

        this.isInputValid = false;
        this.isPayMethodSelect = false;
    }

    protected validateInput(input: HTMLInputElement): void {
        if (input.value.length > 10) {
            this.isInputValid = true; 
        } else {this.isInputValid = false;}
    }

    protected validateForm(input?: HTMLInputElement): void {
        if (input) this.validateInput(input);
        let error: string;

        if (!this.isPayMethodSelect && !this.isInputValid) error = validateErrors.fildNotFillError;
        if (this.isPayMethodSelect && !this.isInputValid) error = validateErrors.addressIsShortError;
        if (!this.isPayMethodSelect && this.isInputValid) error = validateErrors.payMethodNotSelectedError;
        this.isFormValid = this.isInputValid && this.isPayMethodSelect;
        this.setSubmitButtonState(error);
    }

    protected setSubmitButtonState(error: string): void {
        if (this.isFormValid) {
            this.formErrors.textContent = '';
            this.submitButton.removeAttribute('disabled')
        } else {
            this.formErrors.textContent = error;
            this.submitButton.setAttribute('disabled', 'true');
        }  
    }

    clearValue(): void {
        this.formElement.reset();
        this.isFormValid = false;
        this.isInputValid = false;
        this.isPayMethodSelect = false;
        this.resetMethodPayBatton();
        this.setSubmitButtonState(validateErrors.fildNotFillError);
    }

    private resetMethodPayBatton() {
        this.isPayMethodSelect = false;
        if (this.payCashButton) this.payCashButton.classList.remove('button_alt-active');    
        if (this.payOnlainButton) this.payOnlainButton.classList.remove('button_alt-active');
    }

    private tougleClassPayMethodButton(payMethod: string) {
        if(payMethod === 'card') {
            this.payOnlainButton.classList.add('button_alt-active');
            this.payCashButton.classList.remove('button_alt-active');
        }

        if (payMethod === 'cash') {
            this.payOnlainButton.classList.remove('button_alt-active');
            this.payCashButton.classList.add('button_alt-active');
        }
    }
}
