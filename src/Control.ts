import {Bridge} from './Bridge';
import Data from './Data';
import EventListener from './EventListener';

export abstract class Control {
    public $owner: Control;
    /**
     *
     */
    public property: string;
    public id: string;
    public $view: Element;
    public viewData: Data;

    protected $model: Data;
    protected $viewListener: EventListenerOrEventListenerObject;

    /**
     * The properties, we want to listen to
     */
    // static defaultProperties: string[] = [];

    // public getProperties(): string[] {
    //     return this.properties;
    // }

    constructor() {
        // e.g. this.properties.push("key");
        // this.properties.push("property");
        this.viewData = this.initViewDataProperties(this.viewData);
    }

    public initViewDataProperties(oldData?: Data): Data {
        const data: Data = new Data();
        if (oldData) {
            oldData.removeListener(this);
            const keys: string[] = oldData.getKeys();
            for (let i = 0; i < keys.length; i++) {
                let attr = keys[i];
                if (this.$view) {
                    if (this.$view[attr] === null) {
                        continue;
                    }
                    data.setValue(attr, this.$view[attr]);
                } else {
                    data.setValue(attr, null);
                }
            }
        }
        data.addListener(this);
        return data;
    }

    /**
     *  Set the new HTMLElement and attach listener to it.
     *  Also remove Listeners from old one and return the old one, if present.
     * @param element
     * @returns The previous Element
     */
    public setView(element: Element): Element {
        let oldElement: Element = null;
        if (this.$view) {
            oldElement = this.$view;
            if (this.$viewListener) {
                oldElement.removeEventListener('change', this.$viewListener);
            }
        }
        this.$view = element;

        if (this.$viewListener) {
            element.addEventListener('change', this.$viewListener);
        }
        this.viewData = this.initViewDataProperties(this.viewData);
        return element;
    }

