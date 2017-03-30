import {Control} from "../../Control";

export class BR extends Control {
    constructor(data:JSON) {
        super();
    }


    public load(json:JSON): any {
        this.createControl(this.$owner, json);
    }

    protected createControl(parent: Control, data: JSON) {
        this.$view = document.createElement('br');
        for (let attr in data) {
            if (!data.hasOwnProperty(attr)) {
                continue;
            }
            this.$view.setAttribute(attr, data[attr]);
        }
        parent.appendChild(this);
    }
}
