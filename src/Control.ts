import Bridge from "./Bridge";
import Data from "./Data";
import BridgeElement from "./BridgeElement";
import EventListener from "./EventListener";
import SimpleEvent from "./Event";

export default class Control {
    id: string;
    public owner: Bridge;
    public property: string;
    protected items: Set<BridgeElement> = new Set<BridgeElement>();
    protected _lastProperty: string;
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
        if (!this._lastProperty) {
            let arr = this.property.split(".");
            this._lastProperty = arr[arr.length - 1];
        }
        return this._lastProperty;
    }


    constructor(owner: Bridge, data) {
        this.owner = owner;
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
        var object = this.owner.getItem(objId);
        this.property = property;
        this._lastProperty = null;

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

    /**
     * The oldValue is used for the ChangeEvents in order to being able to have the old value in the Event.
     * @type {any}
     */
    protected oldValue: Object = null;

    public fireEvent(event: SimpleEvent) {
        // if (!this.eventListener) {
        //     return;
        // }
        // for (let listener of this.eventListener) {
        //     listener.update(event);
        // }
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

    public static registerListenerOnHTMLObjects(eventType: string, htmlElement: HTMLElement, listener: EventListenerOrEventListenerObject) {
        htmlElement.addEventListener(eventType, listener);
    }
}