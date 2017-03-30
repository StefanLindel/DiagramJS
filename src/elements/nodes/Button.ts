import {Control} from "../../Control";
import Data from "../../Data";

export class Button extends Control {
    constructor(data:JSON) {
        super();
    }

    public load(json:JSON): any {
        this.createControl(this.$owner, json);
    }

    public setProperty(property: string): void {
    }

    propertyChange(entity: Data, property: string, oldValue:Object, newValue:Object) {
    }

    protected createControl(parent: Control, data: JSON) {
        if (typeof(data) === 'string') {
            this.id = data;
        } else {
            this.id = data['id'];
        }
        this.$view = document.createElement('button');
        if (data instanceof Object) {
            for (let attr in data) {
                if (!data.hasOwnProperty(attr)) {
                    continue;
                }
                this.$view.setAttribute(attr, data[attr]);
            }
        }
        parent.appendChild(this);
    }
}
