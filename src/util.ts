'use strict';
import {CSS} from './CSS';
import {Node} from './elements/nodes/Node';
import {DiagramElement, Point} from './elements/BaseElements';
import {Control} from './Control';

export class Util {
    static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static createShape(attrs: any): SVGSVGElement {
        let xmlns = attrs.xmlns || 'http://www.w3.org/2000/svg';
        let shape = document.createElementNS(xmlns, attrs.tag);
        for (let attr in attrs) {
            if (attr !== 'tag') {
                shape.setAttribute(attr, attrs[attr]);

            }
        }
        return <SVGSVGElement><any>shape;
    }

    static toPascalCase(value: string): string {
        value = value.charAt(0).toUpperCase() + value.substring(1).toLowerCase();
        return value;
    }

    static isSVG(tag: string): boolean {
        let i,
            list = ['svg', 'path', 'polygon', 'polyline', 'line', 'title', 'rect', 'filter', 'feGaussianBlur', 'feOffset', 'feBlend', 'linearGradient', 'stop', 'text', 'symbol', 'textPath', 'defs', 'fegaussianblur', 'feoffset', 'feblend', 'circle', 'ellipse', 'g'];
        for (i = 0; i < list.length; i += 1) {
            if (list[i] === tag) {
                return true;
            }
        }
        return false;
    }

    static create(node: any): Element {
        let style, item, xmlns, key, tag, k;
        if (document.createElementNS && (this.isSVG(node.tag) || node.xmlns)) {
            if (node.xmlns) {
                xmlns = node.xmlns;
            } else {
                xmlns = 'http://www.w3.org/2000/svg';
            }
            if (node.tag === 'img' && xmlns) {
                item = document.createElementNS(xmlns, 'image');
                item.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
                item.setAttributeNS('http://www.w3.org/1999/xlink', 'href', node.src);
            } else {
                item = document.createElementNS(xmlns, node.tag);
            }
        } else {
            item = document.createElement(node.tag);
        }
        tag = node.tag.toLowerCase();
        for (key in node) {
            if (!node.hasOwnProperty(key)) {
                continue;
            }
            k = key.toLowerCase();
            if (node[key] === null) {
                continue;
            }
            if (k === 'tag' || k.charAt(0) === '$' || k === '$graphModel') {
                continue;
            }
            if (k.charAt(0) === '#') {
                item[k.substring(1)] = node[key];
                continue;
            }
            if (k === 'rotate') {
                item.setAttribute('transform', 'rotate(' + node[key] + ',' + node.$graphModel.x + ',' + node.$graphModel.y + ')');
                continue;
            }
            if (k === 'value') {
                if (!node[key]) {
                    continue;
                }
                if (tag !== 'input') {
                    if (tag === 'text') {// SVG
                        item.appendChild(document.createTextNode(node[key]));
                    } else {
                        item.innerHTML = node[key];
                    }
                } else {
                    item[key] = node[key];
                }
                continue;
            }
            if (k.indexOf('on') === 0) {
                this.bind(item, k.substring(2), node[key]);
                continue;
            }
            if (k.indexOf('-') >= 0) {
                item.style[key] = node[key];
            } else {
                if (k === 'style' && typeof (node[key]) === 'object') {
                    for (style in node[key]) {
                        if (!node[key].hasOwnProperty(style)) {
                            continue;
                        }
                        if (node[key][style]) {
                            if ('transform' === style) {
                                item.style.transform = node[key][style];
                                item.style.msTransform = item.style.MozTransform = item.style.WebkitTransform = item.style.OTransform = node[key][style];
                            } else {
                                item.style[style] = node[key][style];
                            }
                        }
                    }
                } else {
                    item.setAttribute(key, node[key]);
                }
            }
        }
        if (node.$parent) {
            node.$parent.appendChild(item);
        }
        if (node.$graphModel) {
            item.$graphModel = node.$graphModel;
        }
        return item;
    }

    static setSize(item: any, width: number | string, height: number | string): void {
        let value: number;
        value = Util.getValue(width);
        item.setAttribute('width', value);
        item.style.width = Math.ceil(value);
        value = Util.getValue(height);
        item.setAttribute('height', value);
        item.style.height = Math.ceil(value);
    }

    static setPos(item: any, x: number, y: number): void {
        if (item.x && item.x.baseVal) {
            item.style.left = x + 'px';
            item.style.top = y + 'px';
        } else {
            item.x = x;
            item.y = y;
        }
    }

    static getValue(value: string | number): number {
        return parseInt(('0' + value).replace('px', ''), 10);
    }

    static isIE(): boolean {
        return document.all && !window['opera'];
    }

    static isFireFox(): boolean {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    }

    static isOpera(): boolean {
        return navigator.userAgent.indexOf('Opera') > -1;
    }

    static getEventX(event: Event | any): number {
        return (this.isIE) ? window.event['clientX'] : event.pageX;
    }

