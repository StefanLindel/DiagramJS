'use strict';

import * as controls from "./elements/nodes";
import * as adapters from "./adapters";
import Data from "./Data";
import {Control} from "./Control";
import {Adapter} from "./Adapter";
import {Graph} from "./elements/Graph";
import {Util} from "./util";
import {Point} from "./elements/BaseElements";

export class Bridge extends Control {
    // noinspection JSUnusedGlobalSymbols
    public static version: string = '0.42.01.1601007-1739';
    private listener: Array<Object> = [];
    private controlFactory: Object = {};
    private adapterFactory: Object = {};
    private controls: Object = {};
    private adapters: Object = {};
    private items: Object = {};
    private controlNo: number = 1;
    private online: boolean = true;
    private language: string = navigator.language.toUpperCase();
    private toolBar: HTMLElement;

    constructor() {
        super();
        let i;

        let keys: string[] = Object.keys(adapters);
        for (i = 0; i < keys.length; i++) {
            let child = adapters[keys[i]];
            if (child && child.id) {
                this.adapterFactory[child.id.toLowerCase()] = child;
            }
        }


        keys = Object.keys(controls);
        for (i = 0; i < keys.length; i++) {
            this.addControl(controls[keys[i]]);
        }
        this.addControl(Graph);

        let that = this;
        window.addEventListener('load', function () {
            let updateOnlineStatus = function updateOnlineStatus() {
                that.setOnline(navigator.onLine);
            };
            window.addEventListener('online', updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    public setOnline(value: boolean) {
        this.online = value;
        if (this.toolBar.children[0]) {
            this.toolBar.children[0].className = value ? 'online' : 'offline';
        }
    }

    // noinspection JSUnusedGlobalSymbols
    public addToolbar(): boolean {
        if (this.toolBar) {
            return false;
        }
        this.toolBar = document.createElement('div');
        this.toolBar.className = 'onlineStatus';
        let child = document.createElement('div');
        child.className = 'online';
        this.toolBar.appendChild(child);
        child = document.createElement('div');
        child.className = 'lang';
        child.innerHTML = this.language;
        this.toolBar.appendChild(child);

        let body: HTMLElement = document.getElementsByTagName('body')[0];
        body.insertBefore(this.toolBar, body.firstChild);
        // Refresh Online Status
        this.setOnline(this.online);
        return true;
    }

    // noinspection JSUnusedGlobalSymbols
    public addListener = function (listener: any) {
        this.listener.push(listener);
    };

    public addControl(control: any) {
        if (control && control.name) {
            this.controlFactory[control.name.toLowerCase()] = control;
        }
    }

    public getId(): string {
        return 'control' + (this.controlNo++);
    }

    public adapterUpdate(message:string){
        let keys: string[] = Object.keys(this.adapters);
        if (keys.length > 0) {
            let i;
            for (i = 0; i < keys.length; i++) {
                let adapterList = this.adapters[keys[i]];
                if (adapterList instanceof Adapter) {
                    adapterList.update(message);
                } else {
                    for (let adapter of adapterList) {
                        adapter.update(message);
                    }
                }
            }
        }
    }

    public load(json: JSON|Object, owner?: Control): any {
        let config = {}, className: string, id: string;
        if (typeof(json) === 'string') {
            // Only a String
            config['id'] = "" + json;
            let item = document.getElementById(config['id']);
            let className: string;
            if (item) {
                className = item.getAttribute('class');
                if (!className) {
                    className = item.getAttribute('classname') || '';
                }
                // Found Element and now config Data element
                if (item.getAttribute("property")) {
                    if (this.hasItem(item.getAttribute("property"))) {
                        let data = this.getItem(item.getAttribute("property"));
                        for (let key in data.prop) {
                            if (item.getAttribute(key)) {
                                data.setValue(key, item.getAttribute(key));
                            }
                        }
                        if (item.getAttribute("property")) {
                            data.property = item.getAttribute("property");
                        }
                    }
                }
            } else {
                className = "" + json;
            }
            className = className.toLowerCase();
            config['className'] = className;
        } else {
            config = <JSON>json;
        }
        // Config validate
        if (!config['id']) {
            config['id'] = this.getId();
        }
        className = config['className'] || config['class'];
        className = className.toLocaleLowerCase();
        id = config['id'];

        // Check For Control or Data
        if ((config['prop'] || config['upd'] || config['rem']) && this.controls[id] == null) {
            // Its Data
            let newData = !this.hasItem(config['id']);
            let item: Data = this.getItem(config['id']);
            if (id && className && !item.property) {
                 item.property = className;
            }
            if (newData) {
                for (let i in this.controls) {
                    if (this.controls.hasOwnProperty(i) === false) {
                        continue;
                    }
                    this.controls[i].addItem(this, item);
                }
            }
            // Add all Values to item
            item.addProperties(config);
            //Bridge.addProperties(config['prop'], item);
            //Bridge.addProperties(config['upd'], item);
            //Bridge.addProperties(config['upd'], item);

           this.adapterUpdate(JSON.stringify(config));
            return item;
        }

        let control;
        if (this.controls[id]) {
            control = this.controls[id];
            control.initControl(json);
            this.adapterUpdate(JSON.stringify(config));
            return control;
        }

        if (typeof(this.controlFactory[className]) === 'object' || typeof(this.controlFactory[className]) === 'function') {
            let obj = this.controlFactory[className];
            control = new obj(json);
            Util.initControl(owner || this, control, config['property'], id, json);

            if (control.id) {
                this.controls[control.id] = control;
            } else {
                this.controls[id] = control;
            }

            // create DataObject and register this control as listener to it
            // let obj = {id:id};
            // let data: Data = this.load(obj);
            // data.addListener(this);

            // Try to Show
            if (typeof control.getSVG === 'function' && typeof control.getSize === 'function') {
                let size: Point = control.getSize();

                let svg = Util.createShape({
                    tag: 'svg',
                    id: 'root',
                    width: size.x,
                    height: size.y
                });

                let view = control.getSVG();
                svg.appendChild(view);
                document.getElementsByTagName('body')[0].appendChild(svg);
            }
            return control;
        }
        return null;
        // bridge.load('{class:table, columns:[{id:'firstname'}, {id:'lastname'}]}');
    }

    public hasItem(id: string): boolean {

        if (this.items[id] !== undefined) {
            return true;
        }
        id = id.split('.')[0];
        return (this.items[id] !== undefined);
    }

    public getItems(): Object {
        return this.items;
    }

    public getItem(id: string): Data {
        let item = this.items[id];
        if (!item) {
            id = id.split('.')[0];
            item = this.items[id];
            if (!item) {
                item = new Data();
                item.id = id;
                this.items[id] = item;
            }
        }
        return item;
    }

    /**
     * Method for executing user input -> Event
     * @param object
     * @param attribute
     * @param oldValue
     * @param newValue
     * @returns {boolean}
     */
    public setValue(object: Object, attribute: string, newValue: Object, oldValue?: Object): boolean {
        let obj: Data;
        let id: string;
        if (object instanceof String || typeof object === 'string') {
            // object is only the id of the Object, we want to change
            id = object.toString();
            obj = this.getItem(id);

        } else if (object instanceof Data) {
            obj = object;
            id = object.id;
        } else if (object.hasOwnProperty('id')) {
            // object is the real Object, we want to change
            obj = <Data>object;
            id = object['id'];
        } else {
            console.log('object is neither Data nor String..');
            return false;
        }
        if (obj) {
            // Execute Update to Data
            obj.setValue(attribute, newValue);


            // Could be done here, but currently is done at this.execueChange..:
            // obj[attribute] = value;
        }

        /*let tmp = {'id': id};
        if (typeof(newValue) !== 'undefined' && newValue !== null) {
            let upd = {};
            upd[attribute] = newValue;
            tmp['upd'] = upd;
        }
        if (typeof(oldValue) !== 'undefined' && oldValue !== null) {
            let rem = {};
            rem[attribute] = oldValue;
            tmp['rem'] = rem;
        }*/
        //this.load(tmp);
        return true;
    }

    public getValue(object: Object, attribute: string): any {
        let obj: Object;
        let id: string;
        if (object instanceof String || typeof object === 'string') {
            // object is only the id of the Object, we want to change
            id = object.toString();
            obj = this.getItem(id);
        } else if (object.hasOwnProperty('id')) {
            // object is the real Object, we want to change
            obj = object;
            id = object['id'];
        } else {
            console.log('object is neither Data nor String..');
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
        if (typeof res === 'number') {
            return res;
        } else if (typeof res === 'string') {
            // check whether res is a number
            let value = Number(res);
            if (value || value === 0) {
                return value;
            }
        }
        return defaultValue;
    }

    getControl(controlId: string) {
        return this.controls[controlId];
    }

    public registerListener(eventType: string, control: Control, callBackfunction: string): Control {
        if (typeof control === 'string') {
            control = this.getControl(<string>control);
        }
        if (!control) {
            return null;
        }
        if (eventType) {
            eventType = eventType.toLowerCase();
        }
        control.registerListenerOnHTMLObject(eventType);
        if (callBackfunction) {
            let adapter: DelegateAdapter = new DelegateAdapter();
            adapter.callBackfunction = callBackfunction;
            adapter.id = control.getId();
            this.addAdapter(adapter, eventType);
        }
        return control;
    }

    public addAdapter(adapter: Adapter | string, eventType: string): Adapter {
        if (!eventType) {
            eventType = '';
        }
        let result: Adapter;
        if (adapter instanceof String) {
            let obj = this.adapterFactory[adapter.toLowerCase()];
            result = new obj();
        } else {
            result = <Adapter>adapter;
        }
        let handlers = this.adapters[eventType];

        if (handlers === null || handlers === undefined) {
            handlers = [];
            this.adapters[eventType] = handlers;
        }
        handlers.push(result);
        return result;
    }

    public fireEvent(evt: Event): void {
        let handlers = this.adapters[''];
        if (handlers) {
            for (let i = 0; i < handlers.length; i++) {
                let adapter = handlers[i];
                if (adapter.id === null || adapter.id === evt['id']) {
                    adapter.update(evt);
                }
            }
        }
        handlers = this.adapters[evt['eventType']];
        if (handlers) {
            for (let i = 0; i < handlers.length; i++) {
                let adapter = handlers[i];
                if (adapter.id === null || adapter.id === evt['id']) {
                    adapter.update(evt);
                }
            }
        }
    }
}

export class DelegateAdapter extends Adapter {
    adapter: Adapter;
    callBackfunction: string;

    update(evt: Event): boolean {
        if (this.adapter) {
            this.adapter.update(evt);
            return true;
        } else if (this.callBackfunction) {
            return this.executeFunction(this.callBackfunction, evt);
        }
        return false;
    }

    public setAdapter(adapter: Adapter): boolean {
        this.adapter = adapter;
        return true;
    }

    private executeFunction(strValue: string, evt: Event): boolean {
        let scope = window;
        let scopeSplit = strValue.split('.');
        for (let i = 0; i < scopeSplit.length - 1; i++) {
            scope = scope[scopeSplit[i]];
            if (scope === undefined) {
                return false;
            }
        }
        let fn: any = scope[scopeSplit[scopeSplit.length - 1]];
        if (typeof fn === 'function') {
            fn.call(scope);
            return true;
        } else {
            window['callBack1'].update(evt);

        }
        return false;
    }
}
