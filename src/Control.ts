import {Bridge} from "./Bridge";
import Data from "./Data";
import EventListener from "./EventListener";

export abstract class Control {
    public $owner: Control;
    public property: string;
    public $view: Element;
    public viewData: Data;
    protected entity: Data;
    public id: string;

    protected getStandardProperty(): string {
        return "value";
    }

    protected getViewData(){
        if(!this.viewData){
            // create new
            this.viewData = this.getRoot().getItem(this.getControlDataID());
            this.saveViewInData();
        }
        return this.viewData;
    }

    /**
     * Save all properties of the view element in the data object of the control
     */
    protected saveViewInData(){
        if(this.$view){
            let data = this.getViewData();
            let keys = Object.keys(this.$view);
            keys.push("value");
            for (let i = 0; i < keys.length; i++) {
                let attr = keys[i];
                if(!this.$view.hasOwnProperty(attr)){
                    continue;
                }
                if(!data.hasProperty(attr)){
                    data.addListener(this, attr);
                }
                data.setValue(attr, this.$view[attr]);
            }
        }
    }

    /**
     * the id of the Data object, that contains the properties of the view
     * @returns {string}
     */
    protected getControlDataID(){
        return this.id + "_data";
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
        if (data.hasOwnProperty("prop")) {
            for (let key in data.prop) {
                let oldValue = this.getViewData().getValue(key);
                this.getViewData().setValue(key, data.prop[key]);
                this.getRoot().setValue(this, key, data.prop[key], oldValue);
            }
            return;
        }
        let hasRem = data.hasOwnProperty("rem");
        let removed = [];
        if (data.hasOwnProperty("upd")) {
            for (let key in data.upd) {
                let oldValue;
                let newValue = data.upd[key];
                let entity;
                if (newValue == this.getViewData().getValue(key)) {
                    // new Value equals old value, so we don't need to change anything..
                    // delete data.rem[key];
                    removed.push(data.rem[key]);
                    continue;
                }
                if (hasRem && data.rem.hasOwnProperty(key)) {
                    // if there's a rem, the oldValue from rem will be used and expected to be right..
                    oldValue = data.rem[key];
                    if(this.entity && this.entity.getValue(key) == oldValue){
                        entity = this.entity;
                    }else if(oldValue == this.getViewData().getValue(key)){
                        entity = this;
                    }
                    delete data.rem[key];

                    if(entity === null){
                        continue;
                    }
                }else{
                }

                if(entity){
                    if(!hasRem){
                        if(entity == this.entity){
                            oldValue = this.entity.getValue(key);
                        }else{
                            oldValue = this.getViewData().getValue(key);
                        }
                    }
                }else{
                    if (this.entity) {
                        // try to get the oldValue directly from the entity...
                        oldValue = this.entity.getValue(key);
                        entity = this.entity;
                    }
                    if (oldValue === null) {
                        // if there was no data in the entity, we try to get oldValue from the $view
                        oldValue = this.getViewData().getValue(key);
                        entity = this;
                    }
                }

                //  || oldValue !== this.viewData.getValue(key)
                if (newValue == oldValue) {
                    // no match, so update should be wrong...
                    continue;
                }
                if(entity == this){
                    this.getViewData().setValue(key, newValue);
                }else{
                    this.updateElement(key, newValue);
                }
                this.getRoot().setValue(entity, key, newValue, oldValue);
            }
        }
        if (hasRem) {
            for (let key in data.rem) {
                if(removed.hasOwnProperty(key)){
                    continue;
                }
                let oldValue = this.getViewData().getValue(key);
                if (oldValue != data.rem[key] || data.upd !== undefined && (data.upd[key] == oldValue || this.getViewData().getValue(key) == data.upd[key])) {
                    // if rem is invalid, or if the change is already applied, don't do anything..
                    continue;
                }
                //delete this.viewData.getValue(key);
                this.updateElement(key, null);
                // this.$view.removeAttribute(key);
                this.getRoot().setValue(this, key, this.getViewData().getValue(key), oldValue);
            }
        }
        this.saveViewInData();
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
        this.getRoot().setValue(this, property, newValue, oldValue);
    }

    public getId(): string {
        return this.id;
    }

    public load(json: JSON | Object, owner?: Control): any {

    }

    public addItem(source: Bridge, entity: Data) {
        // check for new Element in Bridge
        if (entity) {
            if (!this.property || entity.hasProperty(this.property)) {
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
        let object = null;
        if(this.$owner.hasItem(objId)){
            object = this.$owner.getItem(objId);
        }

        // remove listener on old object
        if (this.entity) {
            // this.entity.removeListener(this);
            this.entity.removeListener(this, this.lastProperty);
        }
        this.property = property;

        // add listener to object..
        if (object) {
            object.addListener(this, this.lastProperty);
            this.entity = object;
            this.updateElement(this.lastProperty, object.prop[this.lastProperty]);
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

    protected updateElement(property: string, value: string): void {
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
