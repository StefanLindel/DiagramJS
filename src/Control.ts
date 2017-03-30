import {Bridge} from './Bridge';
import Data from './Data';
import EventListener from './EventListener';

export abstract class Control {
    public $owner: Control;
    public property: string;
    public $view: Element;
    protected entity: Data;
    public id: string;

    public init(owner: Control, property?: string, id?: string): Control {
        if (!this.$owner) {
            this.$owner = owner;
        }
        if (!this.property) {
            this.property = property || this.constructor.prototype.name;
        }
        if (!this.id) {
            this.id = id;
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
    }

    public getItem(id: string): Data {
        return null;
    }

    public hasItem(id: string): boolean {
        return false;
    }

    public getItems() :Object{
        return new Object();
    }

    public setValue(object: Object, attribute: string, value: Object): boolean {
        return false;
    }

    public propertyChange(entity: Data, property: string, oldValue:any, newValue:any) {

    }

    public getId(): string {
        return this.id;
    }

    public load(json:JSON|Object): any {

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

    public appendChild(child:Control) {
        if(this.$view) {
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
        let listener = (t:any) => {
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
