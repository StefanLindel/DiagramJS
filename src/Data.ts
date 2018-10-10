import PropertyChangeSupport from './PropertyChangeSupport';

export default class Data {
    public prop = {};
    id: string;
    // $listener: Control[] = [];
    $listener: Object = {};

    private static nullCheck(property: string): string {
        if (property === undefined || property === null) {
            property = '';
        }
        return property;
    }
    public getKeys(): string[] {
        return Object.keys(this.prop);
    }

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

    public getValue(attribute: string) {
        return this.prop[attribute];
    }

    public setValue(attribute: string, newValue: any): void {
        let oldValue = this.prop[attribute];
        if (oldValue === newValue && newValue !== null) {
            return;
        }
        this.prop[attribute] = newValue;
        this.firePropertyChange(attribute, oldValue, newValue);
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

    public addListener(control: PropertyChangeSupport, property?: string) {
        let listeners: PropertyChangeSupport[] = this.getListeners(property);
        if (!listeners) {
            listeners = [];
            this.$listener[Data.nullCheck(property)] = listeners;
        }
        listeners.push(control);
    }

    public removeListener(control: PropertyChangeSupport, property?: string) {
        let listeners = this.getListeners(property);
        if (listeners === null) {
            return;
        }
        let pos = listeners.indexOf(control);
        if (pos >= 0) {
            listeners.splice(pos, 1);
        }
        if (listeners.length === 0 && Data.nullCheck(property) !== '') {
            // only remove, if it's not the default listener list...
            delete this.$listener[property];
        }
    }

    public hasProperty(property: string): boolean {
        return this.prop.hasOwnProperty(property);
    }

    public addFrom(attribute: string, oldData: Data): void {
        if (oldData) {
            this.setValue(attribute, oldData.getValue(attribute));
        } else {
            this.setValue(attribute, null);
        }
    }

    public removeKey(key: string): any {
        if (this.hasProperty(key)) {
            const oldValue = this.prop[key];
            delete this.prop[key];
            return oldValue;
        }
        return null;
    }

    protected getListeners(property: string): PropertyChangeSupport[] {
        property = Data.nullCheck(property);
        return this.$listener[property];
    }

    protected firePropertyChange(attribute: string, oldValue: Object, newValue: Object) {
        attribute = Data.nullCheck(attribute);
        // at first fire for the given property
        let listeners: PropertyChangeSupport[] = this.getListeners(attribute);
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
}
