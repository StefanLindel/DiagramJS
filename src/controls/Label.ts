import Control from '../Control'
import Data from '../Data'

export class Label extends Control {
    constructor(owner, data) {
        super(owner, data);
        this.createControl(document.getElementsByTagName("body")[0], data);
    }

    propertyChange(entity: Data, property: string, oldValue, newValue) {
    }

    protected createControl(parent: HTMLElement, data: JSON) {
        let label = document.createElement("label");
        for (let attr in data) {
            if (!data.hasOwnProperty(attr)) {
                continue;
            }
            if (attr == "textContent") {
                label.textContent = data['textContent'];
            } else {
                label.setAttribute(attr, data[attr]);
            }
        }
        parent.appendChild(label);
    }
}