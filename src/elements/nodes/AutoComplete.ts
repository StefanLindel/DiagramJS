/**
 * Created by Stefan on 28.06.2017.
 */
import {Control} from "../../Control";
import Data from "../../Data";

export class AutoComplete extends Control {
    constructor(data: JSON) {
        super();
    }
    public load(json: JSON, owner?: Control): any {
        this.createControl(this.$owner, json);
    }
    protected createControl(parent: Control, data: JSON) {
        if (typeof(data) === 'string') {
            this.id = <string>data;
        } else {
            this.id = data['id'];
        }
        this.$view = document.createElement('div');

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