import { IView, IViewConstructor } from "../../types";

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