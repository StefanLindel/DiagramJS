import {Control} from "../../Control";
import {Bridge} from "../../Bridge";
import Data from "../../Data";

export class Input extends Control {
    private type: string;
    private applyingChange: boolean = false;

    constructor() {
        super();
        this.$viewListener = ((ev: Event) => {
            this.controlChanged(ev);
        });
    }


    public initViewDataProperties(oldData?: Data): Data {
        const data = super.initViewDataProperties(oldData);
        if ("checkbox" === this.type || "radio" === this.type) {
            data.addFrom("checked", oldData);
        }
        data.addFrom("value", oldData);
        data.addFrom("type", oldData);
        return data;
    }


    protected isKeyOnly(): boolean {
        return ("checkbox" === this.type || "radio" === this.type);
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
            useData = false;
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
            this.setView(inputField);
            this.type = inputField.type;
            //useData = false;
        } else {
            if (!inputField) {
                this.setView(document.createElement('input'));
                if (typeof(data) !== 'string') {
                    for (let attr in data) {
                        if (data.hasOwnProperty(attr) === false) {
                            continue;
                        }
                        this.$view[attr] = data[attr];
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
            // Add listener to Input field:
            this.$view['onchange'] = ((ev: Event) => {
                    this.controlChanged(ev);
                }
            );
        }
/*
                this.$graphModel = this.getRoot().getItem(this.property);

                if (!useData) {
                    // only if we have a inputField before with a value...
                    this.$graphModel.setValue(this.lastProperty, this.$view[this.lastProperty]);
                }
                // this.$graphModel.property = this.lastProperty;
                this.$graphModel.addListener(this, this.lastProperty);//,this.lastProperty
                this.updateElement(this.lastProperty, this.$graphModel.getValue(this.lastProperty));
            }

            // Add listener to Input field:
            // this.$view['onchange'] = ((ev: Event) => {
            //         this.controlChanged(ev);
            //     }
            // );
        } else {
            // this.$graphModel = new Data();
        }*/
    }

    public addItem(source: Bridge, entity: Data) {
        // check for new Element in Bridge
        if (this.property && entity) {
            if (entity.id === this.property.split('.')[0]) {
                this.$model = entity;
                entity.addListener(this, this.lastProperty);
            }
        }
    }

    //TODO FIXME protected updateElement(property: string, value: string) {
    //     if (this.$view instanceof HTMLInputElement) {
    //         if (value != null) {
    //             if(property == this.lastProperty) {
    //                 (<HTMLInputElement>this.$view)[this.getStandardProperty()] = value;
    //             } else {
    //                 // this.getRoot().setValue(this, property, value, (<HTMLInputElement>this.$view)[property]);
    //                 (<HTMLInputElement>this.$view)[property] = value;
    //             }
    //         } else {
    //             delete (<HTMLInputElement>this.$view)[property];
    //         }
    //     }
    // }

    private controlChanged(ev: Event) {
        if (this.$view instanceof HTMLInputElement == false) {
            return;
        }
        let element = (<HTMLInputElement>this.$view);
        if (element.checkValidity()) {
//<<<<<<< HEAD
            let newVal = element[this.getStandardProperty()];
            if (this.isKeyOnly()) {
                // we expect, element[this.lastProperty] to be boolean:
                if (!newVal) {
                    newVal = null;
                }
            } else {
            }
            //let $graphModel;
            //let value;
            /*if (this.$graphModel) {
                $graphModel = this.$graphModel;
                value = this.$graphModel.getValue(this.lastProperty);
            } else {
                $graphModel = this;
                if (this.$view) {
                    value = this.$view[this.lastProperty];
                }
            }*/
            this.$model.setValue(this.lastProperty, newVal);
            //this.propertyChange(this.$graphModel,this.lastProperty, this.$graphModel.getValue(this.lastProperty), newVal);
            //this.getRoot().setValue($graphModel, this.lastProperty, newVal, value);
//=======
            // let newVal = element[this.lastProperty];
            // if (this.isKeyOnly()) {
            //     // we expect, element[this.lastProperty] to be boolean:
            //     if (!newVal) {
            //         newVal = null;
            //     }
            // } else {
            // }
            // let $graphModel;
            // let value;

            // $graphModel = this.getViewData();
            // if (this.$graphModel) {
            //     $graphModel = this.$graphModel;
            //     value = this.$graphModel.getValue(this.lastProperty);
            // } else {
            //     $graphModel = this;
            //     if (this.$view) {
            //         value = this.$view[this.lastProperty];
            //     }
            // }
            // this.getRoot().setValue($graphModel, this.lastProperty, newVal, value);
//            this.saveViewInData();
//>>>>>>> addOldFunctions
        } else {
            console.log('value does not match the pattern...');
        }
    }

    public setType(type: string): void {
        let oldValue: string = this.type;
        if (oldValue === type) {
            return;
        }
        if(type=="radio") {
            this.viewData.setValue("checked", null);
        }else {
            this.viewData.removeKey("checked");
        }
    }
}
