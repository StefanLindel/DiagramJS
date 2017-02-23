import {Control} from '../../Control';

export class Label extends Control {
    constructor(data) {
        super();
        this.createControl(document.getElementsByTagName('body')[0], data);
    }

    protected createControl(parent: HTMLElement, data: JSON) {
        let label = document.createElement('label');
        for (let attr in data) {
            if (!data.hasOwnProperty(attr)) {
                continue;
            }
            if (attr === 'textContent') {
                label.textContent = data['textContent'];
            } else {
                label.setAttribute(attr, data[attr]);
            }
        }
        parent.appendChild(label);
    }
}
