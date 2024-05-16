
export interface IView<T> {
    render(data: T): HTMLElement;
}

interface IViewConstructor<T> {
    new(template: HTMLElement, event: Function): IView<T>;
}

export class ListView<T> implements IView<T[]> {
    constructor(protected ItemView: IViewConstructor<T>, 
                protected template: HTMLTemplateElement,
                public parentElement: HTMLElement, public event: Function) {}

    render(data: T[]) {
        this.parentElement.replaceChildren(
            ...data.map(item => (new this.ItemView(this.template, this.event))
                   .render(item))
        );

        return this.parentElement;
    }
}

export class View<T> implements IView<T> {
    constructor(protected ItemView: IViewConstructor<T>, 
        protected template: HTMLTemplateElement,
        public parentElement: HTMLElement, public event: Function) {}

    render(data: T): HTMLElement {
        
        this.parentElement.replaceChildren(
            new this.ItemView(this.template, this.event).render(data)
        )
        return this.parentElement;
    }    
}