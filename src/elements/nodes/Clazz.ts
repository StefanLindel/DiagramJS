import { Node } from './Node';
import { EventBus } from '../../EventBus';
import { Util } from '../../util';
import { Point } from '../BaseElements';
import Attribute from './Attribute';
import Method from './Method';
import { Size } from '../index';
import ClazzProperty from './ClazzProperty';

export class Clazz extends Node {

    protected $labelHeight = 25;
    protected $labelFontSize = 14;
    protected $attrHeight = 25;
    protected $attrFontSize = 12;

    protected $labelView: Element;
    protected attributes: Attribute[] = [];
    protected methods: Method[] = [];
    protected modifier: string;

    constructor(json: JSON | string | Object | any) {
        super(json);
        if (!json) {
            json = {};
        }
        let y = this.$labelHeight;
        this.label = json.name || json.label || ('New ' + this.property);

        let width: number = 150;

        if (json['attributes']) {
            for (let attr of json['attributes']) {

                let attrObj = new Attribute(attr);
                attrObj.$owner = this;
                this.attributes.push(attrObj);
                y += this.$attrHeight;
                width = Math.max(width, Util.sizeOf(attrObj.toString()).width);
            }
        }
        if (json['methods']) {
            for (let method of json['methods']) {

                let methodObj = new Method(method);
                methodObj.$owner = this;
                this.methods.push(methodObj);

                y += this.$attrHeight;
                width = Math.max(width, Util.sizeOf(methodObj.toString()).width);
            }
            y += this.$attrHeight;
        }
        this.withSize(width, y);
        return this;
    }

    public getAttributesObj(): Attribute[] {
        return this.attributes;
    }

    public getMethodsObj(): Method[] {
        return this.methods;
    }

