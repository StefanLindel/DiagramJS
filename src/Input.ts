///<reference path="Control.ts"/>
///<reference path="Bridge.ts"/>

class Input extends Control {
    private class:string;
    private $element: HTMLInputElement;
    private property: string;
    private type: string;

    constructor(owner, data){
        super(owner, data);
        let id: string;
        // init form HTML
        if (typeof(data) === "string") {
            id = data;
        } else {
            id = data.id;
            this.class = data.class;
            this.type = data.type;
            this.property = data.property;
        }
        if (!id) {
            return;
        }
        this.id = id;
        let inputField: HTMLElement = document.getElementById(id);

        if(!this.property){
            // if(inputField){
            // TODO disuss how to decide, which property we should listen on...
            // this.property = id;
            this.property = inputField.getAttribute("Property");
            // }
        }

        if(inputField instanceof HTMLInputElement){
            this.$element = inputField;
        }else {
            if (!inputField) {
                this.$element = document.createElement("input");
                this.$element.setAttribute("type", this.type);
                this.$element.setAttribute("id", this.id);
                this.$element.setAttribute("property", this.property);
                document.getElementsByTagName("body")[0].appendChild(this.$element);
            } else {
                // the id is already taken by an object, that is not an input field...
                return;
            }
        }
    }

    private _lastProperty: string;

    get lastProperty(): string {
        if(!this._lastProperty){
            let arr = this.property.split(".");
            this._lastProperty = arr[arr.length-1];
        }
        return this._lastProperty;
    }

    propertyChange(entity: Data, property: string, oldValue, newValue) {
        if(property == this.lastProperty){
            this.$element.value = newValue;
        }
    }

    public addItem(source: Bridge, entity: Data) {
        // check for new Element in Bridge
        if (entity) {
            if (!this.class || this.class === entity.class) {
                if(entity.id == this.property.split(".")[0]){
                    entity.addListener(this);
                }
            }
        }
    }

    public setProperty(property: string){
        let objId = property.split(".")[0];
        var object = this.owner.getItem(objId);
        // add listener to object..
    }
}