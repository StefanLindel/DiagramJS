///<reference path="Control.ts"/>
///<reference path="Bridge.ts"/>

class BR extends Control {
    constructor(owner, data) {
        super(owner, data);
        this.createControl(document.getElementsByTagName("body")[0], data);
    }

    propertyChange(entity: Data, property: string, oldValue, newValue) {
    }

    protected createControl(parent: HTMLElement, data: JSON) {
        let label = document.createElement("br");
        for (let attr in data) {
            if (!data.hasOwnProperty(attr)) {
                continue;
            }
            label.setAttribute(attr, data[attr]);
        }
        parent.appendChild(label);
    }
}