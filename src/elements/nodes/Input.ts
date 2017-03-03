import {Control} from '../../Control';
import {Bridge} from '../../Bridge';
import Data from '../../Data';

export class Input extends Control {
    private type: string;
    private applyingChange: boolean = false;

    public load(data: any) {
        let id: string;
        // init form HTML
        if (typeof(data) === 'string') {
            id = data;
        } else {
            id = data.id;
            if (data.type) {
                this.type = data['type'];
            } else {
                this.type = 'text';
            }
            this.property = data['property'];
        }
        if (!id) {
            return;
        }
        this.id = id;
        let inputField: HTMLElement = document.getElementById(id);

        if (!this.property) {
            if (inputField) {
                // TODO disuss how to decide, which property we should listen on...
                // this.property = id;
                if (inputField.hasAttribute('Property')) {
                    this.property = inputField.getAttribute('Property');
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
            let objId = this.property.split('.')[0];
            let hasItem = this.$owner.hasItem(objId);
            if (hasItem) {
                let item = this.$owner.getItem(objId);
                item.addListener(this);
                this.entity = item;
            } else {
                this.entity = new Data();
            }

            // Add listener to Input field:
            this.$view.onchange = ((ev: Event) => {
                    // this.applyingChange = true;
                    this.controlChanged(ev);
                    // this.applyingChange = false;
                }
            );
        } else {
            this.entity = new Data();
        }
    }

    propertyChange(entity: Data, property: string, oldValue, newValue) {
        if (this.property && !this.applyingChange && property === this.lastProperty) {
            this.updateElement(newValue);
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
        this.registerEventListener(eventType, this.$view);
        return true;
    }

    protected updateElement(value: string) {
        if(this.$view instanceof HTMLInputElement) {
            (<HTMLInputElement>this.$view).value = value;
        }

    }

    private controlChanged(ev: Event) {
        if(this.$view instanceof HTMLInputElement == false) {
            return;
        }
        let element = (<HTMLInputElement>this.$view);
        if (element.checkValidity()) {
            this.$owner.setValue(this.entity, this.lastProperty, element.value);
        } else {
            console.log('value does not match the pattern...');
        }
    }
}
