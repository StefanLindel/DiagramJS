///<reference path="Control.ts"/>
///<reference path="Input.ts"/>
///<reference path="Table.ts"/>
///<reference path="Data.ts"/>
///<reference path="BridgeElement.ts"/>
///<reference path="Div.ts"/>
///<reference path="Form.ts"/>
///<reference path="Label.ts"/>
///<reference path="BR.ts"/>

class Bridge {
    public static version: string = "0.42.01.1601007-1739";
    private listener: Array<Object> = [];
    private controlFactory: Object = {};
    private controls: Object = {};
    private items: Object = {};
    private controlNo: number = 1;

    constructor() {
        this.addControl(Table);
        this.addControl(Input);
        this.addControl(Div);
        this.addControl(Form);
        this.addControl(Label);
    }

    public addListener = function (listener) {
        this.listener.push(listener);
    };

    public addControl(control) {
        this.controlFactory[control.name.toLowerCase()] = control;
    }

    public getId(): string {
        return "control" + (this.controlNo++);
    }

    public load(json): string {
        let className;
        if (typeof(json) === "object") {
            if (!json["id"]) {
                json["id"] = this.getId();
            }
            className = json["control"].toLowerCase();
        } else {
            let item = document.getElementById(json);
            if (item) {
                className = item.getAttribute("control");
                if (className) {
                    className = className.toLowerCase();
                } else {
                    className = "";
                }
            }
        }
        if (typeof(this.controlFactory[className]) === "object" || typeof(this.controlFactory[className]) === "function") {
            let obj = this.controlFactory[className];
            let control = new obj(this, json);
            this.controls[control.id] = control;
            return control.id;
        }
        return null;
        //bridge.load("{class:table, columns:[{id:'firstname'}, {id:'lastname'}]}");
    }

    public executeChange(change) {
        let newData = !this.hasItem(change.id);
        let item: Data = this.getItem(change.id);
        if (change["class"]) {
            item.property = change["class"];
        }
        if (newData) {
            for (let i in this.controls) {
                if (this.controls.hasOwnProperty(i) === false) {
                    continue;
                }
                this.controls[i].addItem(this, item);
            }
        }
        this.addProperties(change["property"], item);
        this.addProperties(change["upd"], item);
    }

    public addProperties(prop: Object, item: Data) {
        if (!prop) {
            return;
        }
        for (let property in prop) {
            if (prop.hasOwnProperty(property) === false) {
                continue;
            }
            if (prop[property] && "" !== prop[property]) {
                item.setValue(property, prop[property]);
            }
        }
    }

    public hasItem(id: string) : boolean {
        return (this.items[id] != null)
    }

    public getItem(id: string) : Data {
        let item = this.items[id];
        if (!item) {
            item = new Data();
            item.id = id;
            this.items[id] = item;
        }
        return item;
    }

    public setValue(object: Object, attribute: string, value: Object){
        var obj:Object;
        var id:string;
        if(object instanceof String || typeof object === "string"){
            // object is only the id of the Object, we want to change
            id = object.toString();
            obj = this.getItem(id);

        }else if(object.hasOwnProperty("id")){
            // object is the real Object, we want to change
            obj = object;
            id = object['id'];
        }else {
            console.log("object is neither Data nor String..");
            return;
        }
        if(obj){
            // Could be done here, but currently is done at this.execueChange..:
            //obj[attribute] = value;
        }
        var upd = {};
        upd[attribute] = value;
        this.executeChange({'id':id, upd});
    }

    public getValue(object: Object, attribute: string): any{
        var obj:Object;
        var id:string;
        if(object instanceof String || typeof object === "string"){
            // object is only the id of the Object, we want to change
            id = object.toString();
            obj = this.getItem(id);

        }else if(object.hasOwnProperty("id")) {
            // object is the real Object, we want to change
            obj = object;
            id = object['id'];
        }else {
            console.log("object is neither Data nor String..");
            return;
        }
        if(obj){
            if(obj.hasOwnProperty(attribute)){
                return obj[attribute];
            }else if(obj instanceof Data){
                return (<Data>obj).getValue(attribute);
            }else{
                return null;
            }
        }
    }

    public getNumber(object: Object, attribute: string, defaultValue: number = 0): number {
        let res = <number>this.getValue(object, attribute);
        return (typeof res === 'number') ? res : defaultValue;
    }

    getControl(controlId: string) {
        return this.controls[controlId];
    }
}
var bridge = new Bridge();
