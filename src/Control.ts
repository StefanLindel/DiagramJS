import Bridge from "./Bridge";
import Data from "./Data";
import BridgeElement from "./BridgeElement";

export default class Control {
    id: string;
    public owner: Bridge;
    public property: string;
    protected items: Set<BridgeElement> = new Set<BridgeElement>();
    protected _lastProperty: string;
    protected entity: Data;

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
        if(!this.property){
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
}