    public init(owner: Control, property ?: string, id ?: string): Control {
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

    public initControl(data: any): void {
        if (this.$view === null) {
            return;
        }
        if (data.hasOwnProperty('prop')) {
            for (let key in data.prop) {
                let oldValue = this.viewData.getValue(key);
                if (this.$view) {
                    this.updateElement(key, oldValue, data.prop[key]);
                }
            }
            return;
        }
        let hasRem = data.hasOwnProperty('rem');
        let removed: any[] = [];
        if (data.hasOwnProperty('upd')) {
            for (let key in data.upd) {
                let oldValue;
                let newValue = data.upd[key];
                let entity;
                const temp = false;
                if (temp) {
//                if (newValue == this.getViewData().getValue(key)) {
                    // new Value assertEquals old value, so we don't need to change anything..
                    // delete data.rem[key];
                    if (hasRem && data.rem.hasOwnProperty(key)) {
                        removed.push(data.rem[key]);
                    }
                    continue;
                }
                if (hasRem && data.rem.hasOwnProperty(key)) {
                    // if there's a rem, the oldValue from rem will be used and expected to be right..
                    oldValue = data.rem[key];
                    if (this.$model && this.$model.getValue(key) == oldValue) {
                        entity = this.$model;
//                    } else if (oldValue == this.getViewData().getValue(key)) {
//                        $graphModel = this.getViewData();
                    }
                    delete data.rem[key];

                    if (entity === null) {
                        continue;
                    }
                }
                if (entity) {
                    if (!hasRem) {
                        if (entity === this.$model) {
                            oldValue = this.$model.getValue(key);
                        } else {
//                           oldValue = this.getViewData().getValue(key);
                        }
                    }
                } else {
                    if (this.$model) {
                        // try to get the oldValue directly from the $graphModel...
                        oldValue = this.$model.getValue(key);
                        entity = this.$model;
                    }
                    if (oldValue === null) {
                        // if there was no data in the entity, we try to get oldValue from the $view
//                        oldValue = this.getViewData().getValue(key);
//                        entity = this.getViewData();
                    }
                }

                //  || oldValue !== this.viewData.getValue(key)
                if (newValue == oldValue) {
                    // no match, so update should be wrong...
                    continue;
                }
                const viewDataOldValue = this.viewData.getValue(key);
                if (entity == this.viewData) {

                    // this.getViewData().setValue(key, newValue);
                    if (this.$view) {
                        this.updateElement(key, viewDataOldValue, newValue);
                    }
                } else {
                    this.updateElement(key, viewDataOldValue, newValue);
                }
                this.getRoot().setValue(entity, key, newValue, oldValue);
            }
            // this.saveViewInData();
        }
        if (hasRem) {
            for (let key in data.rem) {
                if (removed.hasOwnProperty(key)) {
                    continue;
                }
                let oldValue;
//                    this.getViewData().getValue(key);
//                if (oldValue != data.rem[key] || data.upd !== undefined && (data.upd[key] == oldValue || this.getViewData().getValue(key) == data.upd[key])) {
                // if rem is invalid, or if the change is already applied, don't do anything..
                //                  continue;
                //            }
                // delete this.viewData.getValue(key);
                // this.saveViewInData();
                this.updateElement(key, null, null);
                // this.$view.removeAttribute(key);
                if (this.$model) {
//                    this.getRoot().setValue(this.$graphModel, key, this.getViewData().getValue(key), oldValue);
                }
            }
        }
        if (this.property) {
            // Add listener to Input field:
            this.$view['onchange'] = ((ev: Event) => {
                    this.controlChanged(ev);
                }
            );
        }
//        this.saveViewInData();
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

    public setValue(object: Object, attribute: string, newValue: Object, oldValue ?: Object): boolean {
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
        if (oldValue === newValue) {
            return;
        }
        if (oldValue === this.viewData.getValue(property)) {
            return;
        }
        // Set NewData to ViewData and Fire PC
        this.viewData.setValue(property, newValue);

//
//
//         // if (entity == this.viewData) {
//             // if the ViewData is changed, we want to change the $view
//             // if (this.entity) {
//                 alert("entity = viewData: " + this.getStandardProperty() + ", " +  property + ", newVal: " + newValue + ", oldVal: " + oldValue);
//                 if (this.getStandardProperty() == property && this.entity.hasProperty(property)) {
//                     this.getRoot().setValue(this.entity, property, newValue, oldValue);
//                 }
//             // }
//         // } else {
//             // the entity is changed, so we want tell it to the viewData
//             // if (this.viewData) {
//                 alert("entity = Data: " +  property);
//                 // this.getRoot().setValue(this.viewData, property, newValue, oldValue);
//                 this.viewData.setValue(property, newValue);
//             // }
//         // }
// >>>>>>> addOldFunctions
        if (this.viewData) {
            this.viewData.setValue(property, newValue);
        }
        if (this.$model) {
            this.$model.setValue(property, newValue);
        }
        this.updateElement(property, oldValue, newValue);
    }

    public controlChanged(ev: Event) {
        if (this.$view instanceof HTMLInputElement === false) {
            return;
        }
        let element = (<HTMLInputElement>this.$view);
        if (element.checkValidity()) {

        }
    }

    /**
     *  Update GUI Element
     * @param {string} property
     * @param oldValue
     * @param newValue
     */
    public updateElement(property: string, oldValue: any, newValue: any) {
        if (this.$view && this.$view.hasAttribute(property)) {
            this.$view.setAttribute(property, newValue);
        }
    }

//        if (oldValue == newValue) {
//            return;
//        }
//        if (oldValue == this.viewData.getValue(property)) {
//            return;
//        }
//        // Set NewData to ViewData and Fire PC
//        this.viewData.setValue(property, newValue);
//
//
//
//         // if ($graphModel == this.viewData) {
//             // if the ViewData is changed, we want to change the $view
//             // if (this.$graphModel) {
//                 alert("$graphModel = viewData: " + this.getStandardProperty() + ", " +  property + ", newVal: " + newValue + ", oldVal: " + oldValue);
//                 if (this.getStandardProperty() == property && this.$graphModel.hasProperty(property)) {
//                     this.getRoot().setValue(this.$graphModel, property, newValue, oldValue);
//                 }
//             // }
//         // } else {
//             // the $graphModel is changed, so we want tell it to the viewData
//             // if (this.viewData) {
//                 alert("$graphModel = Data: " +  property);
//                 // this.getRoot().setValue(this.viewData, property, newValue, oldValue);
//                 this.viewData.setValue(property, newValue);
//             // }
//         // }

    public getId(): string {
        return this.id;
    }

    public load(json: JSON | Object, owner ?: Control): any {

    }

    public addItem(source: Bridge, entity: Data) {
        // check for new Element in Bridge
        if (entity) {
            if (!this.property || entity.hasProperty(this.property)) {
                entity.addListener(this, this.property);
                this.$model = entity;
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
        if (this.$owner.hasItem(objId)) {
            object = this.$owner.getItem(objId);
        }

        // remove listener on old object
        if (this.$model) {
            // this.$graphModel.removeListener(this);
            this.$model.removeListener(this, this.lastProperty);
        }
        this.property = property;

        // add listener to object..
        if (object) {
            object.addListener(this, this.lastProperty);
            this.$model = object;
            this.updateElement(this.lastProperty, this.viewData.getValue(this.lastProperty), object.prop[this.lastProperty]);
        }
    }

    public registerListenerOnHTMLObject(eventType: string): boolean {
        return this.registerEventListener(eventType, <HTMLElement>this.$view);
    }

    // Normal Event HTML-Event
    // Eventtype:string,
    // id:string of Control
    public fireEvent(evt: Event): void {
        // Do Nothing
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

    /**
     * the id of the Data object, that contains the properties of the view
     * @returns {string}
     */
    protected getControlDataID() {
        return this.id + '_data';
    }

    protected generateID(property ?: string, id ?: string): string {
        if (property) {
            return property;
        }
        if (id) {
            // will generate a data Object suitable for the Control..
            // must be overridden, if the changeEvent shouldn't listen on value...
//            return id + '.' + this.getStandardProperty();//+ "_data"
            return id + '.' + '_data';
        }
        return null;
    }

    protected updateViewData() {
        if (!this.$view) {
            return;
        }
        const keys: string[] = this.viewData.getKeys();
        for (let i = 0; i < keys.length; i++) {
            let attr = keys[i];
            if (this.$view[attr] === null) {
                continue;
            }
            this.viewData.setValue(attr, this.$view[attr]);
        }
    }

    protected registerEventListener(eventType: string, htmlElement: HTMLElement): boolean {
        if (!htmlElement) {
            return false;
        }
        if (htmlElement instanceof HTMLElement === false) {
            return false;
        }
        let control = this;
        let listener = (t: any) => {
            t.eventType = eventType;
            t.id = control.id;
            control.$owner.fireEvent(t);
        };
        htmlElement.addEventListener(eventType, listener);
        return true;
    }

    get lastProperty(): string {
        if (!this.property) {
            return '';
        }
        let arr: string[] = this.property.split('.');
        return arr[arr.length - 1];
    }
}
