import {Control} from "../../Control";
import {Bridge} from "../../Bridge";
import Data from "../../Data";

export class Input extends Control {
    private type: string;
    private applyingChange: boolean = false;


    protected getStandardProperty(): string {
        if("checkbox" === this.type || "radio" === this.type){
            return "checked";
        }
        return super.getStandardProperty();
    }

    protected isKeyOnly(): boolean{
        if("checkbox" === this.type || "radio" === this.type){
            return true;
        }
        return false;
    }

    public load(data: any) {
        let id: string;
        let inputField: HTMLElement;
        let useData: boolean;
        // init form HTML
        if (typeof(data) === 'string') {
            id = data;
            useData = true;
        } else {
            id = data.id;
            if (data.type) {
                this.setType(data['type']);
            } else {
                this.setType('text');
            }
            if (data.hasOwnProperty('property')) {
                this.setProperty(data['property']);
            }
            useData = true;
        }
        if (!id) {
            return;
        }
        this.id = id;

        inputField = document.getElementById(id);
        
        if (useData) {
            if (inputField) {
                // TODO disuss how to decide, which property we should listen on...
                // this.property = id;
                if (inputField.hasAttribute('Property')) {
                    this.setProperty(inputField.getAttribute('Property'));
                }
            }
        }

        if (inputField instanceof HTMLInputElement) {
            this.$view = inputField;
            this.type = inputField.type;
        } else {
            if (!inputField) {
                this.$view = document.createElement('input');
                if (typeof(data) !== 'string') {
                    for (let attr in data) {
                        if (data.hasOwnProperty(attr) === false) {
                            continue;
                        }
                        this.$view.setAttribute(attr, data[attr]);
                    }
                } else {
                    if (this.type) {
                        this.$view.setAttribute('type', this.type);
                    }
                    if (data.hasOwnProperty('class')) {
                        this.$view.setAttribute('class', data['class']);
                    }
                    this.$view.setAttribute('id', this.id);
                    this.$view.setAttribute('property', this.property);
                }
                this.$owner.appendChild(this);
            } else {
                // the id is already taken by an object, that is not an input field...
                return;
            }
        }

        // check if object already exists
        if (this.property) {
            this.entity = this.getRoot().getItem(this.property);

            this.entity.setValue(this.lastProperty, this.$view[this.lastProperty]);
            this.entity.property = this.property.split('.')[0];
            this.entity.addListener(this);

            this.refreshControl();

            // Add listener to Input field:
            this.$view['onchange'] = ((ev: Event) => {
                    // this.applyingChange = true;
                    this.controlChanged(ev);
                    // this.applyingChange = false;
                }
            );
        } else {
            this.entity = new Data();
        }
    }


    public refreshControl(): any {
        super.refreshControl();
        // set Value of field to Value of Entity
        if(this.entity.getValue(this.lastProperty) != null && this.$view){
            this.$view.setAttribute("value", this.entity.getValue(this.lastProperty));
        }
    }

    propertyChange(entity: Data, property: string, oldValue:Object, newValue:Object) {
        if (this.property && !this.applyingChange && property === this.lastProperty) {
            this.updateElement(<string>newValue);
        }
    }

    public addItem(source: Bridge, entity: Data) {
        // check for new Element in Bridge
        if (this.property && entity) {
            if (entity.id === this.property.split('.')[0]) {
                this.entity = entity;
                entity.addListener(this);
            }
        }
    }

    public registerListenerOnHTMLObject(eventType: string): boolean {
        this.registerEventListener(eventType,<HTMLElement> this.$view);
        return true;
    }

    protected updateElement(value: string) {
        if (this.$view instanceof HTMLInputElement) {
            (<HTMLInputElement>this.$view).value = value;
        }
    }

    private controlChanged(ev: Event) {
        if (this.$view instanceof HTMLInputElement == false) {
            return;
        }
        let element = (<HTMLInputElement>this.$view);
        if (element.checkValidity()) {
            let newVal = element[this.lastProperty];
            if(this.isKeyOnly()){
                // we expect, element[this.lastProperty] to be boolean:
                if(!newVal){
                    newVal = null;
                }
            }else{
            }
            this.getRoot().setValue(this.entity, this.lastProperty, newVal, this.entity.getValue(this.lastProperty));
        } else {
            console.log('value does not match the pattern...');
        }
    }

    public setType(type:string):void{
        let oldValue: string = this.type;
        if(oldValue === type){
            return;
        }
        this.type = type;
        if(this.property && this.property.indexOf(this.id) == 0){
            // property starts with id of control, hence we have a Data, that is only for the control
            // now we need to change property, if we change the type...
            this.setProperty(this.generateID(null, this.getId()))
        }
    }
}
