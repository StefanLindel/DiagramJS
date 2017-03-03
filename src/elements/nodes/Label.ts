import {Control} from "../../Control";

export class Label extends Control {
    constructor(data) {
        super();
    }


    public load(data): any {
        this.createControl(this.$owner, data);
    }

    protected createControl(parent: Control, data: JSON) {
        this.$view = document.createElement('label');
        for (let attr in data) {
            if (!data.hasOwnProperty(attr)) {
                continue;
            }
            if (attr === 'textContent') {
                this.$view.textContent = data['textContent'];
            } else {
                this.$view.setAttribute(attr, data[attr]);
            }
        }
        parent.appendChild(this);
    }
}