    public getSVG(): Element {
        const pos: Point = this.getPos();
        const size: Point = this.getSize();

        let group = this.createShape({ tag: 'g', id: this.id, class: 'SVGClazz', transform: 'translate(0 0)' });

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
            y: pos.y + this.$labelHeight / 2,
            'text-anchor': 'middle',
            'alignment-baseline': 'central',
            'font-family': 'Verdana',
            'font-size': this.$labelFontSize,
            'font-weight': 'bold',
            fill: 'black'
        });
        label.textContent = this.label;
        this.$labelView = label;


        group.appendChild(nodeShape);
        group.appendChild(label);

        // = = = ATTRIBUTES = = =
        if (this.attributes.length > 0) {

            // line to separate label from attributes
            const separatorLabelAttr = this.createShape({
                tag: 'line',
                x1: pos.x,                   // line doesn't overlap the full shape
                y1: pos.y + this.$labelHeight,
                x2: pos.x + size.x,        // line doesn't overlap the full shape
                y2: pos.y + this.$labelHeight,
                'stroke-width': 1
            });

            group.appendChild(separatorLabelAttr);

            let groupOfAttributes = this.createShape({ tag: 'g', id: (this.id + 'Attributes') });
            groupOfAttributes.setAttributeNS(null, 'class', 'SVGClazzProperty SVGClazzAttribute');
            group.appendChild(groupOfAttributes);

            let y = pos.y + this.$labelHeight + this.$attrHeight / 2;
            for (let attr of this.attributes) {

                let attrSvg = attr.getSVG();
                attr.$owner = this;

                attrSvg.setAttributeNS(null, 'x', '' + (pos.x + 10));
                attrSvg.setAttributeNS(null, 'y', '' + y);

                groupOfAttributes.appendChild(attrSvg);
                y += this.$attrHeight;
            }
        }

        // = = = METHODS = = =
        let height = this.attributes.length * this.$attrHeight;
        let y = pos.y + this.$labelHeight + height + this.$attrHeight / 2;
        if (this.methods.length > 0) {

            // line to separate label from attributes
            const separatorAttrMethods = this.createShape({
                tag: 'line',
                x1: pos.x,                   //line doesn't overlap the full shape
                y1: pos.y + this.$labelHeight + (this.$attrHeight * this.attributes.length),
                x2: pos.x + size.x,        //line doesn't overlap the full shape
                y2: pos.y + this.$labelHeight + (this.$attrHeight * this.attributes.length),
                'stroke-width': 1
            });


            group.appendChild(separatorAttrMethods);

            let groupOfMethods = this.createShape({ tag: 'g', id: (this.id + 'Methods') });
            groupOfMethods.setAttributeNS(null, 'class', 'SVGClazzProperty SVGClazzMethod');
            group.appendChild(groupOfMethods);

            y += this.$attrHeight / 2;
            for (let method of this.methods) {

                let methodSvg = method.getSVG();
                method.$owner = this;

                methodSvg.setAttributeNS(null, 'x', '' + (pos.x + 10));
                methodSvg.setAttributeNS(null, 'y', '' + y);

                groupOfMethods.appendChild(methodSvg);
                y += this.$attrHeight;
            }
        }

        this.$view = group;
        return group;
    }

    public copy(): Clazz { 
        let copy: Clazz; 
        copy = <Clazz>super.copy(); 
 
        // copy label 
        copy.label = this.label; 
 
        // copy attributes 
        this.attributes.forEach(attr => { 
            copy.attributes.push(new Attribute(attr.toString())); 
        }); 
 
        // copy methods 
        this.methods.forEach(method => { 
            copy.methods.push(new Method(method.toString())); 
        }); 
 
        return copy; 
    }

    public getEvents(): string[] {
        return [EventBus.ELEMENTMOUSEDOWN, EventBus.ELEMENTMOUSEMOVE, EventBus.ELEMENTCLICK, EventBus.ELEMENTDRAG, EventBus.ELEMENTDBLCLICK, EventBus.EDITOR, EventBus.OPENPROPERTIES];
    }

    public addProperty(value: string, type: string): any {
        if (!this[type] || !value || value.length === 0) {
            return;
        }

        let extractedValue;
        if (type === 'attributes') {
            extractedValue = new Attribute(value);
        }
        else if (type === 'methods') {
            extractedValue = new Method(value);
        }

        for (let valueOfType of this[type]) {
            if (valueOfType.toString() === extractedValue.toString()) {
                alert(extractedValue.toString() + ' already exists.');
                extractedValue = undefined;
                return;
            }
        }

        this[type].push(extractedValue);

        return extractedValue;
    }

    public addAttribute(value: string): Attribute {
        return this.addProperty(value, 'attributes');
    }

    public addMethod(value: string): Method {
        return this.addProperty(value, 'methods');
    }

    public removeAttribute(attr: Attribute): void {
        let idx = this.attributes.indexOf(attr);
        this.attributes.splice(idx, 1);
    }

    public removeMethod(method: Method): void {
        let idx = this.methods.indexOf(method);
        this.methods.splice(idx, 1);
    }

    public removeProperty(property: ClazzProperty): void {

        if (property instanceof Attribute) {
            this.removeAttribute(<Attribute>property);
        }

        if (property instanceof Method) {
            this.removeMethod(<Method>property);
        }
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

        // update label in all edges
        this.$edges.forEach(edge => {
            if(this.id === edge.$sNode.id){
                edge.source = newLabel;
            }
            else if(this.id === edge.$tNode.id){
                edge.target = newLabel;
            }
        });

        this.reDraw(true);
    }

    public updateModifier(modifier: string): void{
        this.modifier = modifier;
        console.log('modifier: ' + this.modifier);
    }

    public reCalcSize(): Size {
        // label
        let newWidth = 150;
        newWidth = Math.max(newWidth, Util.sizeOf(this.label).width + 30);

        // attributes
        this.attributes.forEach(attrEl => {

            let widthOfAttr;
            if (attrEl.$view) {
                widthOfAttr = attrEl.$view.getBoundingClientRect().width;
            }
            else {
                widthOfAttr = Util.sizeOf(attrEl.toString()).width;
            }

            newWidth = Math.max(newWidth, widthOfAttr + 15);
        });

        // methods
        this.methods.forEach(methodEl => {
            let widthOfMethod;
            if (methodEl.$view) {
                widthOfMethod = methodEl.$view.getBoundingClientRect().width;
            }
            else {
                widthOfMethod = Util.sizeOf(methodEl.toString()).width;
            }

            newWidth = Math.max(newWidth, widthOfMethod + 15);
        });

        // TODO: height has to be calculated by font-size
        this.getSize().x = newWidth;
        this.getSize().y = this.$labelHeight + ((this.attributes.length + this.methods.length) * this.$attrHeight)
            + this.$attrHeight;

        let newSize = { width: newWidth, height: this.getSize().y };

        return newSize;
    }

    public redrawEdges() {
        for (let edge of this.$edges) {
            edge.redraw(this);
        }
    }
}
