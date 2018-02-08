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

    protected attributesObj: Attribute[] = [];
    protected methodsObj: Method[] = [];
    protected $labelView: Element;

    constructor(json: JSON | string | Object | any) {
        super(json);
        if (!json) {
            json = {};
        }
        let y = this.labelHeight;
        this.label = json.name || json.label || ('New ' + this.property);

        let width: number = 150;

        if (json['attributes']) {
            for (let attr of json['attributes']) {

                let attrObj = new Attribute(attr);
                attrObj.$owner = this;
                this.attributesObj.push(attrObj);
                y += this.attrHeight;
                width = Math.max(width, Util.sizeOf(attrObj.toString(), this).width);
            }
        }
        if (json['methods']) {
            for (let method of json['methods']) {

                let methodObj = new Method(method);
                methodObj.$owner = this;
                this.methodsObj.push(methodObj);

                y += this.attrHeight;
                width = Math.max(width, Util.sizeOf(methodObj.toString(), this).width);
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
            ry: 10
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

        let group = this.createShape({ tag: 'g', id: this.id, class: 'SVGClazz', transform: 'translate(0 0)' });
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

            let groupOfAttributes = this.createShape({ tag: 'g', id: (this.id + 'Attributes') });
            groupOfAttributes.setAttributeNS(null, 'class', 'SVGClazzProperty SVGClazzAttribute');
            group.appendChild(groupOfAttributes);

            let y = pos.y + this.labelHeight + this.attrHeight / 2;
            for (let attr of this.attributesObj) {

                let attrSvg = attr.getSVG();
                attr.$owner = this;

                attrSvg.setAttributeNS(null, 'x', '' + (pos.x + 10));
                attrSvg.setAttributeNS(null, 'y', '' + y);

                groupOfAttributes.appendChild(attrSvg);
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

            let groupOfMethods = this.createShape({ tag: 'g', id: (this.id + 'Methods') });
            groupOfMethods.setAttributeNS(null, 'class', 'SVGClazzProperty SVGClazzMethod');
            group.appendChild(groupOfMethods);

            y += this.attrHeight / 2;
            for (let method of this.methodsObj) {

                let methodSvg = method.getSVG();
                method.$owner = this;

                methodSvg.setAttributeNS(null, 'x', '' + (pos.x + 10));
                methodSvg.setAttributeNS(null, 'y', '' + y);

                groupOfMethods.appendChild(methodSvg);
                y += this.attrHeight;
            }
        }

        this.$view = group;
        return group;
    }

    public getEvents(): string[] {
        return [EventBus.ELEMENTMOUSEDOWN, EventBus.ELEMENTMOUSEMOVE, EventBus.ELEMENTCLICK, EventBus.ELEMENTDRAG, EventBus.ELEMENTDBLCLICK, EventBus.EDITOR, EventBus.OPENPROPERTIES];
    }

    public addProperty(value: string, type: string): any {
        if (!this[type] || !value || value.length === 0) {
            return;
        }

        for (let valueOfType of this[type]) {
            if (valueOfType.toString() === value) {
                return;
            }
        }

        let extractedValue;
        if (Util.startsWith(type, 'attribute')) {
            extractedValue = new Attribute(value);
        }
        else if (Util.startsWith(type, 'method')) {
            extractedValue = new Method(value);
        }

        this[type].push(extractedValue);

        return extractedValue;
    }

    public addAttribute(value: string): Attribute {
        return this.addProperty(value, 'attributesObj');
    }

    public addMethod(value: string): Method {
        return this.addProperty(value, 'methodsObj');
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
        let hasSizeChanged: [boolean, Size] = this.hasSizeChanged();

        if (drawOnlyIfSizeChanged) {
            if (!hasSizeChanged[0]) {
                return;
            }
        }

        if (!this.$view) return;

        // redraw only this clazz
        this.$owner.$view.removeChild(this.$view);
        let newSvg = this.getSVG();
        this.$owner.$view.appendChild(newSvg);
        this.$view = newSvg;
        EventBus.register(this, newSvg);

        this.redrawEdges();
    }

    public hasSizeChanged(): [boolean, Size] {
        let oldSize = { width: this.getSize().x, height: this.getSize().y };
        let newSize = this.reCalcSize();

        // size doenst changed, so nothing to redraw
        if (oldSize.width === newSize.width && oldSize.height === newSize.height) {
            return [false, newSize];
        }

        return [true, newSize];
    }

    public updateLabel(newLabel: string): void {
        this.label = newLabel;
        if (this.$labelView) {
            this.$labelView.textContent = newLabel;
        }

        this.reDraw(true);

        // // if size has changed, so set the correct width to rect
        // let newSizeHasChanged: [boolean, Size] = this.hasSizeChanged();
        // if(newSizeHasChanged[0] && this.$view.hasChildNodes()){
        //     let newSize: Size = newSizeHasChanged[1];

        //     // get rect, first child of view
        //     let rect = <Element>this.$view.childNodes[0];
        //     rect.setAttributeNS(null, 'width', '' + newSize.width);
        //     rect.setAttributeNS(null, 'height', '' + newSize.height);

        //     this.redrawEdges();
        // }
    }

    public reCalcSize(): Size {
        // label
        let newWidth = 150;
        newWidth = Math.max(newWidth, Util.sizeOf(this.label, this).width + 30);

        // attributes
        this.attributesObj.forEach(attrEl => {

            let widthOfAttr;
            if (attrEl.$view) {
                widthOfAttr = attrEl.$view.getBoundingClientRect().width;
            }
            else {
                widthOfAttr = Util.sizeOf(attrEl.toString(), this).width;
            }

            newWidth = Math.max(newWidth, widthOfAttr + 15);
        });

        // methods
        this.methodsObj.forEach(methodEl => {
            let widthOfMethod;
            if (methodEl.$view) {
                widthOfMethod = methodEl.$view.getBoundingClientRect().width;
            }
            else {
                widthOfMethod = Util.sizeOf(methodEl.toString(), this).width;
            }

            newWidth = Math.max(newWidth, widthOfMethod + 15);
        });

        this.getSize().x = newWidth;
        this.getSize().y = this.labelHeight + ((this.attributesObj.length + this.methodsObj.length) * this.attrHeight)
            + this.attrHeight;

        let newSize = { width: newWidth, height: this.getSize().y };

        return newSize;
    }

    public redrawEdges() {
        for (let edge of this.edges) {
            edge.redraw(this);
        }
    }
}
