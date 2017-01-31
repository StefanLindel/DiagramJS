import * as controls from "./controls";
import Data from "./Data";
import Control from "./Control";
import {Adapter} from "./Adapter";


export default class Bridge {
    //noinspection JSUnusedGlobalSymbols
    public static version: string = "0.42.01.1601007-1739";
    private listener: Array<Object> = [];
    private controlFactory: Object = {};
    private controls: Object = {};
    private adapters:Map<string, Adapter[]> = new Map<string, Adapter[]>();
    private items: Object = {};
    private controlNo: number = 1;
    private online:boolean = true;
    private language:string = navigator.language.toUpperCase();
    private toolBar:HTMLElement;

    constructor() {
        let i;
        let keys:string[] = Object.keys(controls);
        for(i=0;i<keys.length;i++) {
            this.addControl(controls[keys[i]]);
        }

        let that = this;
        window.addEventListener('load', function() {
            let updateOnlineStatus = function updateOnlineStatus() {that.setOnline(navigator.onLine);};
            window.addEventListener('online',  updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);
        });
    }

    //noinspection JSUnusedGlobalSymbols
    public setOnline(value:boolean) {
        this.online = value;
        if(this.toolBar.children[0]) {
            this.toolBar.children[0].className = value ? "online" : "offline";
        }
    }
    //noinspection JSUnusedGlobalSymbols
    public addToolbar() :boolean{
        if(this.toolBar) {
            return false;
        }
        this.toolBar = document.createElement("div");
        this.toolBar.className = "onlineStatus";
        let child = document.createElement("div");
        child.className = "online";
        this.toolBar.appendChild(child);
        child = document.createElement("div");
        child.className = "lang";
        child.innerHTML = this.language;
        this.toolBar.appendChild(child);

        let body:HTMLElement = document.getElementsByTagName("body")[0];
        body.insertBefore(this.toolBar, body.firstChild);
        // Refresh Online Status
        this.setOnline(this.online);
    }
    //noinspection JSUnusedGlobalSymbols
    public addListener = function (listener) {
        this.listener.push(listener);
    };

    public addControl(control) {
        this.controlFactory[control.name.toLowerCase()] = control;
    }

    public getId(): string {
        return "control" + (this.controlNo++);
    }

