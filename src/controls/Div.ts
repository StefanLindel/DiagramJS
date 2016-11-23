import Control from '../Control'
import Bridge from '../Bridge'
import Data from '../Data'

export class Div extends Control {
    private class: string;
    private $element: HTMLDivElement;
    private entity;
    private applyingChange: boolean = false;

    constructor(owner, data) {
        super(owner, data);
        let id: string;
        // init form HTML
        if (typeof(data) === "string") {
            id = data;
        } else {
            id = data.id;
            this.class = data.class;
            this.property = data.property;
        }
        if (!id) {
            return;
        }
        this.id = id;
        let div: HTMLElement = document.getElementById(id);

        if (!this.property) {
            // if(inputField){
            // TODO disuss how to decide, which property we should listen on...
            // this.property = id;
            this.property = div.getAttribute("Property");
            // }
        }

        if (div instanceof HTMLDivElement) {
            this.$element = div;
        } else {
            if (!div) {
                this.$element = document.createElement("div");
                this.$element.setAttribute("id", this.id);
                this.$element.setAttribute("property", this.property);
                document.getElementsByTagName("body")[0].appendChild(this.$element);
            } else {
                // the id is already taken by an object, that is not an input field...
                return;
            }
        }

        // check if object already exists
        let objId = this.property.split(".")[0];
        let hasItem = this.owner.hasItem(objId);
        if(hasItem){
            var item = this.owner.getItem(objId);
            item.addListener(this);
            this.entity = item;
        }
    }

    private controlChanged(ev: Event) {
        this.owner.setValue(this.entity, this.lastProperty, this.$element.innerHTML);
    }

    private _lastProperty: string;

    get lastProperty(): string {
        if (!this._lastProperty) {
            let arr = this.property.split(".");
            this._lastProperty = arr[arr.length - 1];
        }
        return this._lastProperty;
    }

    propertyChange(entity: Data, property: string, oldValue, newValue) {
        if (!this.applyingChange && property == this.lastProperty) {
            this.$element.innerHTML = newValue;
        }
    }

    public addItem(source: Bridge, entity: Data) {
        this.entity = entity;
        // check for new Element in Bridge
        if (entity) {
            if (!this.class || this.class === entity.property) {
                if (entity.id == this.property.split(".")[0]) {
                    entity.addListener(this);
                }
            }
        }
    }

    /*
     Property looks like: "t1.talk"
     */
    public setProperty(property: string) {
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
            this.$element.innerHTML = object.values[this.lastProperty];
        }
    }
}