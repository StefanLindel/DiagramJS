///<reference path="Control.ts"/>
///<reference path="Bridge.ts"/>

class Form extends Control {
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
            this.createField(field);
        }
    }

    private createField(field: Object) {
        if (field.hasOwnProperty("property")) {
            var property = field["property"];
            property = this.id + '.' + property;

            let input = document.createElement("input");
            input.type = "text";
            // TODO: set unique id's...
            var id: string;
            if (field.hasOwnProperty("id")) {
                id = field["id"];
            } else {
                id = bridge.getId();
            }
            input.setAttribute("id", id);
            input.setAttribute("control", "Input");
            input.setAttribute("property", property);
            input.setAttribute("type", field.hasOwnProperty("type")?field['type']:'text');
            input.setAttribute("pattern", field.hasOwnProperty("pattern")?field['pattern']:'');

            this.$element.appendChild(input);

            bridge.load(id);
        }
    }

    propertyChange(entity: Data, property: string, oldValue, newValue) {
    }
}