    static getEventY(event: Event | any): number {
        return (this.isIE) ? window.event['clientY'] : event.pageY;
    }

    static getNumber(str: string): number {
        return parseInt((str || '0').replace('px', ''), 10);
    }

    static getStyle(styleProp: string): CSS {
        let i, style, diff, current, ref, el = document.createElement('div'), css;
        document.body.appendChild(el);
        css = new CSS(styleProp);
        ref = new CSS(styleProp, el).css;
        style = window.getComputedStyle(el, null);
        el.className = styleProp;
        current = new CSS(styleProp, el).css;
        diff = Util.getNumber(style.getPropertyValue('border-width'));
        for (i in current) {
            if (!current.hasOwnProperty(i)) {
                continue;
            }
            if (i === 'width' || i === 'height') {
                if (Util.getNumber(current[i]) !== 0 && Util.getNumber(current[i]) + diff * 2 !== Util.getNumber(ref[i])) {
                    css.add(i, current[i]);
                }
            } else if (current[i] !== ref[i]) {
                css.add(i, current[i]);
            }
        }
        document.body.removeChild(el);
        return css;
    }

    static sizeOf(item: any, model: Node, node?: Node) {
        let board, rect, root;
        if (!item) {
            return;
        }
        root = <DiagramElement>model.getRoot();
        board = root.$view;
        let addBoard: boolean = false;
        if (!board) {
            addBoard = true;
            board = Util.createShape({tag: 'svg', id: 'root', width: 200, height: 200});
            document.body.appendChild(board);
        }
        if (board.tagName === 'svg') {
            if (typeof item === 'string') {
                item = Util.create({tag: 'text', $font: true, value: item});
                item.setAttribute('width', '5px');
            }
        } else if (typeof item === 'string') {
            item = document.createTextNode(item);
        }
        board.appendChild(item);
        rect = item.getBoundingClientRect();
        board.removeChild(item);
        if (node) {
            if (node.getSize().isEmpty()) {
                node.withSize(Math.ceil(rect.width), Math.ceil(rect.height));
            }
        }
        if (addBoard) {
            document.body.removeChild(board);
        }
        return rect;
    }

    static getColor(style: string, defaultColor?: string) {
        if (style) {
            if (style.toLowerCase() === 'create') {
                return '#008000';
            }
            if (style.toLowerCase() === 'nac') {
                return '#FE3E3E';
            }
            if (style.indexOf('#') === 0) {
                return style;
            }
        }
        if (defaultColor) {
            return defaultColor;
        }
        return '#000';
    }

    public static utf8$to$b64(str: string) : string {
        return window.btoa(encodeURIComponent(str))
    }

    public static showSVG(control: DiagramElement) {
        let svg = Util.create({
            tag: 'svg',
            style: {left: control.getPos().x, top: control.getPos().y, position: 'absolute'}
        });
        let child = control.getSVG();
        if (child) {
            svg.appendChild(child);
        }
        Util.setSize(svg, control.getSize().x, control.getSize().y);
        document.body.appendChild(svg);
    }

    public static toJson(ref: JSON | Object): Object {
        let result = {};
        return Util.copy(result, ref, false, false);
    }

    public static initControl(parent: Control, control: Control, type: string, id: string, json: JSON | Object) {
        if (typeof control.init === 'function') {
            control.init(parent, type, id);
        }
        if (typeof control.load === 'function') {
            control.load(json);
        }
    }

    /**
     * copy One Json into another
     * @function
     * @param ref reference Json
     * @param src source Json
     * @param full all attributes include privet $
     * @param replace set the original reference or copy it
     * @returns ref
     * @name copy
     */
    public static copy(ref: JSON | Object, src: JSON | Object, full: boolean, replace: boolean) {
        if (src) {
            let i;
            for (i in src) {
                if (!src.hasOwnProperty(i) || typeof (src[i]) === 'function') {
                    continue;
                }
                if (i.charAt(0) === '$') {
                    if (full) {
                        ref[i] = src[i];
                    }
                    continue;
                }
                if (typeof (src[i]) === 'object') {
                    if (replace) {
                        ref[i] = src[i];
                        continue;
                    }
                    if (!ref[i]) {
                        if (src[i] instanceof Array) {
                            ref[i] = [];
                        } else {
                            ref[i] = {};
                        }
                    }
                    Util.copy(ref[i], src[i], full, false);
                } else {
                    if (src[i] === '') {
                        continue;
                    }
                    ref[i] = src[i];
                }
            }
        }
        return ref;
    }

    public static xmlstringify(text: string): string {
        text = text.replace('<', '&lt;');
        text = text.replace('>', '&gt;');
        return text;
    }

