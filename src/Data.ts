import {Control} from './Control';

export default class Data {
    public values = {};
    id: string;
    $listener: Control[] = [];
    property: string;

    public getValue(attribute) {
        return this.values[attribute];
    }

    public setValue(attribute, newValue) {
        let oldValue = this.values[attribute];
        this.values[attribute] = newValue;
        for (let i in this.$listener) {
            if (this.$listener.hasOwnProperty(i) === false) {
                continue;
            }
            this.$listener[i].propertyChange(this, attribute, oldValue, newValue);
        }
    }

    public addListener(control: Control) {
        this.$listener.push(control);
    }

    public removeListener(control: Control) {
        let pos = this.$listener.indexOf(control);
        if (pos >= 0) {
            this.$listener.splice(pos, 1);
        }
    }
}
