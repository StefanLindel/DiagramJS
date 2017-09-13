/**
 * Created by Stefan on 01.03.2017.
 */
import {Control} from '../../Control';

export class HTML extends Control {
    constructor(data:JSON|Object|any) {
        super();

        let id: string;
        let tag: string;

        // init form HTML
        if (typeof(data) === 'string') {
            id = data;
            data = {};
        } else {
            id = data.id;
        }
        if (id) {
            this.id = id;
            this.$view = document.getElementById(id);
        }
        if (!this.$view) {
            tag = data['tag'] || 'div';
            this.$view = document.createElement(tag);
            let parent = document.getElementsByTagName('body')[0];
            parent.appendChild(this.$view);
        }
        if (!parent) {
            return;
        }
        this.writeAttribute(data, this.$view);
    }

    private writeAttribute(properties:Object, entity?:any) {
        let lowKey;
        if (!entity) {
            lowKey = properties['tag'] || 'div';
            entity = document.createElement(lowKey);
        }
        for (let key in properties) {
            if (!properties.hasOwnProperty(key)) {
                continue;
            }
            lowKey = key.toLowerCase();
            if (properties[key] === null) {
                entity.setAttribute(key,'');
                continue;
            }

            if (lowKey === 'tag' || lowKey.charAt(0) === '$' || lowKey === '$graphModel' || lowKey === 'class') {
                continue;
            }
            if (lowKey === 'children') {
                if (Array.isArray(properties[key])) {
                    for (let item in properties[key]) {
                        if(properties[key].hasOwnProperty(item) == false) {
                            continue;
                        }
                        let child = this.writeAttribute(item);
                        if (child) {
                            entity.appendChild(child);
                        }
                    }
                } else {
                    let child = this.writeAttribute(properties[key]);
                    if (child) {
                        entity.appendChild(child);
                    }
                }
                continue;
            }
            entity[key] = properties[key];
        }
        return entity;
    }
}
