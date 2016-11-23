import Control from '../Control'
import Data from '../Data'
import {Input} from './Input'

export class Form extends Control {
    private $element: HTMLFormElement;
    private entity;
    private applyingChange: boolean = false;
    private children: Map<string, Input> = new Map();

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
        var id: string;
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
        } else {
            if (!form) {
                this.$element = document.createElement("form");
                this.$element.setAttribute("id", this.id);

                // add all the attributes to the form element
                for (let attr in data) {
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
        let objId = this.id;
        let hasItem = this.owner.hasItem(objId);
        if (hasItem) {
            var item = this.owner.getItem(objId);
            item.addListener(this);
            this.entity = item;
        }

        // now create all the sub input controls
        for (let field of data.elements) {
            // this.createField(field);
            if (field.hasOwnProperty("property")) {
                var property = field["property"];
                property = this.id + '.' + property;
                field['property'] = property;
            }
            if (!field.hasOwnProperty("control")) {
                field['control'] = 'input';
            }
            this.owner.load(field);
        }

    }

    /**
     * Here we create the form elements and put all the attributes to them in order for the Control only having to load
     * the data were appending here. Alternative would be loading with the bridge and afterwards setting
     * the owner to the form instead of the body..
     * @param field
     */
    private createField(field: Object) {
        var control = "input";
        if (field.hasOwnProperty("control")) {
            control = field['control'];
        }
        let input = document.createElement(control);
        input.setAttribute("control", control);
        var id: string;
        if (!field.hasOwnProperty("id")) {
            // TODO: not the best solution for generating unique id's for forms...
            id = this.owner.getId();
            field['id'] = id;
        }
        if (field.hasOwnProperty("property")) {
            var property = field["property"];
            property = this.id + '.' + property;
            input.setAttribute("property", property);
        }
        for (let attr in field) {
            if (attr == "property" || attr == "control" || !field.hasOwnProperty(attr)) {
                continue;
            }
            input.setAttribute(attr, field[attr]);
        }

        this.$element.appendChild(input);

        var controlId = this.owner.load(field['id']);
        this.children.set(controlId, this.owner.getControl(controlId));
    }


    propertyChange(entity: Data, property: string, oldValue, newValue) {
    }
}