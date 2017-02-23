import {Control} from '../../Control';
import Data from '../../Data';

export class Button extends Control {
    private $element: HTMLElement;

    constructor(data) {
        super();
        this.createControl(document.getElementsByTagName('body')[0], data);
    }

    public setProperty(property: string): void {
    }

    propertyChange(entity: Data, property: string, oldValue, newValue) {
    }

    protected createControl(parent: HTMLElement, data: JSON) {
        if (typeof(data) === 'string') {
            this.id = data;
        } else {
            this.id = data['id'];
        }
        this.$element = document.createElement('button');
        if (data instanceof Object) {
            for (let attr in data) {
                if (!data.hasOwnProperty(attr)) {
                    continue;
                }
                this.$element.setAttribute(attr, data[attr]);
            }
        }
        parent.appendChild(this.$element);
    }
}
