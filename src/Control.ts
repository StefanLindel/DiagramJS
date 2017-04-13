import {Bridge} from "./Bridge";
import Data from "./Data";
import EventListener from "./EventListener";

export abstract class Control {
    public $owner: Control;
    public property: string;
    public $view: Element;
    protected entity: Data;
    public id: string;

    protected getStandardProperty(): string {
        return "value";
    }

    protected generateID(property?: string, id?: string): string {
        if (property) {
            return property;
        }
        if (id) {
            // will generate a data Object suitable for the Control..
            // must be overridden, if the changeEvent shouldn't listen on value...
            return id + '.' + this.getStandardProperty();//+ "_data"
        }
        return null;
    }

    public init(owner: Control, property?: string, id?: string): Control {
        if (!this.$owner) {
            this.$owner = owner;
        }
        if (!this.id) {
            this.id = id;
        }
        if (!this.property) {
            this.property = this.generateID(property, id);
        }
        return this;
    }

    public createEventListener(): EventListener {
        return new EventListener();
    }

    public getRoot(): Control {
        if (this.$owner) {
            return this.$owner.getRoot();
        }
        return this;
    }

    public initControl(data: any) {
        if (this.$view == null) {
            return;
        }
        // let object = {
        //     'id' = this.entity.id,
        //     rem: data[rem],
        //     upd: data.upd,
        //     prop: data.prop
        // };
        // this.getRoot().load(object);
        if (data.hasOwnProperty("prop")) {
            for (let key in data.prop) {
                this.$view[key] = data.prop[key];
                this.getRoot().setValue(this.entity, key, data.prop[key]);
            }
            return;
        }
        let hasRem = data.hasOwnProperty("rem");
        if (data.hasOwnProperty("upd")) {
            for (let key in data.upd) {
                let oldValue;
                if (hasRem && data.rem.hasOwnProperty(key)) {
                    // if there's a rem, the oldValue from rem will be used and expected to be right..
                    oldValue = data.rem[key];
                    delete data.rem[key];
                } else {
                    // try to get the oldValue directly from the entity...
                    oldValue = this.entity.getValue(key);
                }
                if (data.upd[key] == oldValue || this.$view[key] == data.upd[key]) {
                    continue;
                }
                this.$view[key] = data.upd[key];
                this.getRoot().setValue(this.entity, key, data.upd[key], oldValue);
            }
        }
        if (hasRem) {
            for (let key in data.rem) {
                let oldValue = this.$view[key];
                delete this.$view[key];
                if (oldValue != data.rem[key]) { //todo: !oldValue oder oldValue == newVAlue...
                    continue;
                }
                // this.$view.removeAttribute(key);
                this.getRoot().setValue(this.entity, key, null, data.rem[key]);
            }
        }
    }

    /**
     * refreshes the $view with the corresponding data
     */
    public refreshControl() {
        // e.g. for InputField:
        // set Value of field to Value of Entity
        // if(this.entity.getValue(this.lastProperty) != null && this.$view){
        //     this.$view.setAttribute("value", this.entity.getValue(this.lastProperty));
        // }
    }

    public getItem(id: string): Data {
        return null;
    }

    public hasItem(id: string): boolean {
        return false;
    }

    public getItems(): Object {
        return new Object();
    }

    public setValue(object: Object, attribute: string, newValue: Object, oldValue?: Object): boolean {//
        return false;
    }

    /**
     * Is called when a object, that the Control is listening to, changes its value.
     * @param entity
     * @param property
     * @param oldValue
     * @param newValue
     */
    public propertyChange(entity: Data, property: string, oldValue: any, newValue: any) {

    }

    public getId(): string {
        return this.id;
    }

    public load(json: JSON|Object, owner?: Control): any {

    }

    public addItem(source: Bridge, entity: Data) {
        // check for new Element in Bridge
        if (entity) {
            if (!this.property || this.property === entity.property) {
                entity.addListener(this);
                this.entity = entity;
            }
        }
    }

    public appendChild(child: Control) {
        if (this.$view) {
            this.$view.appendChild(child.$view);
        } else {
            document.getElementsByTagName('body')[0].appendChild(child.$view);
        }
    }

    /*
     Property looks like: 't1.talk'
     */
    public setProperty(property: string): void {
        if (!this.property) {
            return;
        }
        let objId = property.split('.')[0];
        let object = this.$owner.getItem(objId);
        this.property = property;

        // remove listener on old object
        if (this.entity) {
            this.entity.removeListener(this);
        }

        // add listener to object..
        if (object) {
            object.addListener(this);
            this.entity = object;
            this.updateElement(object.prop[this.lastProperty]);
        }
    }

    public registerListenerOnHTMLObject(eventType: string): boolean {
        return false;
    }

    // Normal Event HTML-Event
    // Eventtype:string,
    // id:string of Control
    public fireEvent(evt: Event): void {

    }

    public isClosed(): boolean {
        return this['closed'];
    }

    public getShowed(): Control {
        if (this.isClosed()) {
            return this.$owner.getShowed();
        }
        return this;
    }

    protected updateElement(value: string): void {
    }

    protected registerEventListener(eventType: string, htmlElement: HTMLElement) {
        let control = this;
        let listener = (t: any) => {
            t.eventType = eventType;
            t.id = control.id;
            control.$owner.fireEvent(t);
        };
        htmlElement.addEventListener(eventType, listener);
    }

    get lastProperty(): string {
        if (!this.property) {
            return '';
        }
        let arr: string[] = this.property.split('.');
        return arr[arr.length - 1];
    }
}
