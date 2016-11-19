///<reference path="Control.ts"/>
///<reference path="Bridge.ts"/>

class Input extends Control {
    private $element: HTMLInputElement;
    private type: string;
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
            this.type = data.type;
            this.property = data.property;
        }
        if (!id) {
            return;
        }
        this.id = id;
        let inputField: HTMLElement = document.getElementById(id);

        if (!this.property) {
            // if(inputField){
            // TODO disuss how to decide, which property we should listen on...
            // this.property = id;
            if (inputField.hasAttribute("Property")) {
                this.property = inputField.getAttribute("Property");
            }
            // }
        }

        if (inputField instanceof HTMLInputElement) {
            this.$element = inputField;
        } else {
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

        // check if object already exists
        if (this.property) {
            let objId = this.property.split(".")[0];
            let hasItem = this.owner.hasItem(objId);
            if (hasItem) {
                var item = this.owner.getItem(objId);
                item.addListener(this);
                this.entity = item;
            }

            // Add listener to Input field:
            this.$element.onchange = ((ev: Event) => {
                    this.applyingChange = true;
                    this.controlChanged(ev);
                    this.applyingChange = false;
                }
            );
        }
    }

    private controlChanged(ev: Event) {
        if (this.$element.checkValidity()) {
            bridge.setValue(this.entity, this.lastProperty, this.$element.value);
        } else {
            console.log("value does not match the pattern...");
        }
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
        if (this.property && !this.applyingChange && property == this.lastProperty) {
            this.$element.value = newValue;
        }
    }

    public addItem(source: Bridge, entity: Data) {
        // check for new Element in Bridge
        if (this.property && entity) {
            if (entity.id == this.property.split(".")[0]) {
                this.entity = entity;
                entity.addListener(this);
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
            this.$element.value = object.values[this.lastProperty];
        }
    }
}