    public load(json): Control {
        let className;
        if (typeof(json) === "object") {
            if (!json["id"]) {
                json["id"] = this.getId();
            }
            className = json["class"].toLowerCase();
        } else {
            let item = document.getElementById(json);
            if (item) {
                className = item.getAttribute("class");
                if (className) {
                    className = className.toLowerCase();
                } else {
                    className = "";
                }
            } else {
                className = json;
            }
        }
        if (typeof(this.controlFactory[className]) === "object" || typeof(this.controlFactory[className]) === "function") {
            let obj = this.controlFactory[className];
            let control = new obj(this, json);
            this.controls[control.id] = control;
            return control;
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
        Bridge.addProperties(change["prop"], item);
        Bridge.addProperties(change["upd"], item);

        for (let adapter in this.adapters) {
            this.adapters[adapter].update(JSON.stringify(change));
        }
    }

    public static addProperties(prop: Object, item: Data) {
        if (!prop) {
            return;
        }
        for (let property in prop) {
            if (prop.hasOwnProperty(property) === false) {
                continue;
            }
            if (prop[property] != null && "" !== prop[property]) {
                item.setValue(property, prop[property]);
            }
        }
    }

    public hasItem(id: string): boolean {
        return (this.items[id] != null)
    }

    public getItem(id: string): Data {
        let item = this.items[id];
        if (!item) {
            item = new Data();
            item.id = id;
            this.items[id] = item;
        }
        return item;
    }


    public setValue(object: Object, attribute: string, value: Object) {
        let obj: Object;
        let id: string;
        if (object instanceof String || typeof object === "string") {
            // object is only the id of the Object, we want to change
            id = object.toString();
            obj = this.getItem(id);

        } else if (object.hasOwnProperty("id")) {
            // object is the real Object, we want to change
            obj = object;
            id = object['id'];
        } else {
            console.log("object is neither Data nor String..");
            return;
        }
        if (obj) {
            // Could be done here, but currently is done at this.execueChange..:
            //obj[attribute] = value;
        }
        let upd = {};
        upd[attribute] = value;
        this.executeChange({'id': id, upd});
    }


    public getValue(object: Object, attribute: string): any {
        let obj: Object;
        let id: string;
        if (object instanceof String || typeof object === "string") {
            // object is only the id of the Object, we want to change
            id = object.toString();
            obj = this.getItem(id);
        } else if (object.hasOwnProperty("id")) {
            // object is the real Object, we want to change
            obj = object;
            id = object['id'];
        } else {
            console.log("object is neither Data nor String..");
            return;
        }
        if (obj) {
            if (obj.hasOwnProperty(attribute)) {
                return obj[attribute];
            } else if (obj instanceof Data) {
                return (<Data>obj).getValue(attribute);
            } else {
                return null;
            }
        }
    }

    public getNumber(object: Object, attribute: string, defaultValue: number = 0): number {
        let res = <number>this.getValue(object, attribute);
        if (typeof res === "number") {
            return res;
        } else if (typeof res === "string") {
            // check whether res is a number
            let number = Number(res);
            if (!Number.isNaN(number)) {
                return number;
            }
        }
        return defaultValue;
    }

    getControl(controlId: string) {
        return this.controls[controlId];
    }

    public registerListener(eventType: string, control: Control, callBackfunction:string): Control {
        if(typeof control === "string") {
            control = this.getControl(control);
        }
        if(!control) {
            return null;
        }
        if(eventType) {
            eventType = eventType.toLowerCase();
        }
        control.registerListenerOnHTMLObject(eventType);
        if(callBackfunction) {
            let adapter:DelegateAdapter = new DelegateAdapter();
            adapter.callBackfunction = callBackfunction;
            adapter.id = control.id;
            this.addAdapter(adapter, eventType);
        }
        return control;
    }

    public addAdapter(adapter:Adapter, eventType:string) : Adapter {
        if(!eventType) {
            eventType = null;
        }
        let handlers = this.adapters.get(eventType);

        if (handlers === null || handlers === undefined) {
            handlers = [];
            this.adapters.set(eventType, handlers);
        }
        handlers.push(adapter);
        return adapter;
    }

    public fireEvent(evt: Event) {
        let handlers = this.adapters.get(null);
        if(handlers) {
            for(let i=0;i<handlers.length;i++) {
                let adapter = handlers[i];
                if(adapter.id == null || adapter.id === evt["id"]) {
                    adapter.update(evt);
                }
            }
        }
        handlers = this.adapters.get(evt["eventType"]);
        if(handlers) {
            for (let i = 0; i < handlers.length; i++) {
                let adapter = handlers[i];
                if (adapter.id == null || adapter.id === evt["id"]) {
                    adapter.update(evt);
                }
            }
        }
    }
}
export class DelegateAdapter extends Adapter {
    adapter:Adapter;
    callBackfunction:string;
    update(evt: Object): boolean {
        if(this.adapter) {
            this.adapter.update(evt);
            return true;
        } else if(this.callBackfunction) {
            return this.executeFunction(this.callBackfunction);
        }
        return false;
    }
    private executeFunction = function(string) : boolean{
        let scope = window;
        let scopeSplit = string.split('.');
        for (let i = 0; i < scopeSplit.length - 1; i++) {
            scope = scope[scopeSplit[i]];
            if (scope == undefined) return false;
        }
        let fn:any = scope[scopeSplit[scopeSplit.length - 1]];
        if(typeof fn === 'function') {
            fn.call(scope);
            return true;
        }
        return false;
    }
}

//noinspection JSUnusedLocalSymbols
const bridge = new Bridge();