    public static toXML(ref: JSON | Object | any, src: JSON | Object | any, full: boolean, doc: Document): any {
        let name;
        if (!ref) {
            name = src.constructor.name;
            doc = document.implementation.createDocument(null, name, null);
            ref = doc.childNodes[0];
        }
        if (src) {
            let i;
            for (i in src) {
                if (!src.hasOwnProperty(i) || typeof (src[i]) === 'function') {
                    continue;
                }
                if (i.charAt(0) === '$') {
                    if (full) {
                        ref[i] = src[i];
                    }
                    continue;
                }
                if (typeof (src[i]) === 'object') {
                    if (!ref.getAttribute(i)) {
                        if (src[i] instanceof Array) {
                            for (let c in src[i]) {
                                name = src[i][c].constructor.name;
                                let child = doc.createElement(name);
                                ref.appendChild(child);
                                Util.toXML(child, src[i][c], full, doc);
                            }
                        } else {
                            name = src[i].constructor.name;
                            let child = doc.createElement(name);
                            ref.appendChild(child);
                            Util.toXML(child, src[i], full, doc);
                        }
                    } else {
                        Util.toXML(ref.getAttribute(i), src[i], full, doc);
                    }
                } else {
                    if (src[i] === '') {
                        continue;
                    }
                    ref.setAttribute(i, src[i]);
                }
            }
        }
        return ref;
    }

    static Range(min: Point, max: Point, x: number, y: number) {
        max.x = Math.max(max.x, x);
        max.y = Math.max(max.y, y);
        min.x = Math.min(min.x, x);
        min.y = Math.min(min.y, y);
    }

    public static getPosition(m: number, n: number, entity: DiagramElement, refCenter: Point) {
        let t, p = [], list, distance = [], min = 999999999, position, i, step = 15;
        let pos: Point = entity.getPos();
        let size: Point = entity.getSize();
        list = [Point.LEFT, Point.RIGHT];
        for (i = 0; i < 2; i += 1) {
            t = this.getLRPosition(m, n, entity, list[i]);
            if (t.y >= pos.y && t.y <= (pos.y + size.y + 1)) {
                t.y += (entity['$' + list[i]] * step);
                if (t.y > (pos.y + size.y)) {
                    // Alternative
                    t = Util.getUDPosition(m, n, entity, Point.DOWN, step);
                }
                p.push(t);
                distance.push(Math.sqrt((refCenter.x - t.x) * (refCenter.x - t.x) + (refCenter.y - t.y) * (refCenter.y - t.y)));
            }
        }
        list = [Point.UP, Point.DOWN];
        for (i = 0; i < 2; i += 1) {
            t = Util.getUDPosition(m, n, entity, list[i]);
            if (t.x >= pos.x && t.x <= (pos.x + size.x + 1)) {
                t.x += (entity['$' + list[i]] * step);
                if (t.x > (pos.x + size.x)) {
                    // Alternative
                    t = this.getLRPosition(m, n, entity, Point.RIGHT, step);
                }
                p.push(t);
                distance.push(Math.sqrt((refCenter.x - t.x) * (refCenter.x - t.x) + (refCenter.y - t.y) * (refCenter.y - t.y)));
            }
        }
        for (i = 0; i < p.length; i += 1) {
            if (distance[i] < min) {
                min = distance[i];
                position = p[i];
            }
        }
        return position;
    }

    public static getUDPosition(m: number, n: number, e: DiagramElement, p: string, step?: number) {
        let pos: Point = e.getPos();
        let size: Point = e.getSize();
        let x, y: number = pos.y;
        if (p === Point.DOWN) {
            y += size.y;
        }
        x = (y - n) / m;
        if (step) {
            x += e['$' + p] * step;
            if (x < pos.x) {
                x = pos.x;
            } else if (x > (pos.x + size.x)) {
                x = pos.x + size.x;
            }
        }
        return new Point(x, y, p);
    }

    public static getLRPosition(m: number, n: number, e: DiagramElement, p: string, step?: number) {
        let pos: Point = e.getPos();
        let size: Point = e.getSize();
        let y: number, x: number = pos.x;
        if (p === Point.RIGHT) {
            x += size.x;
        }
        y = m * x + n;
        if (step) {
            y += e['$' + p] * step;
            if (y < pos.y) {
                y = pos.y;
            } else if (y > (pos.y + size.y)) {
                y = pos.y + size.y;
            }
        }
        return new Point(x, y, p);
    }

    public static hasClass(element: Element, cls: string) {
        let className = element.getAttribute('class');
        return className.indexOf(cls) > 0;
    }
    public static addClass(element: Element, cls: string) {
        if (!Util.hasClass(element, cls)) {
            let className = element.getAttribute('class');
            element.setAttributeNS(null, 'class', className + ' ' + cls);
        }
    }
    public static removeClass(element: Element, cls: string) {
        if (Util.hasClass(element, cls)) {
            let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            let className = element.getAttribute('class');
            element.setAttributeNS(null, 'class', className.replace(reg, ' ').trim());
        }
    }
}
