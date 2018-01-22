import { Node } from './Node';
import { EventBus } from '../../EventBus';
import { Util } from '../../util';
import { Point } from '../BaseElements';
import Attribute from './Attribute';
import Method from './Method';
import { Size } from '../index';

export class Clazz extends Node {
    protected labelHeight = 25;
    protected labelFontSize = 14;
    protected attrHeight = 25;
    protected attrFontSize = 12;

    private attributesObj: Attribute[] = [];
    private methodsObj: Method[] = [];
    private $labelView: Element;

    private style: string;

    constructor(json: JSON | string | Object | any) {
        super(json);
        if (!json) {
            json = {};
        }
        let y = this.labelHeight;
        this.label = json.name || json.label || ('New ' + this.property);
        this.style = json.style || 'flat';

        let width: number = 150;

        if (json['attributes']) {
            for (let attr of json['attributes']) {

                let attrObj = new Attribute(attr);
                attrObj.$owner = this;
                this.attributesObj.push(attrObj);
                y += this.attrHeight;
                width = Math.max(width, Util.sizeOf(attr, this).width);
            }
        }
        if (json['methods']) {
            for (let method of json['methods']) {

                let mthodObj = new Method(method);
                mthodObj.$owner = this;
                this.methodsObj.push(mthodObj);

                y += this.attrHeight;
                width = Math.max(width, Util.sizeOf(method, this).width);
            }
            y += this.attrHeight;
        }
        this.withSize(width, y);
        return this;
    }

    public getAttributesObj(): Attribute[] {
        return this.attributesObj;
    }

    public getMethodsObj(): Method[] {
        return this.methodsObj;
    }

    public getSVG(): Element {
        if (this.style === 'modern') {
            return this.getModernStyle();
        }
        const pos: Point = this.getPos();
        const size: Point = this.getSize();

        // Full Shape
        const nodeShape = this.createShape({
            tag: 'rect',
            x: pos.x,
            y: pos.y,
            height: size.y,
            width: size.x,
            rx: 10,
            ry: 10,
            class: 'SVGClazz'
        });



        // = = = LABEL = = =
        let label = this.createShape({
            tag: 'text',
            x: pos.x + size.x / 2,
            y: pos.y + this.labelHeight / 2,
            'text-anchor': 'middle',
            'alignment-baseline': 'central',
            'font-family': 'Verdana',
            'font-size': this.labelFontSize,
            'font-weight': 'bold',
            fill: 'black'
        });
        label.textContent = this.label;
        this.$labelView = label;

        let group = this.createShape({ tag: 'g', id: this.id, transform: 'translate(0 0)' });
        group.appendChild(nodeShape);
        group.appendChild(label);

        // = = = ATTRIBUTES = = =
        if (this.attributesObj.length > 0) {


            // line to separate label from attributes
            const separatorLabelAttr = this.createShape({
                tag: 'line',
                x1: pos.x,                   //line doesn't overlap the full shape
                y1: pos.y + this.labelHeight,
                x2: pos.x + size.x,        //line doesn't overlap the full shape
                y2: pos.y + this.labelHeight,
                stroke: 'rgb(0, 0, 0)',        //black
                'stroke-width': 2
            });


            group.appendChild(separatorLabelAttr);

            let y = pos.y + this.labelHeight + this.attrHeight / 2;
            for (let attr of this.attributesObj) {

                let attrSvg = attr.getSVG();
                attr.$owner = this;

                attrSvg.setAttributeNS(null, 'x', '' + (pos.x + 10));
                attrSvg.setAttributeNS(null, 'y', '' + y);

                group.appendChild(attrSvg);
                y += this.attrHeight;
            }
        }

        // = = = METHODS = = =
        let height = this.attributesObj.length * this.attrHeight;
        let y = pos.y + this.labelHeight + height + this.attrHeight / 2;
        if (this.methodsObj.length > 0) {

            // line to separate label from attributes
            const separatorAttrMethods = this.createShape({
                tag: 'line',
                x1: pos.x,                   //line doesn't overlap the full shape
                y1: pos.y + this.labelHeight + (this.attrHeight * this.attributesObj.length),
                x2: pos.x + size.x,        //line doesn't overlap the full shape
                y2: pos.y + this.labelHeight + (this.attrHeight * this.attributesObj.length),
                stroke: 'rgb(0, 0, 0)',        //black
                'stroke-width': 2
            });


            group.appendChild(separatorAttrMethods);

            y += this.attrHeight / 2;
            for (let method of this.methodsObj) {

                let methodSvg = method.getSVG();
                method.$owner = this;

                methodSvg.setAttributeNS(null, 'x', '' + (pos.x + 10));
                methodSvg.setAttributeNS(null, 'y', '' + y);

                group.appendChild(methodSvg);
                y += this.attrHeight;
            }
        }

        this.$view = group;
        return group;
    }

