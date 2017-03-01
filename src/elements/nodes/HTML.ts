/**
 * Created by Stefan on 01.03.2017.
 */
import {Control} from '../../Control';

export class HTML extends Control {
    private $element: HTMLElement;

    constructor(data) {
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
            this.$element = document.getElementById(id);
        }
        if (!this.$element) {
            tag = data['tag'] || 'div';
            this.$element = document.createElement(tag);
            let parent = document.getElementsByTagName('body')[0];
            parent.appendChild(this.$element);
        }
        if (!parent) {
            return;
        }
        this.writeAttribute(data, this.$element);
    }

    private writeAttribute(properties, entity?) {
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

            if (lowKey === 'tag' || lowKey.charAt(0) === '$' || lowKey === 'model' || lowKey === 'class') {
                continue;
            }
            if (lowKey === 'children') {
                if (Array.isArray(properties[key])) {
                    let item;
                    for (item in properties[key]) {
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
