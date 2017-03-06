import {Control} from './Control';

export default class Data {
    public values = {};
    id: string;
    $listener: Control[] = [];
    property: string;

    public getValue(attribute: string) {
        return this.values[attribute];
    }

    public setValue(attribute: string, newValue) {
        let oldValue = this.values[attribute];
        this.values[attribute] = newValue;
        for (let i in this.$listener) {
            if (this.$listener.hasOwnProperty(i) === false) {
                continue;
            }
            this.$listener[i].propertyChange(this, attribute, oldValue, newValue);
        }
    }

    public addTo(attribute: string, newValue): boolean {
        let add: boolean;
        if (this.values[attribute]) {
            if (this.values[attribute].contains(newValue) === false) {
                add = true;
            }
        } else {
            this.values[attribute] = [];
            add = true;
        }
        if (add) {
            this.values[attribute].push(newValue);
            for (let i in this.$listener) {
                if (this.$listener.hasOwnProperty(i) === false) {
                    continue;
                }
                this.$listener[i].propertyChange(this, attribute, null, newValue);
            }
        }
        return add;
    }

    public removeFrom(attribute: string, newValue): boolean {
        if (!this.values[attribute]) {
            return true;
        }
        let pos: number = this.values[attribute].indexOf(newValue);
        if (pos < 0) {
            return true;
        }
        this.values[attribute].splice(pos, 1);
        for (let i in this.$listener) {
            if (this.$listener.hasOwnProperty(i) === false) {
                continue;
            }
            this.$listener[i].propertyChange(this, attribute, newValue, null);
        }
        return true;
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