    public getEvents(): string[] {
        return [EventBus.ELEMENTMOUSEDOWN, EventBus.ELEMENTMOUSEMOVE, EventBus.ELEMENTCLICK, EventBus.ELEMENTDRAG, EventBus.ELEMENTDBLCLICK, EventBus.EDITOR];
    }

    public getPropertyAsString(type: string): string {
        let value = '';
        if (this[type]) {
            for (let property of this[type]) {
                value += property + '\n';
            }
        }
        return value;
    }

    // returns true if new properties are different from old ones
    public convertStringToProperty(values: string, type: string): boolean {
        if (!this[type]) {
            return false;
        }

        let properties = values.split(/\r?\n/);
        let newProperties: string[] = [];
        for (let property of properties) {
            if (property && property.length > 0) {
                newProperties.push(property);
            }
        }

        let changed = false;
        if (this[type].length !== newProperties.length) {
            changed = true;
        }
        else {
            for (let i = 0; i < this[type].length; i++) {
                if (!this[type][i] || !newProperties[i] || this[type][i] !== newProperties[i]) {
                    changed = true;
                }
            }
        }

        if (changed) {
            this[type] = newProperties;
            this.getSize().y = this.labelHeight + ((this.attributesObj.length + this.methodsObj.length) * this.attrHeight)
                + this.attrHeight;

        }
        return changed;
    }

    public addProperty(value: string, type: string): void {
        if (!this[type] || !value || value.length === 0) {
            return;
        }

        for (let valueOfType of this[type]) {
            if (valueOfType.toString() === value) {
                return;
            }
        }

        let extractedValue;
        if ((<any>type).startsWith('attribute')) {
            extractedValue = new Attribute(value);
        }
        else if ((<any>type).startsWith('method')) {
            extractedValue = new Method(value);
        }

        this[type].push(extractedValue);
    }

    public addAttribute(value: string): void {
        this.addProperty(value, 'attributesObj');
    }

    public addMethod(value: string): void {
        this.addProperty(value, 'methodsObj');
    }

    public removeAttribute(attr: Attribute): void {
        let idx = this.attributesObj.indexOf(attr);
        this.attributesObj.splice(idx, 1);
    }

    public removeMethod(method: Method): void {
        let idx = this.methodsObj.indexOf(method);
        this.methodsObj.splice(idx, 1);
    }

    public reDraw(drawOnlyIfSizeChanged?: boolean): void {
        let oldSize = { width: this.getSize().x, height: this.getSize().y };
        let newSize = this.reCalcSize();

        if (drawOnlyIfSizeChanged) {
            // size doenst changed, so nothing to redraw
            if (oldSize.width === newSize.width && oldSize.height === newSize.height) {
                return;
            }
        }

        // redraw only this clazz
        this.$owner.$view.removeChild(this.$view);
        let newSvg = this.getSVG();
        this.$owner.$view.appendChild(newSvg);
        this.$view = newSvg;
        EventBus.register(this, newSvg);

        this.redrawEdges();
    }

    public updateLabel(newLabel: string): void {
        this.label = newLabel;
        this.$labelView.textContent = newLabel;

        this.reDraw(true);
    }

    public reCalcSize(): Size {
        // label
        let newWidth = 150;
        newWidth = Math.max(newWidth, Util.sizeOf(this.label, this).width+30);

        // attributes
        this.attributesObj.forEach(attrEl => {

            let widthOfAttr;
            if(attrEl.$view){
                widthOfAttr = attrEl.$view.getBoundingClientRect().width;
            }
            else{
                widthOfAttr = Util.sizeOf(attrEl.toString(), this).width;
            }

            newWidth = Math.max(newWidth, widthOfAttr+15);
        });

        // methods
        this.methodsObj.forEach(methodEl => {
            let widthOfMethod;
            if(methodEl.$view){
                widthOfMethod = methodEl.$view.getBoundingClientRect().width;
            }
            else{
                widthOfMethod = Util.sizeOf(methodEl.toString(), this).width;
            }

            newWidth = Math.max(newWidth, widthOfMethod+15);
        });

        this.getSize().x = newWidth;
        this.getSize().y = this.labelHeight + ((this.attributesObj.length + this.methodsObj.length) * this.attrHeight)
            + this.attrHeight;

        let newSize = { width: newWidth, height: this.getSize().y };

        return newSize;
    }

