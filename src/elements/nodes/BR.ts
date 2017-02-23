import {Control} from '../../Control';

export class BR extends Control {
    constructor(data) {
        super();
        this.createControl(document.getElementsByTagName('body')[0], data);
    }

    protected createControl(parent: HTMLElement, data: JSON) {
        let label = document.createElement('br');
        for (let attr in data) {
            if (!data.hasOwnProperty(attr)) {
                continue;
            }
            label.setAttribute(attr, data[attr]);
        }
        parent.appendChild(label);
    }
}
