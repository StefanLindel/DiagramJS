import Bridge from "./Bridge";
import Data from "./Data";
import BridgeElement from "./BridgeElement";
import EventListener from "./EventListener";
import SimpleEvent from "./Event";

export default class Control {
    id: string;
    public $owner: Control;
    public property: string;
    //protected items: Set<BridgeElement> = new Set<BridgeElement>();
    protected $lastProperty: string;
    protected entity: Data;
    protected eventListener: Set<EventListener>;
    protected eventsToListen: Set<string>;

    public createEventListener(): EventListener {
        return new EventListener();
    }

    get lastProperty(): string {
        if (!this.property) {
            return "";
        }
        if (!this.$lastProperty) {
            let arr = this.property.split(".");
            this.$lastProperty = arr[arr.length - 1];
        }
        return this.$lastProperty;
    }


    constructor(owner: Control) {
        this.$owner = owner;
    }

    public initControl(data:any) {
    }

    public getItem(id: string): Data {
        return null;
    }
    public hasItem(id: string): boolean {
        return false;
    }

    public propertyChange(entity: Data, property: string, oldValue, newValue) {

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

    /*
     Property looks like: "t1.talk"
     */
    public setProperty(property: string): void {
        if (!this.property) {
            return;
        }
        let objId = property.split(".")[0];
        let object = this.$owner.getItem(objId);
        this.property = property;
        this.$lastProperty = null;

        // remove listener on old object
        if (this.entity) {
            this.entity.removeListener(this);
        }

        // add listener to object..
        if (object) {
            object.addListener(this);
            this.entity = object;
            this.updateElement(object.values[this.lastProperty]);
        }
    }

    protected updateElement(value: string): void {
    }

    public addListener(eventListener: EventListener): void {
        if (!this.eventListener) {
            this.eventListener = new Set<EventListener>()
        }
        this.eventListener.add(eventListener);
    }

    public registerEvent(eventType: string) {
        if (!this.eventsToListen) {
            this.eventsToListen = new Set();
        }
        if (this.eventsToListen.has(eventType)) {
            return true;
        } else {
            this.eventsToListen.add(eventType);

            // register on HTMLElement

            this.registerListenerOnHTMLObject(eventType);

            return true;
        }
    }

    public registerListenerOnHTMLObject(eventType: string): boolean {
        return false;
    }

    protected registerListener(eventType: string, htmlElement: HTMLElement) {
        let control = this;
        let listener = (t)=>{
            t.eventType = eventType;
            t.id = control.id;
            control.$owner.fireEvent(t);
        };
         htmlElement.addEventListener(eventType, listener);
    }
    public fireEvent(evt: Event) : void {

    }
}