    private getModernStyle(): Element {
        let width, height, id, size, z, item, rect, g, styleHeader, headerHeight, x, y;
        //let board = this.getRoot()['board'];
        styleHeader = Util.getStyle('ClazzHeader');
        headerHeight = styleHeader.getNumber('height');
        width = 0;
        height = 10 + headerHeight;

        if (this.property === 'Object' || this.getRoot()['$graphModel'].getType().toLowerCase() === 'objectdiagram') {
            id = this.id.charAt(0).toLowerCase() + this.id.slice(1);
            item = 'Object';
        } else {
            id = this.id;
            item = 'Clazz';
            if (this['counter']) {
                id += ' (' + this['counter'] + ')';
            }
        }
        g = Util.create({ tag: 'g', model: this });
        size = Util.sizeOf(id, this);
        width = Math.max(width, size.width);
        if (this.attributesObj && this.attributesObj.length > 0) {
            height = height + this.attributesObj.length * 25;
            for (z = 0; z < this.attributesObj.length; z += 1) {
                width = Math.max(width, Util.sizeOf(this.attributesObj[z], this).width);
            }
        } else {
            height += 20;
        }
        if (this.methodsObj && this.methodsObj.length > 0) {
            height = height + this.methodsObj.length * 25;
            for (z = 0; z < this.methodsObj.length; z += 1) {
                width = Math.max(width, Util.sizeOf(this.methodsObj[z], this).width);
            }
        }
        width += 20;

        let pos = this.getPos();
        y = pos.y;
        x = pos.x;

        rect = {
            tag: 'rect',
            'width': width,
            'height': height,
            'x': x,
            'y': y,
            'class': item + ' draggable',
            'fill': 'none'
        };
        g.appendChild(Util.create(rect));
        g.appendChild(Util.create({
            tag: 'rect',
            rx: 0,
            'x': x,
            'y': y,
            height: headerHeight,
            'width': width,
            'class': 'ClazzHeader'
        }));

        item = Util.create({
            tag: 'text',
            $font: true,
            'class': 'InfoText',
            'text-anchor': 'right',
            'x': x + width / 2 - size.width / 2,
            'y': y + (headerHeight / 2) + (size.height / 2),
            'width': size.width
        });

        if (this.property === 'Object' || this.getRoot()['$graphModel'].type.toLowerCase() === 'objectdiagram') {
            item.setAttribute('text-decoration', 'underline');
        }
        item.appendChild(document.createTextNode(id));

        g.appendChild(item);
        g.appendChild(Util.create({
            tag: 'line',
            x1: x,
            y1: y + headerHeight,
            x2: x + width,
            y2: y + headerHeight,
            stroke: '#000'
        }));
        y += headerHeight + 20;

        if (this.attributesObj) {
            for (z = 0; z < this.attributesObj.length; z += 1) {
                g.appendChild(Util.create({
                    tag: 'text',
                    $font: true,
                    'text-anchor': 'left',
                    'width': width,
                    'x': (x + 10),
                    'y': y,
                    value: this.attributesObj[z].toString()
                }));
                y += 20;
            }
            if (this.attributesObj.length > 0) {
                y -= 10;
            }
        }
        if (this.methodsObj && this.methodsObj.length > 0) {
            g.appendChild(Util.create({ tag: 'line', x1: x, y1: y, x2: x + width, y2: y, stroke: '#000' }));
            y += 20;
            for (z = 0; z < this.methodsObj.length; z += 1) {
                g.appendChild(Util.create({
                    tag: 'text',
                    $font: true,
                    'text-anchor': 'left',
                    'width': width,
                    'x': x + 10,
                    'y': y,
                    value: this.methodsObj[z].toString()
                }));
                y += 20;
            }
        }
        return g;
    }
}
