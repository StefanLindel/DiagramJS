import {Control} from "./Control";

export default class Data {
    public prop = {};
    id: string;
    //$listener: Control[] = [];
    $listener: Object = {};
    property: string;

    public addProperties(values: Object) {
        if (!values) {
            return;
        }
        if (values['prop']) {
            let prop = values['prop'];
            for (let property in prop) {
                if (prop.hasOwnProperty(property) === false) {
                    continue;
                }
                if (prop[property] !== null && '' !== prop[property]) {
                    this.setValue(property, prop[property]);
                }
            }
        } else {
            let upd = values['upd'] || {};
            let rem = values['rem'] || {};

            for (let property in upd) {
                if (upd.hasOwnProperty(property) === false) {
                    continue;
                }
                if (rem.hasOwnProperty(property) === false) {
                    this.setValue(property, upd[property]);
                } else {
                    // if we have a rem, we wan't to check, if its a valid change (teh old value is the value in rem)
                    if (this.getValue(property) === rem[property]) {
                        this.setValue(property, upd[property]);
                    }
                }
            }
        }
    }

    private nullCheck(property: string): string {
        if (property === undefined || property == null) {
            property = "";
        }
        return property;
    }

    protected getListeners(property: string): Control[] {
        property = this.nullCheck(property);
        return this.$listener[property];
    }

    public getValue(attribute: string) {
        return this.prop[attribute];
    }

    public setValue(attribute: string, newValue: any):void {
        let oldValue = this.prop[attribute];
        if (oldValue == newValue) {
            return;
        }
        this.prop[attribute] = newValue;
        this.firePropertyChange(attribute, oldValue, newValue);
    }

    protected firePropertyChange(attribute: string, oldValue: Object, newValue: Object) {
        attribute = this.nullCheck(attribute);
        // at first fire for the given property
        let listeners: Control[] = this.getListeners(attribute);
        if (listeners) {
            for (let i in listeners) {
                listeners[i].propertyChange(this, attribute, oldValue, newValue);
            }
        }
        // now we need to fire the Listeners that wan't to listen to everything
        listeners = this.getListeners(null);
        if (listeners) {
            for (let i in listeners) {
                listeners[i].propertyChange(this, attribute, oldValue, newValue);
            }
        }
    }

    public addTo(attribute: string, newValue: any): boolean {
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
            this.firePropertyChange(attribute, null, newValue);
        }
        return add;
    }

    public removeFrom(attribute: string, newValue: any): boolean {
        if (!this.prop[attribute]) {
            return true;
        }
        let pos: number = this.prop[attribute].indexOf(newValue);
        if (pos < 0) {
            return true;
        }
        this.prop[attribute].splice(pos, 1);
        this.firePropertyChange(attribute, newValue, null);
        return true;
    }

    public addListener(control: Control, property?: string) {
        let listeners: Control[] = this.getListeners(property);
        if (!listeners) {
            listeners = [];
            this.$listener[this.nullCheck(property)] = listeners;
        }
        listeners.push(control);
    }

    public removeListener(control: Control, property?: string) {
        let listeners = this.getListeners(property);
        if (listeners === null) {
            return;
        }
        let pos = listeners.indexOf(control);
        if (pos >= 0) {
            listeners.splice(pos, 1);
        }
        if (listeners.length == 0 && this.nullCheck(property) != "") {
            // only remove, if it's not the default listener list...
            delete this.$listener[property];
        }
    }

    public hasProperty(property: string): boolean {
        return this.prop.hasOwnProperty(property);
    }
}
