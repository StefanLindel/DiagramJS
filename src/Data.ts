import {Control} from './Control';

export default class Data {
    public prop = {};
    id: string;
    $listener: Control[] = [];
    property: string;

    public getValue(attribute: string) {
        return this.prop[attribute];
    }

    public setValue(attribute: string, newValue:any) {
        let oldValue = this.prop[attribute];
        if(oldValue == newValue){
            return;
        }
        this.prop[attribute] = newValue;
        for (let i in this.$listener) {
            if (this.$listener.hasOwnProperty(i) === false) {
                continue;
            }
            this.$listener[i].propertyChange(this, attribute, oldValue, newValue);
        }
    }

    public addTo(attribute: string, newValue:any): boolean {
        let add: boolean;
        if (this.prop[attribute]) {
            if (this.prop[attribute].contains(newValue) === false) {
                add = true;
            }
        } else {
            this.prop[attribute] = [];
            add = true;
        }
        if (add) {
            this.prop[attribute].push(newValue);
            for (let i in this.$listener) {
                if (this.$listener.hasOwnProperty(i) === false) {
                    continue;
                }
                this.$listener[i].propertyChange(this, attribute, null, newValue);
            }
        }
        return add;
    }

    public removeFrom(attribute: string, newValue:any): boolean {
        if (!this.prop[attribute]) {
            return true;
        }
        let pos: number = this.prop[attribute].indexOf(newValue);
        if (pos < 0) {
            return true;
        }
        this.prop[attribute].splice(pos, 1);
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
