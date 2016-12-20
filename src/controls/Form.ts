import Control from "../Control";
import Data from "../Data";

//noinspection JSUnusedGlobalSymbols
export class Form extends Control {
    private $element: HTMLFormElement;
    //private applyingChange: boolean = false;
    private children: Map<string, Control> = new Map();
    // private property: string = "";

    /**
     * Data should look like the following json:
     *
     * <pre>{
     *      id: "t1",
     *      control: "form",
     *      elements: [
     *          {id: "inputField1", property: "talk"},
     *          {id: "inputField2", property: "room"}
     *      ]
     * }</pre>
     * @param owner
     * @param data
     */
    constructor(owner, data) {
        super(owner, data);
        let id: string;
        // init form HTML
        if (typeof(data) === "string") {
            id = data;
        } else {
            id = data.id;
        }
        if (!id) {
            return;
        }
        this.id = id;
        let form: HTMLElement = document.getElementById(id);

        if (form instanceof HTMLFormElement) {
            this.$element = form;
            if (this.$element.hasAttribute("property")) {
                this.property = this.$element.getAttribute("property");
            }
        } else {
            if (!form) {
                this.$element = document.createElement("form");
                this.$element.setAttribute("id", this.id);

                if (data.hasOwnProperty("property")) {
                    this.property = data['property'];
                }

                // add all the attributes to the form element
                for (let attr in data) {
                    if (data.hasOwnProperty(attr) === false) {
                        continue;
                    }
                    if (attr == "elements") {
                        continue;
                    }
                    this.$element.setAttribute(attr, data[attr]);
                }

                document.getElementsByTagName("body")[0].appendChild(this.$element);
            } else {
                // the id is already taken by an object, that is not an input field...
                return;
            }
        }

        // check if object already exists
        let objId = this.property;
        let hasItem = this.owner.hasItem(objId);
        if (hasItem) {
            let item = this.owner.getItem(objId);
            item.addListener(this);
            this.entity = item;
        }

        // now create all the sub input controls
        for (let field of data.elements) {
            // this.createField(field);
            if (field.hasOwnProperty("property")) {
                let property = field["property"];
                property = this.property + '.' + property;
                field['property'] = property;
            }
            if (!field.hasOwnProperty("class")) {
                field['class'] = 'input';
            }
            let control:Control = this.owner.load(field);
            this.children.set(control.id, control);
        }

    }

    /**
     * Here we create the form elements and put all the attributes to them in order for the Control only having to load
     * the data were appending here. Alternative would be loading with the bridge and afterwards setting
     * the owner to the form instead of the body..
     * @param field
     */
    private createField(field: Object) {
        let control = "input";
        if (field.hasOwnProperty("class")) {
            control = field['class'];
        }
        let input = document.createElement(control);
        input.setAttribute("class", control);
        let id: string;
        if (!field.hasOwnProperty("id")) {
            // TODO: not the best solution for generating unique id's for forms...
            id = this.owner.getId();
            field['id'] = id;
        }
        if (field.hasOwnProperty("property")) {
            let property = field["property"];
            property = this.id + '.' + property;
            input.setAttribute("property", property);
        }
        for (let attr in field) {
            if (attr == "property" || attr == "class" || !field.hasOwnProperty(attr)) {
                continue;
            }
            input.setAttribute(attr, field[attr]);
        }

        this.$element.appendChild(input);

        let newcontrol:Control = this.owner.load(field['id']);
        this.children.set(newcontrol.id, newcontrol);
    }


    propertyChange(entity: Data, property: string, oldValue, newValue) {
    }

    public setProperty(id: string): void {
        this.property = id;
        for (let [id, childControl] of this.children) {
            if (this.children.hasOwnProperty(id) === false) {
                continue;
            }
            // only set Property, if there is a Property defined before
            if (childControl.property) {
                childControl.setProperty(this.property + "." + childControl.lastProperty);
            }
        }
    }
}